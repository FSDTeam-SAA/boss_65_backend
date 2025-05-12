import mongoose from "mongoose";

const ReferralAndLoyaltyProgramSchema = new mongoose.Schema(
    {
        codeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        code: {
            type: String,
            required: true,
            trim: true
        },
        discount: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'expired'],
            required: true
        },
    },
    { timestamps: true }
);

const ReferralAndLoyaltyProgram = mongoose.model(
    "ReferralAndLoyaltyProgram",
    ReferralAndLoyaltyProgramSchema
);

export default ReferralAndLoyaltyProgram;
