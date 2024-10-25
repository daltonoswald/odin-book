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

exports.log_in = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    });
    if (!user) {
        res.status(401).json({ message: 'Username not found, Username may be case-sensitive.' });
    }
    try {
        bcryptjs.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) return next(err);

            const options = {};
            options.expiresIn = '7d';
            const token = jwt.sign({ user }, process.env.TOKEN_KEY, options);

            if (!isMatch) {
                res.status(401).json({ message: "Incorrect username and password." });
            } else {
                res.json({ message: 'User logged in successfully', token, user });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error." });
    }
})

exports.logout = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
        res.json({ message: "Logout Successful!" })
    })
}


exports.sign_up = [
    body('first_name', 'First Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('last_name', 'Last Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('password', 'Password must not be empty.')
        .trim()
        .isLength({ min: 8, max: 50 })
        .escape(),
    body('confirm_password', 'The passwords do not match.')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            return true
        }),
    body('bio')
        .trim()
        .escape(),
    body('picture')
        .trim(),

    async(req, res, next) => {
        try {
            const errors = validationResult(req);
            if (req.body.password !== req.body.confirm_password) {
                res.status(409).json({ message: "Passwords do not match." });
            }

            const usernameTaken = await prisma.user.findMany({
                where: {
                    username: {
                        equals: req.body.username,
                        mode: 'insensitive'
                    }
                }
            });
            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages })
            } else {
                if (usernameTaken.length > 0) {
                    res.status(409).json({ message: "Username is already in use."})
                    return;
                } else {
                    await prisma.user.create({
                        data: {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            username: req.body.username,
                            password: await bcryptjs.hash(req.body.password, 10),
                            bio: req.body.bio,
                            picture: req.body.picture
                        }
                    })
                    res.json({ message: 'User successfully created' })
                    res.redirect('/');
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
]

exports.find_users = asyncHandler( async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const authorizedUserId = authorizedUser.user.id
        const userList = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: req.body.username
                        }
                    }
                ],
                NOT: [
                    {
                        username: {
                            equals: authorizedUser.user.username
                        }
                    }
                ]
            },
            select: {
                id: true,
                username: true,
                picture: true,
                followed_by: {
                    where: {
                        followed_by_id: {
                            equals: authorizedUserId
                        }
                    },
                },
                _count: {
                    select: { followed_by: true }
                }
            },
            orderBy: {
                username: 'asc'
            },
        });
        if (!userList) {
            res.status(401).json({ message: `No users found matching ${req.body.username}`});
        } else {
            res.json({ userList: userList, user: authorizedUser.user });
        }
    } catch (err) {
        res.status(400).json({error: err})
    }

})

exports.trending_users = asyncHandler( async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const authorizedUserId = authorizedUser.user.id
    const trendingUsers = await prisma.user.findMany({
        orderBy: [
            {
                followed_by: {
                    _count: 'desc'
                }
            }
        ],
        take: 3,
        where: {
            NOT: [
                {
                    username: {
                        equals: authorizedUser.user.username
                    }
                }
            ]
        },
        select: {
            id: true,
            username: true,
            picture: true,
            followed_by: {
                where: {
                    followed_by_id: {
                        equals: authorizedUserId
                    }
                },
            },
        },
    });
    if (!trendingUsers) {
        res.status(401).json({ message: `No users found`});
    } else {
        res.json({ trendingUsers: trendingUsers, user: authorizedUser.user });
    }

})

exports.follow_user = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const userToFollow = req.body.userToFollow

    const findExisting = await prisma.follows.findMany({
        where: {
            followed_by_id: authorizedUser.user.id,
            following_id: userToFollow
        }
    })

    if (findExisting.length === 0) {
        const follow = await prisma.follows.create({
            data: {
                followed_by_id: authorizedUser.user.id,
                following_id: userToFollow
            }
        })
        res.json({ message: 'User followed sucessfully' });
    } else {
        res.json({ message: 'Already following'});
    }
})

exports.unfollow_user = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const userToUnfollow = req.body.userToUnfollow

    const unfollowUser = await prisma.follows.deleteMany({
        where: {
            followed_by_id: authorizedUser.user.id,
            following_id: userToUnfollow
        }
    })
    res.json({ message: 'User unfollowed'})
})

exports.profile = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const userToFind = req.body.userToFind;
        const userProfile = await prisma.user.findFirst({
            where: {
                username: userToFind
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                username: true,
                bio: true,
                picture: true,
                // followed_by: {
                //     where: {
                //         followed_by_id: {
                //             equals: authorizedUser.user.id
                //         }
                //     },
                // },
                followed_by: {
                    select: {
                        followed_by: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
                // followed_by: true,
                _count: {
                    select: { followed_by: true, following: true }
                },
                posts: {
                    select: {
                        id: true,
                        content: true,
                        // userId: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                username: true,
                                picture: true,
                                id: true,
                            },
                        },
                        likes: {
                            where: {
                                userId: authorizedUser.user.id
                            }
                        },
                        _count: {
                            select: { likes: true },
                        },
                        created_at: true,
                        comments: {
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        first_name: true,
                                        last_name: true,
                                        username: true,
                                        picture: true,
                                        id: true,  
                                    }
                                },
                                content: true,
                                likes: {
                                    where: {
                                        userId: authorizedUser.user.id
                                    }
                                },
                                created_at: true,
                                _count: {
                                    select: { likes: true },
                                }
                            },
                            orderBy: {
                                created_at: 'asc'
                            }
                        },
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                }
            }
        })
        if (!userProfile) {
            res.status(404).json({ error: 'User not found.'})
        } else {
            res.json({ profile: userProfile, user: authorizedUser });
        }
    } catch (err) {
        res.status(400).json({error: err})
    }
})

exports.edit_profile = [
    body('first_name', 'First Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('last_name', 'Last Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50})
        .escape(),
    body('bio')
        .trim()
        .escape(),
    body('picture')
        .trim(),

    async(req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages })
            } else {
                const updatedUser = await prisma.user.update({
                    where: {
                        id: authorizedUser.user.id
                    },
                    data: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        username: req.body.username,
                        bio: req.body.bio,
                    }
                })
                res.json({ message: 'User updated', updatedUser: updatedUser, user: authorizedUser})
            }
        } catch (err) {
            console.log(err);
        }
    }
]

exports.edit_profile_picture = [
    body('picture')
        .trim(),

    async(req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages })
            } else {
                const updatedUser = await prisma.user.update({
                    where: {
                        id: authorizedUser.user.id
                    },
                    data: {
                        picture: req.body.picture,
                    }
                })
                res.json({ message: 'User updated', updatedUser: updatedUser, user: authorizedUser})
            }
        } catch (err) {
            console.log(err);
        }
    }
]