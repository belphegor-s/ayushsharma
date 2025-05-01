import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'Ayush Sharma <hello@ayushsharma.me>';

const CONTACT_FORM_SUBMISSION_ENDPOINT = `https://contact-form-worker.ayush2162002.workers.dev/api/submit`;

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch(CONTACT_FORM_SUBMISSION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response && response.status === 201) {
      const data = await response.json();
      console.log('Contact form submission successful:', data);
    }

    const html = `
      <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
        <tr>
          <td style="padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #00bfa6; margin-top: 0;">Thanks for your message, ${name}</h2>
            <p style="font-size: 15px; line-height: 1.6;">
              We've received your message and will get in touch with you shortly.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; margin: 0;"><strong>Your Message:</strong></p>
            <div style="background-color: #f4f4f4; padding: 12px; border-radius: 4px; margin-top: 8px; font-size: 14px; line-height: 1.5;">
              ${message.replace(/\n/g, '<br>')}
            </div>
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
