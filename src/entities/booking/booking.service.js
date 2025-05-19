// import Booking from './booking.model.js';
// import Service from '../services/services.model.js';
// import PromoCode from '../promo_code/promo_code.model.js';
import Booking from '../booking/booking.model.js';
import Service from '../admin/Services/createServices.model.js';

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





// generating time slots and checking the time slots are availabel or not
export const checkAvailabilityService = async (date, serviceId) => {
    const service = await Service.findById(serviceId);
    // console.log('Service:', service);
    if (!service) throw new Error('Service not found');
  
    const bookingDate = new Date(date);
    console.log('Booking Date:', bookingDate);
    if (isNaN(bookingDate.getTime())) throw new Error('Invalid date');
  
    const weekday = bookingDate.toLocaleDateString('en-SG', { weekday: 'short' });
  
    if (!service.availableDays.includes(weekday)) {
      throw new Error(`Service not available on ${weekday}`);
    }
  
    // Generate slots
    const slots = slotGenerator(
      date,
      service.timeRange.start,
      service.timeRange.end,
      service.slotDurationHours,
      60 // stepMinutes
    );
    console.log('Generated Slots:', slots);
  
    // Find bookings for the whole day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  
    const existingBookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      service: serviceId,
      status: { $in: ['pending', 'confirmed'] }
    });
  
    if (existingBookings.length === 0) {
      // No bookings found, return all slots available
      return slots.map(slot => ({ ...slot, available: true }));
    }
  
    // Flatten booked slots from bookings
    const bookedSlots = existingBookings.flatMap(b => b.timeSlots);
  
    // Mark slots as available or booked
    const availableSlots = slots.map(slot => {
      const isBooked = bookedSlots.some(
        (b) => slot.start < b.end && slot.end > b.start
      );
      return { ...slot, available: !isBooked };
    });
  
    return availableSlots;
  };