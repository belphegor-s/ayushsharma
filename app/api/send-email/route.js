import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'Ayush Sharma <hello@ayushsharma.me>';

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const escapeHtml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const safeName = escapeHtml(name.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>');

    const html = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0d10; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background-color: #131419; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="height: 3px; background: linear-gradient(90deg, #3b82f6, #60a5fa);"></td>
              </tr>
              <tr>
                <td style="padding: 36px 36px 28px;">
                  <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #f3f4f6; letter-spacing: -0.01em;">
                    Thanks for reaching out, ${safeName}
                  </h1>
                  <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #9ca3af;">
                    Got your message — I'll get back to you shortly.
                  </p>
                  <p style="margin: 0 0 10px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #60a5fa;">
                    Your message
                  </p>
                  <div style="padding: 16px 18px; background-color: #0c0d10; border: 1px solid rgba(255,255,255,0.06); border-left: 2px solid #3b82f6; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #d1d5db;">
                    ${safeMessage}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 36px 32px; border-top: 1px solid rgba(255,255,255,0.06);">
                  <p style="margin: 0; font-size: 13px; color: #6b7280;">
                    — Ayush Sharma
                  </p>
                  <a href="https://ayushsharma.me" style="font-size: 13px; color: #60a5fa; text-decoration: none;">ayushsharma.me</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Thanks for your message, ${name}`,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }

    console.log('Resend Success:', data);
    return NextResponse.json({ success: true, messageId: data?.id }, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
