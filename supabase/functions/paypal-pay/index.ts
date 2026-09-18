// supabase/functions/paypal-pay/index.ts
//
// PayPal checkout for course enrollment.
//
// Flow:
//   1. Frontend POSTs to /create-order with { courseId, courseCode, amount, currency, paymentId }
//   2. This function creates a PayPal order server-side
//   3. Frontend redirects to PayPal approval URL
//   4. After approval, frontend POSTs to /capture with { paymentId, orderId }
//   5. This function captures the order via PayPal API
//   6. On success, calls confirm_payment_and_enroll RPC
//
// Required secrets:
//   PAYPAL_CLIENT_ID
//   PAYPAL_CLIENT_SECRET
//   PAYPAL_BASE_URL — https://api-m.paypal.com (live) or https://api-m.sandbox.paypal.com (sandbox)
//   SUPABASE_URL — pre-populated
//   SUPABASE_SERVICE_ROLE_KEY — pre-populated

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE_URL = Deno.env.get('PAYPAL_BASE_URL') || 'https://api-m.paypal.com';

async function getPaypalAccessToken(): Promise<string> {
  const credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    if (url.pathname.endsWith('/create-order')) {
      return await handleCreateOrder(req);
    }
    if (url.pathname.endsWith('/capture')) {
      return await handleCapture(req);
    }

    return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('paypal-pay error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Payment processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ============================================================
// Create PayPal order
// ============================================================
async function handleCreateOrder(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: 'PayPal is not configured on the server. Contact support.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const { courseId, courseCode, amount, currency, paymentId } = body;

  if (!courseId || !amount || !paymentId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const accessToken = await getPaypalAccessToken();

  const orderRes = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: paymentId,
          description: `Course: ${courseCode || courseId}`,
          amount: {
            currency_code: currency || 'USD',
            value: Number(amount).toFixed(2),
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    }),
  });

  if (!orderRes.ok) {
    const errText = await orderRes.text();
    console.error('PayPal create order error:', orderRes.status, errText);
    await supabaseRpc('fail_payment', { p_payment_id: paymentId, p_status: 'failed' });
    return new Response(
      JSON.stringify({ error: 'Could not create PayPal order. Please try again.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const orderData = await orderRes.json();

  // Store PayPal order ID on payment record
  await supabaseUpdate('payments', paymentId, {
    provider_transaction_id: orderData.id,
  });

  // Find the approval URL
  const approvalUrl = orderData.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href;

  return new Response(
    JSON.stringify({
      success: true,
      orderId: orderData.id,
      approvalUrl,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// ============================================================
// Capture PayPal order (after buyer approval)
// ============================================================
async function handleCapture(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({ error: 'PayPal is not configured on the server.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const { paymentId, orderId } = body;

  if (!paymentId || !orderId) {
    return new Response(JSON.stringify({ error: 'Missing paymentId or orderId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const accessToken = await getPaypalAccessToken();

  const captureRes = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!captureRes.ok) {
    const errText = await captureRes.text();
    console.error('PayPal capture error:', captureRes.status, errText);
    await supabaseRpc('fail_payment', { p_payment_id: paymentId, p_status: 'failed' });
    return new Response(
      JSON.stringify({ error: 'PayPal payment could not be captured. Please try again.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const captureData = await captureRes.json();

  // Verify the capture status is COMPLETED
  const captureStatus = captureData?.status;
  if (captureStatus !== 'COMPLETED') {
    console.error('PayPal capture not completed:', captureStatus);
    await supabaseRpc('fail_payment', { p_payment_id: paymentId, p_status: 'failed' });
    return new Response(
      JSON.stringify({ error: 'PayPal payment was not completed.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get the capture ID from the purchase unit
  const captureId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || orderId;

  // Atomically confirm payment and create enrollment (idempotent)
  const result = await supabaseRpc('confirm_payment_and_enroll', {
    p_payment_id: paymentId,
    p_provider_transaction_id: captureId,
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

