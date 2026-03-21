'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'All fields are required for transmission.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact Signal <onboarding@resend.dev>',
      to: 'fairshare4u@gmail.com',
      subject: `New Signal from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; background: #fafafa; border-radius: 12px;">
          <h2 style="color: #7c3aed; margin-bottom: 4px;">Incoming Transmission</h2>
          <p style="font-size: 12px; color: #666; margin-bottom: 24px;">Source: ${name} (${email})</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">FairShare Signal Protocol v1.0</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Contact Error:', error);
      return { error: 'Transmission interrupted. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Contact Action Error:', err);
    return { error: 'System error. Protocol failure.' };
  }
}
