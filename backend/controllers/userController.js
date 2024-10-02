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

// passport.use(
//     new LocalStrategy(async (username, password, done) => {
//         try {
//             const user = await prisma.user.findFirst({
//                 where: {
//                     username: username
//                 }
//             });
//             console.log(`username: `, username);
//             console.log(user);
//             if (!user) {
//                 return done(null, false, { message: 'Username not found. Username may be case sensitive.' });
//             }
//             const match = await bcryptjs.compare(password, user.password);
//             if (!match) {
//                 return done(null, false, { message: "Incorrect password" });
//             };
//             console.log(`line 27: `, user);
//             return done(null, user);
//         } catch (err) {
//             return done(err);
//         }
//     })
// )

// passport.serializeUser((user, done) => {
//     // console.log(`line 36: `, user)
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: id
//             }
//         });
//         done(null, user)
//     } catch (err) {
//         done(err);
//     }
// });


// exports.log_in = [
//     passport.authenticate('local'),
//     function(req, res) {
//         res.cookie('session', req.user.id, { secure: true, signed: true, expires: new Date(Date.now() + 3600)})
//         console.log('Cookies: ', req.cookies);
//         console.log('Signed: ', req.signedCookies);
//         res.json({ message: "Success", user: req.user});
//     }
// ]

exports.log_in = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    });
    if (!user) {
        res.status(401).json({ message: 'Username not found' });
    }
    try {
        bcryptjs.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) return next(err);

            const options = {};
            options.expiresIn = '7d';
            const token = jwt.sign({ user }, process.env.TOKEN_KEY, options);

            if (!isMatch) {
                res.status(401).json({ message: "Password is incorrect." });
            } else {
                console.log(user.username);
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
                console.log(value, req.body.password);
                return false
            }
            return true
        }),
    body('bio')
        .trim()
        .escape(),

    async(req, res, next) => {
        console.log(`line 40`, req.body);
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
                    console.log(req.body.first_name);
                    await prisma.user.create({
                        data: {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            username: req.body.username,
                            password: await bcryptjs.hash(req.body.password, 10),
                            bio: req.body.bio
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
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const users = await prisma.user.findMany({
        // where: {
        //     username: {
        //         contains: req.body.username
        //     }
        // },
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
        }
    });
    if (!users) {
        res.status(401).json({ message: `No users found matching ${req.body.username}`});
    } else {
        res.json({ users: users });
    }

})

exports.follow_user = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const userToFollow = req.body.userToFollow
    console.log(userToFollow);

    // const user = await prisma.user.update({
    //     where: {
    //         id: authorizedUser.user.id
    //     },
    //     data: {
    //         following: {
    //             connect: {
    //                 following_id: userToFollow
    //             }
    //         }
    //     }
    // })
    // console.log(user);

    const findExisting = await prisma.follows.findMany({
        where: {
            followed_by_id: authorizedUser.user.id,
            following_id: userToFollow
        }
    })

    if (!findExisting) {
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

exports.testUser = async (req, res, next) => {
    console.log(`testUser`, req.user);
}