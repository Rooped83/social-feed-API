import { asyncHandler } from '../../core/utils/asyncCatch.js';
import * as postService from './postService.js';
// get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getAllPosts();
    res.status(200).json({ success: true, message: "Posts fetched successfully", posts: posts, totalPosts: posts.length});
  } 
);

// create post 
export const createPost = asyncHandler(async (req,res) => {
    const { page = 1 } = req.query;
    const posts = await postService.createPost({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            userId: req.user.id
        }, page
    ); 
    res.status(201).json({ success: true, messsage: "Post created successfully", posts: posts, totalPosts: posts.length});
});

// get a single post by id
export const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post =  await postService.getPostById(id);
        res.status(200).json({ success: true, message: "Post fetched successfully", result: post });
});

//update post 
export const updatePost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;
    const userId = req.user.id;
     console.log('Post ID from params:', req.params.id);
    console.log('User ID from req.user:', userId);
    console.log('req.user object:', req.user);
    console.log('Body data:', { title, content, category });
    const updatedPost = await postService.updatePost(req.params.id, { title, content, category }, userId);
        res.status(200).json({ success: true, message: "Post updated successfully", data: updatedPost });
});

// delete a post  
export const deletePost = asyncHandler(async (req, res) => {
    const { userId } = req.user;
       await postService.deletePost({ postId: req.params.id, userId: userId })
        res.status(200).json({ success: true, message: "Post deleted successfully" });
});
    
// get posts by user id
export const getUserPosts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const posts = await postService.getPostsByUserId(id);
    res.status(200).json({ success: true, message: "User posts fetched successfully", result: posts, totalPosts: posts.length });
});
 
// get post by category 
export const getPostsByCategory = asyncHandler(async (req, res) => {
    const posts = await postService.getPostsByCategory(req.params.category);
    res.status(200).json({ success: true, message: "Posts fetched successfully", posts: posts, totlaPosts: posts.length });
});