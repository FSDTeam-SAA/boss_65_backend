import PromoCode from '../promo_code/promo_code.model.js';
import Booking from './booking.model.js';
import Service from '../admin/Services/createServices.model.js';
import { slotGenerator } from '../../lib/slotGenerator.js';


export const createBookingService = async (data) => {
    const {
        user,
        date,
        timeSlots,
        service: serviceId,
        room,
        promoCode,
        numberOfPeople,
    } = data;

    // Validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) throw new Error('Invalid date');

    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Service not found');

// STEP 1: Check if selected slots are still available
const { slots: availableSlots } = await checkAvailabilityService(date, serviceId);

for (let requestedSlot of timeSlots) {
    const match = availableSlots.find(
        slot =>
            slot.start === requestedSlot.start &&
            slot.end === requestedSlot.end &&
            slot.available === true
    );
    if (!match) {
        throw new Error(`Slot ${requestedSlot.start} - ${requestedSlot.end} is no longer available.`);
    }
}


    // STEP 2: Calculate total price based on duration
    const durationPerSlot = service.slotDurationHours; // in hours
    const basePricePerHour = service.pricePerSlot || 0;
    const totalHours = timeSlots.length * durationPerSlot;
    let total = basePricePerHour * totalHours;


    

    // STEP 3: Apply promo code if applicable
    let appliedPromo = null;
    if (promoCode) {
        const promo = await PromoCode.findOne({ code: promoCode, active: true });
        if (!promo) throw new Error('Invalid promo code');

        if (promo.expiresAt && promo.expiresAt < new Date()) {
            throw new Error('Promo code expired');
        }

        if (promo.discountType === 'Percentage') {
            total = total - total * (promo.discountValue / 100);
        } else if (promo.discountType === 'fixed') {
            total = total - promo.discountValue;
        }

        if (total < 0) total = 0;
        appliedPromo = promo._id;


    }

     // STEP 4: Check and apply free slot logic
    // -----------------------------

    // Count how many confirmed bookings user already has (excluding cancelled/refunded)
    const finalizedBookingCount = await Booking.countDocuments({
        'user.email': user.email.toLowerCase(),
        status: 'confirmed'
    });

    // Calculate how many free slots user should have earned
    const freeSlotsShouldHave = Math.floor(finalizedBookingCount / 10);

    // Get how many free slots user was awarded in previous bookings
    // We find the latest booking with freeSlotsAwarded to get the number
    const latestBooking = await Booking.findOne({ 'user.email': user.email.toLowerCase() })
      .sort({ createdAt: -1 });

    const freeSlotsAwarded = latestBooking?.freeSlotsAwarded || 0;

    // If user should have more free slots than awarded, apply free booking now
    if (freeSlotsShouldHave > freeSlotsAwarded) {
        total = 0; // make this booking free
    }







    // STEP 5: Create Booking
    const booking = await Booking.create({
        user: {
            ...user,
            numberOfPeople
        },
        date: bookingDate,
        timeSlots,
        service: serviceId,
        room,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        promoCode: appliedPromo || undefined,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        freeSlotsAwarded: freeSlotsShouldHave > freeSlotsAwarded ? freeSlotsAwarded + 1 : freeSlotsAwarded
    });
    return booking;
};



export const getBookingById = async (id) => {
  const booking = await Booking.findById(id)
    .populate('service')
    .populate('room')        // ✅ Populate 'room' directly
    .populate('promoCode');  // ✅ Populate promoCode

  if (!booking) throw new Error('Booking not found');
  return booking;
};


export const getAllBookings = async (query = {}) => {
  return await Booking.find(query).sort({ createdAt: -1 });
};

export const updateBooking = async (id, status) => {
  const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'refunded'];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Allowed values are: ${allowedStatuses.join(', ')}`);
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )

  if (!booking) throw new Error("Booking not found or update failed");
  return booking;
};


export const deleteBooking = async (id) => {
  const deleted = await Booking.findByIdAndDelete(id);
  if (!deleted) throw new Error('Booking not found or already deleted');
  return true;
};



// generating time slots and checking the time slots are availabel or not
export const checkAvailabilityService = async (date, serviceId) => {
    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Service not found');

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) throw new Error('Invalid date');

    const weekday = bookingDate.toLocaleDateString('en-SG', { weekday: 'short' });

    // If service is not available on this day, return a signal to the controller
    if (!service.availableDays.includes(weekday)) {
        return { available: false, slots: [], weekday };
    }

    const slots = slotGenerator(
        date,
        service.timeRange.start,
        service.timeRange.end,
        service.slotDurationHours,
        60 // stepMinutes
    );

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
        return { available: true, slots: slots.map(slot => ({ ...slot, available: true })) };
    }

    const bookedSlots = existingBookings.flatMap(b => b.timeSlots);

    const availableSlots = slots.map(slot => {
        const isBooked = bookedSlots.some(
            (b) => slot.start < b.end && slot.end > b.start
        );
        return { ...slot, available: !isBooked };
    });

    return { available: true, slots: availableSlots };
};
