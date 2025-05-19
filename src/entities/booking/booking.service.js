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
    const availableSlots = await checkAvailabilityService(date, serviceId);

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
    const basePricePerHour = service.pricePerHour || 0;
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

        if (promo.discountType === 'percent') {
            total = total - total * (promo.discountValue / 100);
        } else if (promo.discountType === 'fixed') {
            total = total - promo.discountValue;
        }

        if (total < 0) total = 0;
        appliedPromo = promo._id;
    }

    // STEP 4: Create Booking
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
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    return booking;
};

;



export const getBookingById = async (id) => {
    const booking = await Booking.findById(id)
        .populate({
            path: 'service',
            populate: {
                path: 'room',
            }
        })
        .populate('promoCode');

    if (!booking) throw new Error('Booking not found');
    return booking;
};


export const getAllBookings = async (query = {}) => {
    return await Booking.find(query)
        .sort({ createdAt: -1 })
        .populate({
            path: 'service',
            populate: {
                path: 'room',
            }
        })
        .populate('promoCode');
};


export const updateBooking = async (id, status) => {
    const allowedStatuses = ["pending", "confirmed", "cancelled", "refunded"];

    if (!allowedStatuses.includes(status)) {
        throw new Error(`Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`);
    }

    const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    )
        .populate({
            path: "service",
            populate: { path: "room" }
        })
        .populate("promoCode");

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