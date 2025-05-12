import mongoose, { Schema } from 'mongoose';

const bannerSchema = new Schema(
    {
        bannerId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true
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

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;

