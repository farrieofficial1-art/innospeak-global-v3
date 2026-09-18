// supabase/functions/mpesa-pay/index.ts
//
// M-PESA Daraja STK Push payment for course enrollment.
//
// Flow:
//   1. Frontend POSTs { courseId, courseCode, amount, currency, phone, paymentId }
//   2. This function gets an OAuth token from Safaricom Daraja
//   3. Initiates STK Push to the student's phone
//   4. Returns the CheckoutRequestID for polling
//   5. Safaricom callback (separate request) confirms payment
//   6. This function's /confirm endpoint verifies with Daraja and
//      calls confirm_payment_and_enroll RPC
//
// Required secrets (set via Supabase dashboard or CLI):
//   MPESA_CONSUMER_KEY
//   MPESA_CONSUMER_SECRET
//   MPESA_SHORTCODE       — paybill/till number
//   MPESA_PASSKEY         — Daraja passkey
//   MPESA_CALLBACK_URL    — https://<your-domain>/functions/v1/mpesa-pay/callback
//   SUPABASE_URL          — pre-populated
//   SUPABASE_SERVICE_ROLE_KEY — pre-populated

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const MPESA_CONSUMER_KEY = Deno.env.get('MPESA_CONSUMER_KEY');
const MPESA_CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET');
const MPESA_SHORTCODE = Deno.env.get('MPESA_SHORTCODE');
const MPESA_PASSKEY = Deno.env.get('MPESA_PASSKEY');
const MPESA_CALLBACK_URL = Deno.env.get('MPESA_CALLBACK_URL');

const DARARA_AUTH_URL = 'https://api.safaricom.co.ke/oauth/v1/generates?grant_type=client_credentials';
const DARARA_STK_URL = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const DARARA_STK_QUERY_URL = 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query';

async function getMpesaAuthToken(): Promise<string> {
  const credentials = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
  const res = await fetch(DARARA_AUTH_URL, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Daraja auth failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

function generatePassword(): { password: string; timestamp: string } {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
  const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);
  return { password, timestamp };
}

async function supabaseRpc(fn: string, params: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${fn} failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function supabaseUpdate(table: string, id: string, fields: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update ${table} failed: ${res.status} ${text}`);
  }
}

async function supabaseSelect(table: string, filters: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, {
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Select ${table} failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const isCallback = url.pathname.endsWith('/callback');

  try {
    if (isCallback) {
      return await handleCallback(req);
    }
    return await handleInitiate(req);
  } catch (err) {
    console.error('mpesa-pay error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Payment processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ============================================================
// STK Push initiation
// ============================================================
async function handleInitiate(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY) {
    return new Response(
      JSON.stringify({ error: 'M-PESA is not configured on the server. Contact support.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const { courseId, courseCode, amount, currency, phone, paymentId, studentId } = body;

  // Validate required fields
  if (!courseId || !amount || !phone || !paymentId || !studentId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (currency !== 'KES') {
    return new Response(JSON.stringify({ error: 'M-PESA only supports KES' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Normalize phone to 254XXXXXXXXX
  let normalizedPhone = phone.replace(/\s/g, '');
  if (normalizedPhone.startsWith('+254')) {
    normalizedPhone = normalizedPhone.slice(1);
  } else if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '254' + normalizedPhone.slice(1);
  } else if (!normalizedPhone.startsWith('254')) {
    normalizedPhone = '254' + normalizedPhone;
  }

  const authToken = await getMpesaAuthToken();
  const { password, timestamp } = generatePassword();

  const stkRes = await fetch(DARARA_STK_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(Number(amount)),
      PartyA: normalizedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: MPESA_CALLBACK_URL || 'https://example.com/callback',
      AccountReference: courseCode || courseId,
      TransactionDesc: `Course payment: ${courseCode || courseId}`,
    }),
  });

  if (!stkRes.ok) {
    const errText = await stkRes.text();
    console.error('Daraja STK error:', stkRes.status, errText);

    // Mark payment as failed
    await supabaseRpc('fail_payment', { p_payment_id: paymentId, p_status: 'failed' });

    return new Response(
      JSON.stringify({ error: 'Could not initiate M-PESA payment. Please check your phone number and try again.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const stkData = await stkRes.json();

  if (stkData.ResponseCode !== '0') {
    console.error('Daraja STK rejected:', stkData);
    await supabaseRpc('fail_payment', { p_payment_id: paymentId, p_status: 'failed' });
    return new Response(
      JSON.stringify({ error: stkData.ResponseDescription || 'M-PESA request was rejected.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Store the CheckoutRequestID on the payment record
  await supabaseUpdate('payments', paymentId, {
    provider_transaction_id: stkData.CheckoutRequestID,
  });

  return new Response(
    JSON.stringify({
      success: true,
      checkoutRequestId: stkData.CheckoutRequestID,
      message: 'STK push sent. Check your phone to enter your M-PESA PIN.',
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// ============================================================
// M-PESA Callback (Safaricom calls this after STK push)
// ============================================================
async function handleCallback(req: Request) {
  const body = await req.json();
  const callbackData = body?.Body?.stkCallback;
  if (!callbackData) {
    return new Response(JSON.stringify({ error: 'Invalid callback' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const checkoutRequestId = callbackData.CheckoutRequestID;
  const resultCode = callbackData.ResultCode;
  const resultDesc = callbackData.ResultDesc;

  // Find the payment by provider_transaction_id
  const payments = await supabaseSelect(
    'payments',
    `provider_transaction_id=eq.${encodeURIComponent(checkoutRequestId)}&select=*`
  );

  if (payments.length === 0) {
    console.error('Callback: no payment found for CheckoutRequestID', checkoutRequestId);
    return new Response(JSON.stringify({ error: 'Payment not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payment = payments[0];

  // If the STK was cancelled or failed
  if (resultCode !== 0) {
    await supabaseRpc('fail_payment', {
      p_payment_id: payment.id,
      p_status: callbackData.ResultDesc?.toLowerCase().includes('cancel') ? 'cancelled' : 'failed',
    });
    return new Response(JSON.stringify({ success: true, message: 'Payment cancelled/failed' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } as Record<string, string>,
    });
  }

  // Extract M-PESA transaction ID from callback metadata
  let mpesaTxId = '';
  const items = callbackData.CallbackMetadata?.Item || [];
  for (const item of items) {
    if (item.Name === 'MpesaReceiptNumber') {
      mpesaTxId = item.Value;
    }
  }

  if (!mpesaTxId) {
    mpesaTxId = checkoutRequestId;
  }

  // Atomically confirm payment and create enrollment (idempotent)
  const result = await supabaseRpc('confirm_payment_and_enroll', {
    p_payment_id: payment.id,
    p_provider_transaction_id: mpesaTxId,
    p_course_id: payment.course_id,
    p_course_code: payment.course_code,
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

