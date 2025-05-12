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
    const application = await Application.findByIdAndUpdate(id, data, { new: true });
    if (!application) throw new Error('Application not found');
    return application;
}
export const deleteApplication = async (id) => {
    const application = await Application.findByIdAndDelete(id);
    if (!application) throw new Error('Application not found');
    return application;
}




export const createUserFromApplication = async (applicationId) => {
  try {
    // Step 1: Find the approved application
    const application = await Application.findById(applicationId);
    if (!application || application.status !== 'approved') {
      throw new Error('Application is not approved or does not exist');
    }

    // Step 2: Generate a random password
    const password = generateRandomPassword(); 

    // Step 3: Create the user with the application information
    const user = new User({
      email: application.businessEmail,
      username: application.businessEmail, 
      password, 
      role: 'LENDER', 
      fullName: application.fullName,
      businessName: application.businessName,
      businessAddress: application.businessAddress,
      phoneNumber: application.phoneNumber,
    });

    await user.save();

    // Step 4: Send the password email
    const emailContent = lenderCredentialsTemplate(application.fullName, application.businessEmail, password);
    await sendEmail({
      to: application.businessEmail,
      subject: 'Your Account Details - [Your Service Name]',
      html: emailContent,
    });

    return user;
  } catch (error) {
    console.error('Error creating user from application:', error);
    throw new Error('Failed to create user or send email');
  }
};
