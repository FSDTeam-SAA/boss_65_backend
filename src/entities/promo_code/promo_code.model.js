import mongoose, { Schema } from "mongoose";

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true 
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      required: true,
      default: "Percentage" 
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0 
    },
    expiryDate: {
      type: Date,
      required: true 
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 0,
      default: 0 
    },
    active: {
      type: Boolean,
      default: true
    },
    usedCount: {
      type: Number,
      default: 0 
    }
  },
  {
    timestamps: true
  }
);


// Pre-save hook to validate expiryDate is in the future
promoCodeSchema.pre("save", function(next) {
  const now = new Date();
  if (this.expiryDate <= now) {
    return next(new Error("Expiration date must be in the future"));
  }
  next();
});

// Pre-save hook to validate usage limit
promoCodeSchema.pre("save", function(next) {
  if (this.usageLimit < this.usedCount) {
    return next(new Error("Usage limit cannot be less than the number of times used"));
  }
  next();
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
export default PromoCode;