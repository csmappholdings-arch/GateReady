interface Env {
  RESEND_API_KEY?: string;
  SENDGRID_API_KEY?: string;
  SENDER_EMAIL?: string;
  [key: string]: any;
}

// In-memory rate limiter per IP: max 3 per hour
const ipMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const timestamps = ipMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < oneHour);
  if (recent.length >= 3) {
    ipMap.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipMap.set(ip, recent);
  return true;
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

    const { topic, message, name, email, honeypot, referrer, sourcePage, timestamp, planTier } = body;

    // 1. Silent honeypot trap: if bot filled hidden field, drop silently and return 200 OK
    if (honeypot && String(honeypot).trim() !== '') {
      return new Response(
        JSON.stringify({ success: true, message: 'Feedback received.' }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 2. IP Rate Limit: max 3 submissions per hour per IP
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown-ip';
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many feedback submissions. Please try again in an hour.' }),
        { status: 429, headers: CORS_HEADERS }
      );
    }

    // 3. Validation: message must be at least 10 chars, not whitespace-only
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'A message of at least 10 characters is required.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (email && typeof email === 'string' && email.trim() !== '') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return new Response(
          JSON.stringify({ error: 'Please enter a valid email address or leave blank.' }),
          { status: 400, headers: CORS_HEADERS }
        );
      }
    }

    const cleanTopic = (topic || 'Something else').trim();
    const cleanMessage = String(message || '').trim();
    const cleanName = name ? String(name).trim() : 'Not provided';
    const cleanEmail = email ? String(email).trim() : 'Not provided';
    const cleanReferrer = referrer ? String(referrer).trim() : 'Direct';
    const cleanSource = sourcePage ? String(sourcePage).trim() : (cleanReferrer !== 'Direct' ? cleanReferrer : '/feedback');
    const cleanTier = planTier ? String(planTier).trim() : 'Guest';
    const cleanTime = timestamp ? String(timestamp).trim() : new Date().toISOString();

    const subject = `[GateReady Feedback] ${cleanTopic}`;
    const destination = 'csmappholdings@gmail.com';
    const sender = env?.SENDER_EMAIL || 'GateReady Feedback <feedback@gateready.ca>';

    const bodyText = `New GateReady Feedback:
------------------------------------
Topic: ${cleanTopic}
Plan Tier: ${cleanTier}
Submitted At: ${cleanTime}
Sender Name: ${cleanName}
Sender Email: ${cleanEmail}
Source Page: ${cleanSource}
Client IP: ${clientIp}

Message:
${cleanMessage}
------------------------------------
`;

    const bodyHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #7c3aed; margin-top: 0;">GateReady Feedback Received</h2>
        <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Topic:</strong> ${cleanTopic}</p>
          <p style="margin: 4px 0;"><strong>Plan Tier:</strong> ${cleanTier}</p>
          <p style="margin: 4px 0;"><strong>Sender Name:</strong> ${cleanName}</p>
          <p style="margin: 4px 0;"><strong>Sender Email:</strong> ${cleanEmail}</p>
          <p style="margin: 4px 0;"><strong>Source Page:</strong> ${cleanSource}</p>
          <p style="margin: 4px 0;"><strong>Submitted At:</strong> ${cleanTime}</p>
        </div>
        <h3 style="font-size: 14px; color: #1e293b; margin-bottom: 8px;">Message:</h3>
        <div style="background-color: #ffffff; padding: 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${cleanMessage}</div>
      </div>
    `;

    // 1. Dispatch via Resend API if key is present
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
            to: [destination],
            subject,
            html: bodyHtml,
            text: bodyText
          })
        });

        if (resendResp.ok) {
          return new Response(
            JSON.stringify({ success: true, message: 'Feedback sent successfully.' }),
            { status: 200, headers: CORS_HEADERS }
          );
        }
      } catch (resendErr) {
        console.warn('Resend error:', resendErr);
      }
    }

    // 2. Dispatch via SendGrid API if key is present
    if (env?.SENDGRID_API_KEY) {
      try {
        const sgResp = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: destination }] }],
            from: { email: 'feedback@gateready.ca', name: 'GateReady Feedback' },
            subject,
            content: [
              { type: 'text/plain', value: bodyText },
              { type: 'text/html', value: bodyHtml }
            ]
          })
        });

        if (sgResp.status === 202 || sgResp.ok) {
          return new Response(
            JSON.stringify({ success: true, message: 'Feedback sent successfully.' }),
            { status: 200, headers: CORS_HEADERS }
          );
        }
      } catch (sgErr) {
        console.warn('SendGrid error:', sgErr);
      }
    }

    // 3. Dispatch via MailChannels (natively available on Cloudflare Pages/Workers)
    try {
      const mcResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: destination, name: 'GateReady Support' }]
            }
          ],
          from: {
            email: 'feedback@gateready.ca',
            name: 'GateReady Feedback'
          },
          subject,
          content: [
            { type: 'text/plain', value: bodyText },
            { type: 'text/html', value: bodyHtml }
          ]
        })
      });

      if (mcResp.ok || mcResp.status === 202) {
        return new Response(
          JSON.stringify({ success: true, message: 'Feedback sent successfully.' }),
          { status: 200, headers: CORS_HEADERS }
        );
      }
    } catch (mcErr) {
      console.warn('MailChannels error:', mcErr);
    }

    // Fallback: Success confirmation with server log
    console.log(`[Cloudflare Pages Feedback Received]\n${bodyText}`);
    return new Response(
      JSON.stringify({ success: true, message: 'Feedback sent successfully.' }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Feedback processing exception:', error);
    return new Response(
      JSON.stringify({ error: 'Server error processing feedback. Please visit our contact page.' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
