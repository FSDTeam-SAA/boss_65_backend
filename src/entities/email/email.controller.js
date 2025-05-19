// email/email.controller.js
import { sendEmail } from './email.service.js';

export const sendEmailController = async (req, res) => {
  const { email, subject, body } = req.body;

  if (!email || !subject || !body) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const data = await sendEmail({ to: email, subject, body });
    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};
