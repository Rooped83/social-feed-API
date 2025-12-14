import Router from 'express';
import { authorize } from '../../middlewares/authorization.js';
import { validate } from '../../middlewares/validator.js';
import { postSchema } from './validation/createPostSchema.js';
import { updatePostSchema } from './validation/updatePostSchema.js';
const router = Router({ mergeParams: true });
import * as controller  from './postController.js';
import { dynamicRateLimiter } from '../../middlewares/rateLimit.js';
//get posts 
router.get('/', dynamicRateLimiter('read'),controller.getAllPosts);
router.get('/user-posts/:id', dynamicRateLimiter('read'), authorize, controller.getUserPosts);
router.get('/:id', authorize, dynamicRateLimiter('read'), controller.getPostById);
router.get('/category/:category', dynamicRateLimiter('read'), authorize, controller.getPostsByCategory);
//create/update/delete posts
router.post('/',  authorize, dynamicRateLimiter('postCreate'), validate(postSchema), controller.createPost);
router.patch('/:id', authorize,dynamicRateLimiter('postUpdate'), validate(updatePostSchema), controller.updatePost);
router.delete('/:id', authorize, dynamicRateLimiter('postDelete'), controller.deletePost);
export default router;