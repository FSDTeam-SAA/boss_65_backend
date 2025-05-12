import { generateResponse } from "../../../../lib/responseFormate.js";
import ReferralAndLoyaltyProgram from "./referralAndLoyaltyPrograms.model.js";

export const createReferralAndLoyaltyProgram = async (req, res) => {
    const { programName, programType, programDesc, programImage, programStatus } = req.body;
    try {
        const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.create({
            programName,
            programType,
            programDesc,
            programImage,
            programStatus
        });
        generateResponse("Referral and Loyalty Program created successfully", { referralAndLoyaltyProgram })
    } catch (error) {
        generateResponse("Error creating Referral and Loyalty Program", {}, error)
    }
};

export const getAllReferralAndLoyaltyPrograms = async (req, res) => {
    try {
        const referralAndLoyaltyPrograms = await ReferralAndLoyaltyProgram.find();
        res.status(200).json(generateResponse("All Referral and Loyalty Programs", { referralAndLoyaltyPrograms }));
    } catch (error) {
        res.status(400).json(generateResponse("Error getting Referral and Loyalty Programs", {}, error));
    }
};

export const getReferralAndLoyaltyProgramById = async (req, res) => {
    const { id } = req.params;
    try {
        const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.findById(id);
        if (!referralAndLoyaltyProgram) return res.status(404).json(generateResponse("Referral and Loyalty Program not found", {}, "Referral and Loyalty Program not found"));
        res.status(200).json(generateResponse("Referral and Loyalty Program found", { referralAndLoyaltyProgram }));
    } catch (error) {
        res.status(400).json(generateResponse("Error getting Referral and Loyalty Program", {}, error));
    }
};

export const updateReferralAndLoyaltyProgram = async (req, res) => {
    const { id } = req.params;
    const { programName, programType, programDesc, programImage, programStatus } = req.body;
    try {
        const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.findByIdAndUpdate(id, {
            programName,
            programType,
            programDesc,
            programImage,
            programStatus
        }, { new: true, runValidators: true });
        if (!referralAndLoyaltyProgram) return res.status(404).json(generateResponse("Referral and Loyalty Program not found", {}, "Referral and Loyalty Program not found"));
        res.status(200).json(generateResponse("Referral and Loyalty Program updated successfully", { referralAndLoyaltyProgram }));
    } catch (error) {
        res.status(400).json(generateResponse("Error updating Referral and Loyalty Program", {}, error));
    }
};

export const deleteReferralAndLoyaltyProgram = async (req, res) => {
    const { id } = req.params;
    try {
        const referralAndLoyaltyProgram = await ReferralAndLoyaltyProgram.findByIdAndDelete(id);
        if (!referralAndLoyaltyProgram) return res.status(404).json(generateResponse("Referral and Loyalty Program not found", {}, "Referral and Loyalty Program not found"));
        res.status(200).json(generateResponse("Referral and Loyalty Program deleted successfully", { referralAndLoyaltyProgram }));
    } catch (error) {
        res.status(400).json(generateResponse("Error deleting Referral and Loyalty Program", {}, error));
    }
};
