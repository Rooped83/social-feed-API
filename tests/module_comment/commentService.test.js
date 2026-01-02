import { vi, test, describe, beforeEach, expect } from 'vitest';
import * as commentRepo from '../../src/modules/comment/commentRepo.js';
import * as commentService from '../../src/modules/comment/commentService.js';
import * as userRepo from '../../src/modules/user/userRepo.js';
import { addComment } from '../../src/modules/comment/commentService.js';
import * as postRepo from '../../src/modules/post/postRepo.js';
import AppError from '../../src/core/errors/appError.js';
vi.mock('../../src/modules/post/postRepo.js', () => ({
    getPostById: vi.fn()
}));
vi.mock('../../src/modules/comment/commentRepo.js', () => ({
    addCommentToPost: vi.fn(),
    getComment: vi.fn(),
    deleteComment: vi.fn(),
}));
vi.mock('../../src/modules/user/userRepo.js', () => ({
    getUserById: vi.fn()
}));


describe(' add comment service should works properly', async () => {
     test('throws if post does not exist', async () => {
    postRepo.getPostById.mockResolvedValue(null);

    await expect(
      addComment({ postId: 1, userId: 2, text: 'hi' })
    ).rejects.toBeInstanceOf(AppError);
  });
  beforeEach(() => {
    vi.clearAllMocks();
  })

  test('adding comment when post exits', async() => {
    postRepo.getPostById.mockResolvedValue({ id: 1 });
    userRepo.getUserById.mockResolvedValue({ id: 10 });
    commentRepo.addCommentToPost.mockResolvedValue({ id: 11 });

const result = await addComment({ userId:10, postId: 1, text: "ausgezeichnet bruder !" })
  expect(commentRepo.addCommentToPost).toHaveBeenCalledWith({ userId:10, postId: 1, text: "ausgezeichnet bruder !" })
  expect(result.id).toBe(11);
  });
})

describe('delete comment service should works properly', () => {
  test('throws error when no comment', async () => {
 commentRepo.getComment.mockResolvedValue(null);
   await expect(
  commentService.deleteComment({ userId: 1, commentId: 1})
   ).rejects.toBeInstanceOf(AppError)
  });


  test('throws error when not the comment owner', async () => {
    commentRepo.getComment.mockResolvedValue({ userId: 1, commentId: 1}) 
    await expect(
      commentService.deleteComment({ userId: 2, commentId: 1 })
    ).rejects.toBeInstanceOf(AppError)
  })
beforeEach(() => {
    vi.clearAllMocks();
  })
});
 test('delete comment successfully', async () => {
  const comment = { userId: '1', commentId: '1' }; // make userId a string to match service expectation
  commentRepo.getComment.mockResolvedValue(comment);
  commentRepo.deleteComment = vi.fn().mockResolvedValue(true);

  await commentService.deleteComment({ commentId: '1', userId: '1' });

  expect(commentRepo.deleteComment).toHaveBeenCalledWith('1');
});

describe('getComment function', () => {
  test('throws error when comment does not exist', async () => {
    commentRepo.getComment.mockResolvedValue(null);
    await expect(
      commentService.getComment({ id: 1 })
    ).rejects.toBeInstanceOf(AppError);
  })
});