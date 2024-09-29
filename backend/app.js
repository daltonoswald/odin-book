const express = require('express');
// const passport = require('passport');
const session = require('express-session');
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter')
// const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const path = require('node:path');
const passport = require('passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('express-session')
    ({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        }
    })
)
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: [
        `http://localhost:5173`,
        '*'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
}))

// app.use(
//     session({
//         secret: process.env.SECRET || SECRET,
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             maxAge: 24 * 60 * 60 * 1000
//         },
//         store: new PrismaSessionStore(
//             new PrismaClient(),
//             {
//                 checkPeriod: 2 * 60 * 1000,
//                 dbRecordIdIsSessionId: true,
//                 dbRecordIdFunction: undefined
//             }
//         )
//     })
// )

// app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', userRouter);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.static('./public'));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.listen(process.env.PORT || PORT, () => console.log(`File Uploader listening on port ${process.env.PORT || PORT}`));