export const rateLimiterConfig = {

    anonymous: {
        points: 60,
        duration: 60,
        blockDuration: 120,
        keyPrefix: 'rl_annyms'
    },
    user: {
        points: 500,
        duration: 60,
        blockDuration: 60,
        keyPrefix: 'rl_user'
    },
    admin: {
        points: 1500,
        duration: 60,
        blockDuration: 30,
        keyPrefix: 'rl_admin'
    },
    login: {
        points: 5,
        duration: 60,
        blockDuration: 300,
        keyPrefix: 'rl_login'
    }, 
    signUp: {
        points: 3, 
        duration: 60,
        blockDuration: 300,
        keyPrefix: 'rl_signup'
    },
    forgotPassword: {
        points: 3,
        duration: 60,
        blockDuration: 3600,
        keyPrefix: 'rl_forgot_pass'
    },
    resetPassword: {
        points: 5,
        duration: 60,
        blockDuration: 3600,
        keyPrefix: 'rl_pass_reset'
    },
    comments: {
        points: 60,
        duration: 60,
        blockDuration: 300,
        keyPrefix: 'rl_comments'
    },
    read: {
        points: 300,
        duration: 60,
        blockDuration: 60,
        keyPrefix: 'rl_read'
    },
    postCreate: {
        points: 10,
        duration: 60,
        blockDuration: 300,
        keyPrefix: 'rl_post_create'
    },
    postUpdate: {
        points: 25,
        duration: 60 ,
        blockDuration: 120,
        keyPrefix: 'rl_post_update'
    },
    postDelete: {
        points: 5,
        duration: 60,
        blockDuration: 600,
        keyPrefix: 'rl_post_delete'
    },
    commentCreate: {
        points: 20,
        duration: 60,
        blockDuration: 300,
        keyPrefix: 'rl_comment_create'
    },
    commentUpdate: {
        points: 40,
        duration: 60,
        blockDuration: 120,
        keyPrefix: 'rl_comment_update'
    },
    commentDelete: {
        points: 10,
        duration: 60,
        blockDuration: 600,
        keyPrefix: 'rl_comment_delete'
    },
    

};