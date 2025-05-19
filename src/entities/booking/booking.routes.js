import express from 'express';
import {
 
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  createBookingController,
} from './booking.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';
import { checkAvailabilityController } from './booking.controller.js';


const router = express.Router();

// Public
router.post('/', createBookingController); 
router.get('/', verifyToken, adminMiddleware, getAllBookings);
router.get('/:id', getBookingById);
router.post('/check-availability', checkAvailabilityController);

// Admin Only
router.put('/:id', verifyToken, adminMiddleware, updateBooking);
router.delete('/:id', verifyToken, adminMiddleware, deleteBooking);


export default router;
