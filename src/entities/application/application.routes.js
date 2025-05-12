import express from 'express';
import { approveApplication, deleteApplication, getAllApplications, getApplicationById, newApplication, updateApplication } from './application.controller.js';
import { adminMiddleware, lenderMiddleware, userAdminLenderMiddleware, verifyToken } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();



router.post('/apply', newApplication)
router.get('/', verifyToken, adminMiddleware, getAllApplications)
router.get('/:id', verifyToken, lenderMiddleware, adminMiddleware, getApplicationById)
router.patch('/:id', verifyToken, adminMiddleware, updateApplication)
router.patch('/approve/:id', verifyToken, adminMiddleware, approveApplication)
router.delete('/:id', verifyToken, userAdminLenderMiddleware, deleteApplication)


export default router;