// lib/emailTemplates.js

const lenderCredentialsTemplate = (name, email, password) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
    <h1 style="color: #333; text-align: center;">Welcome to Muse Gala </h1>
    <p style="font-size: 16px; color: #555;">Hello ${name},</p>
    <p style="font-size: 16px; color: #555;">Your application has been approved! Here are your login details:</p>
    <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
    <p style="font-size: 16px; color: #555;"><strong>Password:</strong> ${password}</p>
    <p style="font-size: 16px; color: #555;">Please use the above details to log in and update your profile.</p>
    <p style="font-size: 16px; color: #555;">If you didn't request this, please ignore this email.</p>
    <footer style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
      &copy; 2023 Your Company Name. All rights reserved.
    </footer>
  </div>
`;
export default lenderCredentialsTemplate;