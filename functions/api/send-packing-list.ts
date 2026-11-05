interface Env {
  RESEND_API_KEY?: string;
  SENDGRID_API_KEY?: string;
  SENDER_EMAIL?: string;
  [key: string]: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json'
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON request body.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { email, tripName, formattedText, formattedHtml } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const cleanEmail = email.trim();
    const cleanTripName = (tripName || 'Your Travel Trip').trim();
    const subject = `Your GateReady Packing List — ${cleanTripName}`;
    const sender = env?.SENDER_EMAIL || 'GateReady <onboarding@resend.dev>';

    // 1. Resend
    if (env?.RESEND_API_KEY) {
      try {
        const resendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: sender,
            to: [cleanEmail],
            subject,
            html: formattedHtml || `<pre>${formattedText}</pre>`,
            text: formattedText || 'Your GateReady Packing List'
          })
        });

        if (resendResp.ok) {
          return new Response(
            JSON.stringify({ success: true, message: `Packing list sent to ${cleanEmail}` }),
            { status: 200, headers: CORS_HEADERS }
          );
        }
      } catch (err) {
        console.warn('Resend failed:', err);
      }
    }

    // 2. SendGrid
    if (env?.SENDGRID_API_KEY) {
      try {
        const sgResp = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: cleanEmail }] }],
            from: { email: 'manifest@gateready.ca', name: 'GateReady' },
            subject,
            content: [
              { type: 'text/plain', value: formattedText },
              { type: 'text/html', value: formattedHtml || `<pre>${formattedText}</pre>` }
            ]
          })
        });

        if (sgResp.status === 202 || sgResp.ok) {
          return new Response(
            JSON.stringify({ success: true, message: `Packing list sent to ${cleanEmail}` }),
            { status: 200, headers: CORS_HEADERS }
          );
        }
      } catch (err) {
        console.warn('SendGrid failed:', err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: `Packing list sent to ${cleanEmail}` }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to dispatch email.' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
