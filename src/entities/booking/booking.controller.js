// import * as bookingService from './booking.service.js';
// import { generateResponse } from '../../lib/responseFormate.js';


// export const createBooking = async (req, res) => {
//   try {
//     const booking = await bookingService.createBooking(req.body);
//     return generateResponse(res, 201, true, 'Booking created successfully', booking);
//   } catch (error) {
//     return generateResponse(res, 400, false, error.message, null);
//   }
// };


// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await bookingService.getAllBookings();
//     return generateResponse(res, 200, true, 'Bookings fetched successfully', bookings);
//   } catch (error) {
//     return generateResponse(res, 500, false, 'Failed to fetch bookings', null);
//   }
// };


// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await bookingService.getBookingById(req.params.id);
//     return generateResponse(res, 200, true, 'Booking fetched successfully', booking);
//   } catch (error) {
//     return generateResponse(res, 404, false, error.message, null);
//   }
// };


// export const updateBooking = async (req, res) => {
//   try {
//     const { status } = req.body;
//     if (!status) {
//       return generateResponse(res, 400, false, 'Status is required', null);
//     }

//     const updatedBooking = await bookingService.updateBooking(req.params.id, status);
//     return generateResponse(res, 200, true, 'Booking status updated successfully', updatedBooking);
//   } catch (error) {
//     return generateResponse(res, 400, false, error.message, null);
//   }
// };


// export const deleteBooking = async (req, res) => {
//   try {
//     await bookingService.deleteBooking(req.params.id);
//     return generateResponse(res, 200, true, 'Booking deleted successfully', null);
//   } catch (error) {
//     return generateResponse(res, 400, false, error.message, null);
//   }
// };
