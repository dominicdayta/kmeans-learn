require('dotenv').config();
const express = require('express');
const app = express();
const lessonsRoutes = require('./routes/lessons.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const Students = require('./models/students');

mongoose.connect(process.env['DATABASE_URL2'], { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const initPassport = require('./passport-config.js');
const res = require('express/lib/response');

initPassport(
    passport, 
    email => Students.findOne({'email': email}, (err,docs)=>{return(docs)}).clone(),
    id => Students.findOne({'id': id}, (err,docs)=>{return(docs)}).clone()
);

const users = [];

app.use(express.static(__dirname+'/public'));

app.use(express.urlencoded({ extended:false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env['DATABASE_URL2'] }),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use('/lessons', checkAuthenticated, lessonsRoutes);

app.get('/', checkNotAuthenticated, (req,res) => {
    res.render('index');
})

app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('index');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: 'lessons',
    failureRedirect: 'login',
    failureFlash: true
}));

app.post('/register', async (req,res) => {
    
    try {
        const hashPass = await bcrypt.hash(req.body.login_password, 10);
        users.push({
            id: Date.now().toString(),
            email: req.body.login_email,
            password: hashPass
        });
        res.redirect('/lessons');
    } catch{
        res.redirect('/login');
    }

    console.log(users);
})

app.use('/logout', checkAuthenticated, (req,res) => {
    req.logOut();
    res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/login');
}

function checkNotAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return res.redirect('/lessons');
    }

    return next();
}

/*app.listen(4000);*/
app.listen(process.env['PORT'] || 4000);    