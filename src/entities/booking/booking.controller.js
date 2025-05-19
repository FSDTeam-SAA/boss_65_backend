
import { generateResponse } from '../../lib/responseFormate.js';

export const createBookingController = async (req, res) => {
    try {
        // Extract booking data from request body
        const {
            user,
            date,
            timeSlots,
            service,
            room,
            promoCode,
            numberOfPeople,
        } = req.body;

        // Basic validation
        if (!user || !user.firstName || !user.lastName || !user.email || !user.phone) {
            return res.status(400).json({ message: 'User details are incomplete' });
        }
        if (!date || !timeSlots || !service || !room || !numberOfPeople) {
            return res.status(400).json({ message: 'Missing required booking fields' });
        }
        if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
            return res.status(400).json({ message: 'At least one time slot must be selected' });
        }

        // Call the booking service to create the booking
        const booking = await createBookingService({
            user,
            date,
            timeSlots,
            service,
            room,
            promoCode,
            numberOfPeople,
        });

        return res.status(201).json({
            message: 'Booking created successfully',
            booking,
        });
    } catch (error) {
        console.error('Create Booking Error:', error);
        return res.status(400).json({ message: error.message || 'Booking failed' });
    }
};






export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();
        return generateResponse(res, 200, true, 'Bookings fetched successfully', bookings);
    } catch (error) {
        return generateResponse(res, 500, false, 'Failed to fetch bookings', null);
    }
};


export const getBookingById = async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        return generateResponse(res, 200, true, 'Booking fetched successfully', booking);
    } catch (error) {
        return generateResponse(res, 404, false, error.message, null);
    }
};


export const updateBooking = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return generateResponse(res, 400, false, 'Status is required', null);
        }

        const updatedBooking = await bookingService.updateBooking(req.params.id, status);
        return generateResponse(res, 200, true, 'Booking status updated successfully', updatedBooking);
    } catch (error) {
        return generateResponse(res, 400, false, error.message, null);
    }
};


export const deleteBooking = async (req, res) => {
    try {
        await bookingService.deleteBooking(req.params.id);
        return generateResponse(res, 200, true, 'Booking deleted successfully', null);
    } catch (error) {
        return generateResponse(res, 400, false, error.message, null);
    }
};



// controllers/booking.controller.js
import { checkAvailabilityService, createBookingService } from './booking.service.js';

export const checkAvailabilityController = async (req, res) => {
    try {
        const { date, serviceId } = req.body;

        if (!date || !serviceId) {
            return res.status(400).json({ error: 'date and serviceId are required' });
        }

        const slots = await checkAvailabilityService(date, serviceId);
        return res.status(200).json({ slots });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};