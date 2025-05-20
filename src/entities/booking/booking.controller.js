import { generateResponse } from '../../lib/responseFormate.js';
import { checkAvailabilityService, createBookingService } from './booking.service.js';


export const createBookingController = async (req, res) => {
  try {
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
      return generateResponse(res, 400, false, "User details are incomplete");
    }
    if (!date || !timeSlots || !service || !room || !numberOfPeople) {
      return generateResponse(res, 400, false, "Missing required booking fields");
    }
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return generateResponse(res, 400, false, "At least one time slot must be selected");
    }

    // Create booking
    const booking = await createBookingService({
      user,
      date,
      timeSlots,
      service,
      room,
      promoCode,
      numberOfPeople,
    });

    generateResponse(res, 201, true, "Booking created successfully", booking);
  } catch (error) {
    console.error("Create Booking Error:", error);
    generateResponse(res, 500, false, "Booking failed", error.message);
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


export const checkAvailabilityController = async (req, res) => {
  try {
    const { date, serviceId } = req.body;

    if (!date || !serviceId) {
      return generateResponse(res, 400, false, "date and serviceId are required");
    }

    const slots = await checkAvailabilityService(date, serviceId);
    generateResponse(res, 200, true, "Available slots fetched successfully", slots);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to check availability", error.message);
  }
};