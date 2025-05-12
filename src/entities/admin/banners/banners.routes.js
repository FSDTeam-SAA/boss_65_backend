import express from 'express';
import { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner } from './banners.controller.js';

const router = express.Router();

// Create a new banner
router.post('/', createBanner);

// Get all banners
router.get('/', getAllBanners);

// Get a specific banner by ID
router.get('/:id', getBannerById);

// Update a banner by ID
router.put('/:id', updateBanner);

// Delete a banner by ID
router.delete('/:id', deleteBanner);

export default router;

