import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { createUser } from './database.js';
import { initialize } from './auth.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

initialize();

app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAutenticated, (req, res) => {
    res.render('index.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
}));

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.username, hashedPassword);
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

function checkAutenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

app.listen(3000, () => {
    console.log('Servidor iniciado');
});

