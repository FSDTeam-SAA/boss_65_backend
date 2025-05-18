// import Booking from './booking.model.js';
// import Service from '../services/services.model.js';
// import PromoCode from '../promo_code/promo_code.model.js';


// export const createBooking = async (data) => {
//   const {
//     user,
//     date,
//     timeSlot,
//     service,
//     promoCode,
//   } = data;

//   if (
//     !user ||
//     !user.firstName ||
//     !user.lastName ||
//     !user.email ||
//     !user.phone ||
//     typeof user.numberOfPeople !== 'number'
//   ) {
//     throw new Error('User information is incomplete or invalid');
//   }
  
//   // Fetch the service and its associated room
//   const selectedService = await Service.findById(service).populate('room');
//   if (!selectedService) throw new Error('Service not found');
//   if (!selectedService.room) throw new Error('Service has no associated room');

//   const room = selectedService.room;

//   // Promo code validation
//   let discount = 0;
//   let validPromo = null;
//   if (promoCode) {
//     const promo = await PromoCode.findById(promoCode);
//     if (promo && promo.active) {
//       discount = promo.discountAmount || 0;
//       validPromo = promo._id;
//     }
//   }

//   const total = Math.max(selectedService.price - discount, 0);

//   const booking = new Booking({
//     user,
//     date,
//     timeSlot,
//     service,
//     promoCode: validPromo,
//     total,
//     status: 'pending'
//   });

//   return await booking.save(); 
// };


// export const getBookingById = async (id) => {
//   const booking = await Booking.findById(id)
//     .populate({
//       path: 'service',
//       populate: {
//         path: 'room',
//       }
//     })
//     .populate('promoCode');

//   if (!booking) throw new Error('Booking not found');
//   return booking;
// };


// export const getAllBookings = async (query = {}) => {
//   return await Booking.find(query)
//     .sort({ createdAt: -1 })
//     .populate({
//       path: 'service',
//       populate: {
//         path: 'room',
//       }
//     })
//     .populate('promoCode');
// };


// export const updateBooking = async (id, status) => {
//   const allowedStatuses = ["pending", "confirmed", "cancelled", "refunded"];

//   if (!allowedStatuses.includes(status)) {
//     throw new Error(`Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`);
//   }

//   const booking = await Booking.findByIdAndUpdate(
//     id,
//     { status },
//     { new: true, runValidators: true }
//   )
//     .populate({
//       path: "service",
//       populate: { path: "room" }
//     })
//     .populate("promoCode");

//   if (!booking) throw new Error("Booking not found or update failed");
//   return booking;
// };


// export const deleteBooking = async (id) => {
//   const deleted = await Booking.findByIdAndDelete(id);
//   if (!deleted) throw new Error('Booking not found or already deleted');
//   return true;
// };
