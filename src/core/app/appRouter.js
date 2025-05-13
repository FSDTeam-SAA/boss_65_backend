import express from 'express';
import testRoutes from '../../entities/test/b.routes.js';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import contactRoutes from '../../entities/contact/contact.routes.js';
import newsletterSubscriptionRoutes from '../../entities/newsletterSubscription/newsletterSubscription.routes.js'
import reviewsRoutes from '../../entities/review/review.routes.js'
import applicationRoutes from '../../entities/application/application.routes.js'
import lenderRoutes from '../../entities/lender/Listings/lisitngs.routes.js'
import adminListingRoutes from '../../entities/admin/Lisitngs/ReviewandMain Site Listing/adminListing.routes.js'

const router = express.Router();

// Define all your routes here
router.use('/v1/tests', testRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/contact', contactRoutes)
router.use('/v1/newsletterSubscription', newsletterSubscriptionRoutes)
router.use('/v1/reviews', reviewsRoutes)
router.use('/v1/application', applicationRoutes)
router.use('/v1/lender', lenderRoutes)
router.use('/v1/admin',adminListingRoutes)





export default router;
