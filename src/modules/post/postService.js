import { ERROR_CODES } from "../../core/errors/errorCodes.js";
import AppError from '../../core/errors/appError.js';
import * as postRepo from './postRepo.js';
import * as commentRepo from '../comment/commentRepo.js';
import * as userRepo from '../user/userRepo.js';

//get all posts 
export const getAllPosts = async () => {
    const posts = await postRepo.getAllPosts();
    return posts;
};

// create post 
export const createPost = async ({ title, content, category, userId, page }) => {
    const user = await userRepo.getUserById(userId);
    const postsPerPage = 10;
    const pageN = Number.isInteger(page) && page > 0 ? page : 1;
    const pageNumber = pageN - 1;
    const newPost = await postRepo.createPost({ 
        title: title, 
        content: content, 
        category: category, 
        userId: userId 
    });
    const posts = await postRepo.getPaginated(pageNumber, postsPerPage);
    const totalPosts = await postRepo.countPosts();
    return { newPost, posts, totalPosts };  
};

// get post by id
export const getPostById = async ({ postId }) => {
    const post = await postRepo.getPostById(postId);
    if (!post) {
        const { code, message, statusCode } =ERROR_CODES.POST_NOT_FOUND;
        throw new AppError(message, statusCode, code);
    }
     const totalComments = await commentRepo.countPostComments();
    return { post, totalComments };

};

// update post
export const updatePost = async (id, postData, userId) => {
    const existingPost = await postRepo.getPostById(id);
    if (!existingPost) {
        const { code, message, statusCode } = ERROR_CODES.POST_NOT_FOUND
        throw new AppError(message, statusCode, code);
    }
    if (existingPost.userId._id.toString() !== userId) {
        const { code, message, statusCode } =ERROR_CODES.UNAUTHORIZED_TO_UPDATE_POST;
        throw new AppError(message, statusCode, code);
    }
    const updatedPost = await postRepo.updatePost(id, postData);
    return updatedPost;
};

// delete post:
export const deletePost = async ({ postId, userId }) => {
    const normalizedPostId = postId.toString();
    const normalizedUserId = userId.toString();
    const existingPost = await postRepo.getPostById(normalizedPostId);
    if (!existingPost) {
        const { message, statusCode, code } = ERROR_CODES.POST_NOT_FOUND;
        throw new AppError(message, statusCode, code);
    };
    
    if (existingPost.userId.toString() !== normalizedUserId) {
        const { message, statusCode, code } = ERROR_CODES.UNAUTHORIZED_TO_DELETE_POST;
        throw new AppError(message, statusCode, code);
    };
    await postRepo.deletePost(normalizedPostId);
};

// get posts by user id 
export const getPostsByUserId = async (userId) => {
    const posts = await postRepo.getPostsByUserId(userId);
    if (!posts || posts.length === 0 ) {
        const { code, message, statusCode } = ERROR_CODES.POST_UNAVAILABLE;
        throw new AppError(message, statusCode, code);
    }
    return posts;
};

    // get posts by category
export const getPostsByCategory = async (category) => {
    const posts = await postRepo.getPostsByCategory(category);
     if (!posts || posts.length === 0 ) {
        const { code, message, statusCode } = ERROR_CODES.POST_NOT_FOUND;
        throw new AppError(message, statusCode, code);
     }
    return posts;
};
