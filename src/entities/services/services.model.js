import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // e.g., "M-F 3hrs 12-6PM"
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    daysOfWeek: {
      type: [String],
      required: true,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    startHour: {
      type: String,
      required: true 
    },
    endHour: {
      type: String,
      required: true 
    },
    durationHours: {
      type: Number,
      required: true,
      min: 1 // e.g., 3 hours
    },
    availability: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


// Validate that endHour is after startHour
serviceSchema.pre("save", function(next) {
  const start = new Date(`1970-01-01 ${this.startHour}`);
  const end = new Date(`1970-01-01 ${this.endHour}`);
  if (start >= end) {
    return next(new Error("endHour must be after startHour"));
  }
  next();
});

// Index to optimize queries for category and room
serviceSchema.index({ category: 1, room: 1 });

const Service = mongoose.model("Service", serviceSchema);
export default Service;