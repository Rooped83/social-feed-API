import * as commentRepo from './commentRepo.js';
import * as postRepo from '../post/postRepo.js';
import AppError from '../../core/errors/appError.js';
import { ERROR_CODES } from '../../core/errors/errorCodes.js';

export const addComment = async (postId, userId, text) => {
    const post = await postRepo.getPostById(postId);
    if (!post) { 
        const { code, message, statusCode } = ERROR_CODES.POST_NOT_FOUND;
        throw new AppError(message, statusCode, code);
    };
    const comment = await commentRepo.addCommentToPost(postId, userId, text);
    return comment;
};

export const getCommentsByPostId = async (postId) => {
    const comments = await commentRepo.getCommentsByPostId(postId);
    const totalComments = comments.length;
    if (!comments || comments.length === 0) {
        const { code, message, statusCode } = ERROR_CODES.NO_COMMENTS_YET;
        throw new AppError(message, statusCode, code);
    };
    return { totalComments, comments }
}; 

export const getComment  = async (commentId) => {
    const comment = await commentRepo.getComment(commentId);
    return comment;
} 

export const editComment = async (commentId, userId, text) => {
    const comment = await commentRepo.getComment(commentId);
    if (!comment) {
        const { code, message, statusCode } = ERROR_CODES.COMMENT_NOT_FOUND;
        throw new AppError(message, statusCode, code);
    };
    if (comment.userId.toString() !== userId) {
        const { code, message, statusCode } = ERROR_CODES.UNAUTHORIZED_TO_EDIT_COMMENT;
        throw new AppError(message, statusCode, code);
    };
    const updatedComment = await commentRepo.editComment(commentId, text);
    return updatedComment;
};

export const deleteComment = async (commentId, userId) => {
    const comment = await commentRepo.getComment(commentId);
    if (!comment) {
        const { code, message, statusCode } = ERROR_CODES.COMMENT_NOT_FOUND
        throw new AppError(message, statusCode, code);
    };
    if (comment.userId.toString() !== userId) {
        const { message, statusCode, code } = ERROR_CODES.UNAUTHORIZED_TO_DELETE_COMMENT;
        throw new AppError(message, statusCode, code);
    };
    await commentRepo.deleteComment(comment);
};