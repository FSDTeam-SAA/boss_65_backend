import express from 'express';
import { createHomepageSection, getAllHomepageSections } from './homepageSections.controller.js';

const router = express.Router();

router.post('/', createHomepageSection);
router.get('/', getAllHomepageSections);

export default router;
