import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import contactRoutes from '../../entities/contact/contact.routes.js';
import cmsRoutes from '../../entities/admin/CMS/cms.routes.js' 
import categoryRoutes from '../../entities/category/category.routes.js';
import roomRoutes from '../../entities/room/room.routes.js';
import serviceRoutes from '../../entities/services/services.routes.js';


const router = express.Router();

// Define all your routes here
router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/contact', contactRoutes)
router.use('/v1/admin',cmsRoutes)
router.use('/v1/category', categoryRoutes);
router.use('/v1/room', roomRoutes);
router.use('/v1/service', serviceRoutes);





export default router;
