
import mongoose from 'mongoose';

const { Schema } = mongoose;

// lender application schema 
const LenderApplicationSchema = new Schema(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    abnNumber: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    businessAddress: {

      type: String,
      required: [true, 'Business address is required'],
      trim: true,
    },
    instagramHandle: {
      type: String,
      trim: true,
    },
    businessWebsite: {
      type: String,
      trim: true,
    },
    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    numberOfDresses: {
      type: Number,
      default: 0,
      min: [0, 'Number of dresses cannot be negative'],
    },
    allowTryOn: {
      type: Boolean,
      default: false,
    },
    allowLocalPickup: {
      type: Boolean,
      default: false,
    },
    shipAustraliaWide: {
      type: Boolean,
      default: false,
    },
    reviewStockMethod: {
      type: String,
      enum: ['Website', 'Instagram', 'Photo', 'In-person', 'Video Call'],
    },
    agreedTerms: {
      type: Boolean,
      required: [true, 'You must agree to the terms'],
    },
    agreedCurationPolicy: {
      type: Boolean,
      required: [true, 'You must agree to the curation policy'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reasonForRejection: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
   
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id;
      },
    },
  }
);

export default mongoose.model('LenderApplication', LenderApplicationSchema);
