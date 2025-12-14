import * as commentService from './commentService.js';
import { asyncHandler } from '../../core/utils/asyncCatch.js';

//  comment to a post:
export const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const comment = await commentService.addComment(postId, userId, text);
    res.status(201).json({ success: true, message: "Comment added successfully", comment: comment });
});

export const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const result = await commentService.getCommentsByPostId(postId);
    res.status(200).json({ success: true, message: "Comments fetched successfully", result });
});

export const getComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await commentService.getComment(commentId);
    res.status(200).json({ success: true, message: "Comment fetched successfully", comment });
})
export const editComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const updatedComment = await commentService.editComment(commentId, userId, text);
    res.status(200).json({ success: true, message: "Comment updated successfully", comment: updatedComment });
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    await commentService.deleteComment(commentId, userId);
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
});