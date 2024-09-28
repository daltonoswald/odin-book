const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
require('dotenv').config();

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