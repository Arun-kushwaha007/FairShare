'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlistAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    return { error: 'Name and email are required.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Waitlist <onboarding@resend.dev>',
      to: 'fairshare4u@gmail.com',
      subject: `New Waitlist Join: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #7c3aed;">New Waitlist Joiner!</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated notification from your FairShare Waitlist protocol.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { error: 'Failed to send verification signal.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Waitlist Action Error:', err);
    return { error: 'An unexpected system error occurred.' };
  }
}
