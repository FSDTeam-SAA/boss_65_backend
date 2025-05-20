import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    price: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    stripeSessionId: { type: String },
    refundId: {
        type: String,
        default: null,
        unique: true,
        sparse: true
      },
      
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Indexes
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);