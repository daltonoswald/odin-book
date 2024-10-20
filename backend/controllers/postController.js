const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

exports.findPosts = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const findFollowing = await prisma.follows.findMany({
        where: {
            followed_by_id: authorizedUser.user.id
        },
        select: {
            following_id: true,
        }
    })
    followingList = findFollowing.map(function(followedBy) {
        return followedBy.following_id;
    })
    const authorizedUserId = authorizedUser.user.id
    followingList.push(authorizedUserId);
    const findPosts = await prisma.post.findMany({
        where: {
            userId: { in: followingList }
        },
        include: {
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    username: true,
                    id: true,
                },
            },
            comments: {
                select: {
                    id: true,
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            username: true,
                            id: true,  
                        }
                    },
                    content: true,
                    likes: {
                        where: {
                            userId: authorizedUserId
                        }
                    },
                    created_at: true,
                    _count: {
                        select: { likes: true },
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
            },
            likes: {
                where: {
                    userId: authorizedUserId
                }
            },
            _count: {
                select: { likes: true },
            }
        },
        orderBy: {
            updated_at: 'desc'
        },
    })
    res.json({ posts: findPosts, user: authorizedUser });
})

exports.new_post = [
    body('content', 'The post must be between 1 and 250 characters.')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const token = req.headers.authorization.split(' ')[1];
            const authorizedUser = verifyToken(token);
            const tokenUserId = authorizedUser.user.id;

            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages})
            } else {
                const content = req.body.content;
                const newPost = await prisma.post.create({
                    data: {
                        content: content,
                        userId: tokenUserId
                    }
                });
                res.json({ message: 'New post created', newPost: newPost });
            }
        } catch (err) {
            return next(err);
        }
    }
]

exports.new_comment = [
    body('content', 'The post must be between 1 and 250 characters.')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const token = req.headers.authorization.split(' ')[1];
            const authorizedUser = verifyToken(token);
            const tokenUserId = authorizedUser.user.id;

            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages})
            } else {
                const content = req.body.content;
                const postId = req.body.postId;
                const newComment = await prisma.comment.create({
                    data: {
                        content: content,
                        postId: postId,
                        userId: tokenUserId
                    }
                });
                res.json({ message: 'New comment created', newComment: newComment });
            }
        } catch (err) {
            return next(err);
        }
    }
]

exports.like_post = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const postToLike = req.body.postToLike
    
    const alreadyLiked = await prisma.postLike.findMany({
        where: {
            userId: authorizedUser.user.id,
            postId: postToLike,
        }
    })
    if (alreadyLiked.length === 0) {
        const postLike = await prisma.postLike.create({
            data: {
                userId: authorizedUser.user.id,
                postId: postToLike,
            }
        })
        res.json({ message: `You have liked post ${postToLike}` });
    } else {
        res.json({ message: `You have already liked this post.`})
    }
})

exports.unlike_post = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const postToUnlike = req.body.postToUnlike

    const likedPost = await prisma.postLike.findMany({
        where: {
            userId: authorizedUser.user.id,
            postId: postToUnlike,
        }
    })

    if (likedPost.length === 0) {
        res.json({ message: `You have not liked this post`})
        return
    } else {
        const postUnlike = await prisma.postLike.delete({
            where: {
                id: likedPost[0].id
            }
        })
        res.json({ message: `You have unliked post ${postToUnlike}` });
    }
})

    exports.like_comment = asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const commentToLike = req.body.commentToLike
        console.log(req.body);
        
        const alreadyLiked = await prisma.commentLike.findMany({
            where: {
                userId: authorizedUser.user.id,
                commentId: commentToLike,
            }
        })
        console.log('alreadyLiked', alreadyLiked);
        if (alreadyLiked.length === 0) {
            const commentLike = await prisma.commentLike.create({
                data: {
                    userId: authorizedUser.user.id,
                    commentId: commentToLike,
                }
            })
            res.json({ message: `You have liked comment ${commentToLike}` });
        } else {
            res.json({ message: `You have already liked this comment.`})
        }
    })

    exports.unlike_comment = asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const commentToUnlike = req.body.commentToUnlike
    
        const likedComment = await prisma.commentLike.findMany({
            where: {
                userId: authorizedUser.user.id,
                commentId: commentToUnlike,
            }
        })
    
        if (likedComment.length === 0) {
            res.json({ message: `You have not liked this comment`})
            return
        } else {
            const commentUnlike = await prisma.commentLike.delete({
                where: {
                    id: likedComment[0].id
                }
            })
            res.json({ message: `You have unliked comment ${commentToUnlike}` });
        }
    })

    exports.delete_post = asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);

        try {
            const postToDelete = await prisma.post.delete({
                where: {
                    id: req.body.postToDelete,
                    userId: authorizedUser.user.id
                }
            })
            res.status(202).json({ message: 'Post deleted' })
        } catch (err) {
            console.error(err);
            res.json({ error: err });
        }
    })

    exports.delete_comment = asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);

        try {
            const commentToDelete = await prisma.comment.delete({
                where: {
                    id: req.body.commentToDelete,
                    userId: authorizedUser.user.id
                }
            })
            res.status(202).json({ message: 'comment deleted' })
        } catch (err) {
            console.error(err);
            res.json({ error: err });
        }
    })