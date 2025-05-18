// import mongoose, { Schema } from "mongoose";

// const bookingSchema = new Schema(
//   {
//     user: {
//       firstName: {
//         type: String,
//         required: true,
//         trim: true
//       },
//       lastName: {
//         type: String,
//         required: true,
//         trim: true
//       },
//       email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true
//       },
//       phone: {
//         type: String,
//         required: true,
//         trim: true
//       },
//       numberOfPeople: {
//         type: Number,
//         required: true,
//         min: 1
//       }
//     },
//     date: {
//       type: Date,
//       required: true
//     },
//     timeSlot: {
//       start: {
//         type: String, // "12:00 PM"
//         required: true
//       },
//       end: {
//         type: String, // "3:00 PM"
//         required: true
//       }
//     },
//     service: {
//       type: Schema.Types.ObjectId,
//       ref: "Service",
//       required: true
//     },
//     promoCode: {
//       type: Schema.Types.ObjectId,
//       ref: "PromoCode",
//       default: null
//     },
//     total: {
//       type: Number,
//       required: true,
//       min: 0
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled", "refunded"],
//       default: "pending"
//     },
//     stripeSessionId: {
//       type: String
//     }
//   },
//   {
//     timestamps: true
//   }
// );


// // Index 
// bookingSchema.index({ service: 1, date: 1, "timeSlot.start": 1, "timeSlot.end": 1 });


// // Pre-save hook to validate date and time 
// // Validate that the booking date is not in the past and not more than 30 days in the future
// bookingSchema.pre("validate", async function (next) {

//   const booking = this;    // this refrers to the the current booking document being validated
//   const now = new Date();

//   if (booking.date < now.setHours(0, 0, 0, 0)) {
//     return next(new Error("Cannot book for a past date."));
//   }

//   const maxFutureDate = new Date();
//   maxFutureDate.setDate(maxFutureDate.getDate() + 30);
//   if (booking.date > maxFutureDate) {
//     return next(new Error("Booking date is too far in the future."));
//   }

//   next();
// });



// bookingSchema.pre("save", async function (next) {
//   const booking = this;

//   // Service and room existence
//   const service = await mongoose.model("Service").findById(booking.service).populate("room");
//   if (!service) return next(new Error("Service not found."));

//   const room = service.room;
//   if (!room) return next(new Error("Room not associated with service."));

//   // Check room capacity
//   if (booking.user.numberOfPeople > room.maxCapacity) {
//     return next(new Error(`Room capacity exceeded. Max allowed: ${room.maxCapacity}`));
//   }

//   // Check day of week
//   const bookingDay = booking.date.toLocaleDateString("en-US", { weekday: "short" });
//   if (!service.daysOfWeek.includes(bookingDay)) {
//     return next(new Error(`Service not available on ${bookingDay}`));
//   }

//   // Convert time to minutes for easier comparison
//   const toMinutes = (t) => {
//     const [hourMin, meridian] = t.split(" ");
//     let [hour, min] = hourMin.split(":").map(Number);
//     if (meridian === "PM" && hour !== 12) hour += 12;
//     if (meridian === "AM" && hour === 12) hour = 0;
//     return hour * 60 + min;
//   };

//   const slotStart = toMinutes(booking.timeSlot.start);
//   const slotEnd = toMinutes(booking.timeSlot.end);
//   const serviceStart = toMinutes(service.startHour);
//   const serviceEnd = toMinutes(service.endHour);

//   // Validate time slot
//   if (slotStart < serviceStart || slotEnd > serviceEnd) {
//     return next(new Error("Selected time slot is outside of service hours."));
//   }

//   // Overlapping check for bookings
//   const overlappingBookings = await mongoose.model("Booking").find({
//     service: booking.service,
//     date: booking.date,
//     $or: [
//       {
//         "timeSlot.start": { $lt: booking.timeSlot.end },
//         "timeSlot.end": { $gt: booking.timeSlot.start }
//       }
//     ]
//   });


//   // overbooking a room 
//   // overlapping bookings, through them and sum the number of people
//   let totalPeople = booking.user.numberOfPeople;
//   for (const b of overlappingBookings) {
//     totalPeople += b.user.numberOfPeople;
//   }

//   if (totalPeople > room.maxCapacity) {
//     return next(new Error("Time slot fully booked for selected service."));
//   }

//   next();
// });

// const Booking = mongoose.model("Booking", bookingSchema);
// export default Booking;
