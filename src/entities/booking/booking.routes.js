import express from 'express';
import {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from './booking.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.post('/', createBooking); 
router.get('/', getAllBookings);
router.get('/:id', getBookingById);

// Admin Only
router.put('/:id', verifyToken, adminMiddleware, updateBooking);
router.delete('/:id', verifyToken, adminMiddleware, deleteBooking);

export default router;

