import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'Ayush Sharma <hello@ayushsharma.me>';
const toEmail = 'hello@ayushsharma.me';

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

    const html = `
    <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; border: 0; background-color: #ffffff; font-family: Arial, sans-serif; color: #333;">
        <tr>
            <td style="background-color: #00bfa6; color: #fff; text-align: center; padding: 20px; font-size: 22px; font-weight: bold; border-radius: 8px 8px 0 0;">
                Contact Form Submission
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; font-size: 16px; line-height: 1.5;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="background-color: #f4f4f4; padding: 10px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
            </td>
        </tr>
    </table>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New Contact Form Message from ${name}`,
      headers: {
        'Reply-To': email,
      },
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
