import express from 'express';
import { createHomepageSection, getAllHomepageSections, updateHomepageSection, deleteHomepageSection } from './homepageSections.controller.js';

const router = express.Router();

router.post('/create', createHomepageSection);
router.get('get-all-homepage-sections', getAllHomepageSections);
router.patch('update-homepage-section/:id', updateHomepageSection);
router.delete('delete-homepage-section/:id', deleteHomepageSection);

export default router;
