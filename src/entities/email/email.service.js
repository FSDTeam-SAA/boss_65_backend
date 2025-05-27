// email/email.service.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, body ,name,phoneNumber}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM1,
      to: [to],
      subject,
      html: `
      <h3>Contact Message Details</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phoneNumber || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${body}</p>
    `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Email send error:', err);
    throw err;
  }
};
