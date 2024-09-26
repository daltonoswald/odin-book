const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

exports.index = asyncHandler(async (req, res) => {
    // res.render('index', { 
    //     title: 'Homepage', 
    //     user: req.user,
    // })
    const testMessage = 'Successfully connected'
    res.json({testMessage})
})