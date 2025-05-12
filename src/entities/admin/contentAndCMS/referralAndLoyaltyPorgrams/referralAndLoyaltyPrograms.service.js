import ReferralAndLoyaltyProgram from './referralAndLoyaltyPrograms.model.js'; 

export const createReferralAndLoyaltyProgramService = async (data) => {
    const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.create(data);
    return referralAndLoyaltyProgram;
};

export const getAllReferralAndLoyaltyProgramsService = async () => {
    const referralAndLoyaltyPrograms = await ReferralAndLoyaltyProgram.find();
    return referralAndLoyaltyPrograms;
};

export const getReferralAndLoyaltyProgramByIdService = async (id) => {
    const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.findById(id);
    return referralAndLoyaltyProgram;
};

export const updateReferralAndLoyaltyProgramService = async (id, data) => {
    const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return referralAndLoyaltyProgram;
};

export const deleteReferralAndLoyaltyProgramService = async (id) => {
    const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.findByIdAndDelete(id);
    return referralAndLoyaltyProgram;
};

