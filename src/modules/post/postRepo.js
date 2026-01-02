import Post from './postModel.js';

export const getAllPosts = async () => {
    const posts = await Post.find().populate({ path: 'userId', select: 'email' });
    return posts;
};

export const createPost = async ({ title, content, category, userId }) => {
    const newPost = new Post({ title, content, category, userId });
    await newPost.save();
    return newPost;
};
// post pagination
export const getPaginated = async(pageNumber, postsPerPage) => {
    const posts = await Post.find()
    .sort({ createAt: -1 })
    .skip(pageNumber * postsPerPage)
    .limit(postsPerPage)
    .populate({ path: 'userId', select: 'email' });
    return posts;
};

// count total posts
export const countPosts = async () => {
    const totalPosts = await Post.countDocuments();
    return totalPosts;
};

export const getPostById = async (_id) => {
    const post = await Post.findById(_id).populate({ path: 'userId', select: 'email' });
    if (!post) return null;
    return {
        _id: post._id.toString(),
        title: post.title,
        content: post.content,
        category: post.category,
        userId: post.userId._id.toString(),
        email: post.userId.email,
        createdAt: post.createdAt
    };
};

export const deletePost = async (_id) => {
    const post = await Post.findByIdAndDelete(_id);
    if (!post) return null;
    return { postId: post._id.toString(), userId: post.userId.toString()}
};

export const updatePost = async (id, postData) => {
    const updatedPost = await Post.findByIdAndUpdate(id, postData, { new: true });
    return updatedPost;
};

export const getPostsByUserId = async (userId) => {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    return posts;
};

export const getPostsByCategory = async (category) => {
    const posts = await Post.find({ category }).sort({ createdAt: -1 });
    return posts; 
};

export const searchPosts = async (query) => {
    const posts = await Post.find({ $text: { $search: query }}).sort({ createdAt: -1 });
    return posts;
};
