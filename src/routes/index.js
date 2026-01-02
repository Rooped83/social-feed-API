import Router from 'express';
import postRoutes from '../modules/post/postRoutes.js';
import authRoutes from '../modules/auth/authRoutes.js';
import userRoutes from '../modules/user/userRoutes.js';
import commentRoutes from '../modules/comment/commentRoutes.js';
const router = Router(); 
router.use('/posts', postRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);

export default router;