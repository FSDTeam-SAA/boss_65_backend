import Application from './application.model.js';


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