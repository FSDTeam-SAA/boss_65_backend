import express from 'express';
import { deleteApplication, getAllApplications, getApplicationById, newApplication, updateApplication } from './application.controller.js';

const router = express.Router();



router.post('/apply', newApplication)
router.get('/', getAllApplications)
router.get('/:id', getApplicationById)
router.patch('/:id', updateApplication)
router.delete('/:id', deleteApplication)

export default router;