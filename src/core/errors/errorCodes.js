export const ERROR_CODES = {
    USER_NOT_FOUND: { 
        code: 'USER_NOT_FOUND',
        message: 'User does not exist!',
        statusCode: 404
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: 'Inavalid credentails provided',
        statusCode: 401
    },
    USER_ALREADY_EXIST: {
        code: 'USER_ALREADY_EXIST',
        message: 'User already registered',
        statusCode: 400
    },
    UNVERIFIED_USER: {
        code: 'UNVERIFIED_USER',
        message: 'User is not verified',
        statusCode: 401
    },
    WRONG_PASSWORD: {
        code: 'WRONG_PASSWORD',
        message: 'Wrong password',
        statusCode: 401
    },
    INVALID_VERIFICATION_CODE: {
        code: 'INVALID_VERIFICATION_CODE',
        message: 'Invalid verification code',
        statusCode: 400
    },
    VERIFICATION_CODE_EXPIRED: {
        code: 'VERIFICATION_CODE_EXPIRED',
        message: 'verification code has expired, please request a new one',
        statusCode: 400
    },
    DATABASE_ERROR: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        statusCode: 500
    },
    FORGOT_PASSWORD_CODE_EXPIRED: {
        code: 'FORGOT_PASSWORD_CODE_EXPIRED',
        message: 'Forgot password code has expired, please request a new one',
        statusCode: 400
    },
    POST_UNAVAILABLE: {
        code: 'POST_UNAVAILABLE',
        message: 'Post unavailable',
        statusCode: 404
    },
    UNAUTHORIZED_TO_UPDATE_POST: {
        code: 'UNAUTHORIZED_TO_UPDATE_POST',
        message: 'You are not authorized to update this post',
        statusCode: 403
    },
     UNAUTHORIZED_TO_DELETE_POST: {
        code: 'UNAUTHORIZED_TO_DELETE_POST',
        message: 'You are not authorized to delete this post',
        statusCode: 403
     },
     INTERNAL_SERVER_ERROR: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        statusCode: 500
     },
     NO_VERIFICATION_CODE_FOUND: {
        code: 'NO_VERIFICATION_CODE_FOUND',
          message: 'No verification code found. Please request a new one.',
        statusCode: 404
     },
     USER_ALREADY_VERIFIED: {
        code: 'USER_ALREADY_VERIFIED',
        message: 'User is already verified',
        statusCode: 400
     },
     RATE_LIMIT_EXCEEDED: {
        code: 'RATE_LIMIT_XCEEDED',
        message: 'Too many requests, please try agin later',
        statusCode: 429

     },
     RATE_LIMIT_UNAVAILABLE: {
        code: 'RATE_LIMIT_UNAVAILABLE',
        message: 'Rate limiter service is unavailable',
        statusCode: 503
     },
     POST_NOT_FOUND: {
        code: 'POST_NOT_FOUND',
        message: 'post not found',
        statusCode: 404 
     },
     UNAUTHORIZED_ACTION: {
        code: 'UNAUTHORIZED_ACTION',
        message: 'You are not authorized to perform this action',
        statusCode: 403
     },
     COMMENT_NOT_FOUND: {
        code: 'COMMENT_NOT_FOUND',
        message: 'Comment not found',
        statusCode: 404
     },
     UNAUTHORIZED_TO_EDIT_COMMENT: {
        code: 'UNAUTHORIZED_TO_EDIT_COMMENT',
        message: 'You are not authorized to edit this comment',
        statusCode: 403
     },
     UNAUTHORIZED_TO_DELETE_COMMENT: {
        code: 'UNAUTHORIZED_TO_DELETE_COMMENT',
        message: 'You are not authorized to delete this comment',
        statusCode: 403
     },
     INVALID_TOKEN: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
        statusCode: 401
     },
     NO_COMMENTS_YET: {
        code: 'NO_COMMENTS_YET',
        message: 'No comments yet',
        statusCode: 404
     },
     INVALID_REQUEST: {
        code: 'INVALID_REQUEST',
        message: 'Invalid request',
        statusCode: 400
     }
};

