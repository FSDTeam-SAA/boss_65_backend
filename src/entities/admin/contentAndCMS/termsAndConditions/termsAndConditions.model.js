import mongoose, { Schema } from 'mongoose';

const termsAndConditionsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['active', 'draft'],
            required: true
        }
    },
    {
        timestamps: true
    }
)

const TermsAndConditions = mongoose.model('TermsAndConditions', termsAndConditionsSchema);

export default TermsAndConditions;
