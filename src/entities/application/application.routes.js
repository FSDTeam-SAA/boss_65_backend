import express from 'express';
import { approveApplication, deleteApplication, getAllApplications, getApplicationById, newApplication, updateApplication } from './application.controller.js';
import { adminMiddleware, verifyToken } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();



router.post('/apply', newApplication)
router.get('/', getAllApplications)
router.get('/:id', getApplicationById)
router.patch('/:id', updateApplication)
router.patch('/approve/:id',verifyToken,adminMiddleware, approveApplication)
router.delete('/:id', deleteApplication)


export default router;