import { supabase } from './client';

/**
 * payments — data layer for course payments (M-PESA + PayPal).
 *
 * Free courses (price = 0) skip this layer entirely and use the
 * existing enrollment flow. Paid courses create a pending payment,
 * go through the provider's checkout, and only after server-side
 * confirmation does the enrollment get activated.
 */

function assertConfigured() {
  if (!supabase) {
    throw new Error('Payments are unavailable because Supabase has not been configured.');
  }
}

/**
 * Create a pending payment record in the database.
 * The edge function will update it after provider confirmation.
 */
export async function createPendingPayment({ courseId, courseCode, amount, currency, provider, phone }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  if (!uid) throw new Error('You must be logged in to make a payment.');

  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        student_id: uid,
        course_id: courseId,
        course_code: courseCode,
        amount,
        currency,
        provider,
        phone: phone || null,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    // Handle duplicate active payment
    if (error.code === '23505') {
      throw new Error('You already have an active payment for this course. Please complete or cancel it first.');
    }
    throw error;
  }
  return data;
}

/**
 * Initiate M-PESA STK Push via edge function.
 */
export async function initiateMpesaPayment({ paymentId, courseId, courseCode, amount, currency, phone }) {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('mpesa-pay', {
    body: {
      action: 'initiate',
      paymentId,
      courseId,
      courseCode,
      amount,
      currency,
      phone,
    },
  });
  if (error) throw new Error(error.message || 'Could not initiate M-PESA payment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Create a PayPal order via edge function.
 * Returns { orderId, approvalUrl }.
 */
export async function createPaypalOrder({ paymentId, courseId, courseCode, amount, currency }) {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('paypal-pay', {
    body: {
      action: 'create-order',
      paymentId,
      courseId,
      courseCode,
      amount,
      currency,
    },
  });
  if (error) throw new Error(error.message || 'Could not create PayPal order.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Capture a PayPal order after buyer approval.
 */
export async function capturePaypalOrder({ paymentId, orderId }) {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('paypal-pay', {
    body: {
      action: 'capture',
      paymentId,
      orderId,
    },
  });
  if (error) throw new Error(error.message || 'Could not capture PayPal payment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Get the current user's payments.
 */
export async function listMyPayments() {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Check if a student has a paid payment for a course.
 */
export async function checkCoursePaid(courseId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('id, status')
    .eq('course_id', courseId)
    .eq('status', 'paid')
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Get a single payment by ID.
 */
export async function getPayment(paymentId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ============================================================
// Admin: list all payments
// ============================================================
export async function listAllPayments() {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
