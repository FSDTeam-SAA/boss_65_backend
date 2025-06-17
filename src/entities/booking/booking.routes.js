import express from 'express';
import {
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  createBookingController,
  getBookingStats,
  getBookingByEmail,
} from './booking.controller.js';
import { verifyToken, adminMiddleware , optionalVerifyToken } from '../../core/middlewares/authMiddleware.js';
import { checkAvailabilityController } from './booking.controller.js';


const router = express.Router();


// Public
router.post('/', optionalVerifyToken,  createBookingController); 
router.get('/stats',getBookingStats);
router.get('/', verifyToken, adminMiddleware, getAllBookings);
router.get('/:id', getBookingById);
router.post('/check-availability', checkAvailabilityController);

router
  .route('/')
  .post(optionalVerifyToken, createBookingController)   
  .get(verifyToken, adminMiddleware, getAllBookings);    


router.get('/stats', getBookingStats);                  

router.get('/by-email', getBookingByEmail);              

router.post('/check-availability', checkAvailabilityController);  

router
  .route('/:id')
  .get(getBookingById)                                     
  .put(verifyToken, adminMiddleware, updateBooking)       
  .delete(verifyToken, adminMiddleware, deleteBooking);
export default router;
