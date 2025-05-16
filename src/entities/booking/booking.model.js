import mongoose, { Schema } from "mongoose";
import Room from "../room/room.model";

const bookingSchema = new Schema(
  {
    user: {
      firstName: {
        type: String,
        required: true,
        trim: true
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      numberOfPeople: {
        type: Number,
        required: true,
        min: 1
      }
    },
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      start: {
        type: String,
        required: true // e.g., "12:00 PM"
      },
      end: {
        type: String,
        required: true // e.g., "3:00 PM"
      }
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
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    promoCode: {
      type: Schema.Types.ObjectId,
      ref: "PromoCode",
      default: null
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);


// Validate numberOfPeople against room.maxCapacity
bookingSchema.pre("save", async function(next) {
  const room = await Room.findById(this.room);
  if (!room) {
    return next(new Error("Room not found"));
  }
  if (this.numberOfPeople > room.maxCapacity) {
    return next(new Error(`Number of people exceeds room capacity of ${room.maxCapacity}`));
  }
  next();
});

// Index for efficient time slot overlap checks
bookingSchema.index({ room: 1, date: 1, "timeSlot.start": 1, "timeSlot.end": 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;