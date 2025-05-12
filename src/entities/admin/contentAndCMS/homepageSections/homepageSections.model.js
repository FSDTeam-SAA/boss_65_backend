import mongoose, { Schema } from 'mongoose';

const homepageSectionSchema = new Schema(
    {
        sectionId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        sectionName: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        imageURL: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['published', 'draft'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const HomepageSection = mongoose.model('HomepageSection', homepageSectionSchema);

export default HomepageSection;
