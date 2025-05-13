import Application from './application.model.js';
import { generateRandomPassword } from '../../lib/generatePassword.js'; 
import lenderCredentialsTemplate from '../../lib/lenderCredentialsTemplate.js';
import sendEmail from '../../lib/sendEmail.js'; 
import User from '../auth/auth.model.js'

export const createApplication = async (data) => {
    const exists = await Application.findOne({ businessEmail: data.businessEmail });
    if (exists) throw new Error('An application with this email already exists');

    const application = new Application(data);
    return await application.save();
};


export const getAllApplications = async () => {
    const applications = await Application.find().sort({ createdAt: -1 });
    if (!applications) throw new Error('No applications found');
    return applications;
}
export const getApplicationById = async (id) => {
    const application = await Application.findById(id);
    if (!application) throw new Error('Application not found');
    return application;
}
export const updateApplication = async (id, data) => {
  const prevApp = await Application.findById(id);
  if (!prevApp) throw new Error('Application not found');

  const wasPending = prevApp.status === 'pending';
  const isNowApproved = data.status === 'approved';

  const updatedApplication = await Application.findByIdAndUpdate(id, data, { new: true });

  // Only create user + send email if:
  // 1. It was pending before
  // 2. Status is now 'approved'
  if (wasPending && isNowApproved) {
    // Check if a user with the same email already exists to avoid duplicates
    const existingUser = await User.findOne({ email: updatedApplication.businessEmail });
    if (!existingUser) {
      const password = generateRandomPassword();

      const user = new User({
        email: updatedApplication.businessEmail,
        username: updatedApplication.businessEmail,
        password,
        role: 'LENDER',
        fullName: updatedApplication.fullName,
        businessName: updatedApplication.businessName,
        businessAddress: updatedApplication.businessAddress,
        phoneNumber: updatedApplication.phoneNumber,
      });

      await user.save();

      const emailContent = lenderCredentialsTemplate(
        updatedApplication.fullName,
        updatedApplication.businessEmail,
        password
      );

      await sendEmail({
        to: updatedApplication.businessEmail,
        subject: 'Your Lender Account Details',
        html: emailContent,
      });
    }
  }

  return updatedApplication;
};
export const deleteApplication = async (id) => {
    const application = await Application.findByIdAndDelete(id);
    if (!application) throw new Error('Application not found');
    return application;
}



