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
                }
            },
            likes: true,
        },
        orderBy: {
            updated_at: 'desc'
        }
    })
    console.log(`findPosts: `, findPosts);
    res.json({ posts: findPosts, user: authorizedUser.user });
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
                console.log(newPost)
            }
        } catch (err) {
            return next(err);
        }
    }
]