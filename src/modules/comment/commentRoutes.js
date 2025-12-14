import Router from 'express';
import { commentSchema } from './commentValidation.js';
import * as controller from './commentController.js';
import { validate } from '../../middlewares/validator.js';
import { authorize } from '../../middlewares/authorization.js';
import { dynamicRateLimiter } from '../../middlewares/rateLimit.js';
const router = Router({ mergeParams: true });
 
router.get('/post-comments/:postId', dynamicRateLimiter('read'), controller.getPostComments);
router.get('/:commentId', dynamicRateLimiter('read'), controller.getComment);
router.post('/:postId', authorize, dynamicRateLimiter('commentCreate'), validate(commentSchema), controller.addComment);
router.patch('/:commentId', authorize, dynamicRateLimiter('commentUpdate'),validate(commentSchema), controller.editComment);
router.delete('/:commentId', authorize, dynamicRateLimiter('commentDelete'), controller.deleteComment);

export default router;                                                  