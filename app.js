const express = require('express')
const path = require('path')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const cookieSession = require('cookie-session')
require('dotenv').config()

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
}

// we can use this callback function to save the user profile get from google to save to our database
function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile);
    done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

// save session to cookie directly
passport.serializeUser((user, done) => {
    // done(null, user) // instead of saving all data into cookie, we can just save id
    done(null, user.id)
})

// load session from cookie directly
passport.deserializeUser((id, done) => {
    // User.findById(id).then(user => {
    //     done(null, user)  // if we use server side session, the we can get user info by id
    // })
    done(null, id)
})

const app = express()

app.use(helmet()) // add security middleware at the top of all mw and routes

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]
}))

app.use(passport.initialize())
app.use(passport.session())

function checkLoggedIn(req, res, next) {
    console.log('current user is', req.user);
    const isLoggedIn = req.isAuthenticated() && req.user
    if (!isLoggedIn) {
        return res.status(401).json({ error: 'log in required' })
    }
    next()

}

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true,
}), (req, res) => {
    console.log('Google called us back');
}
)


app.get('/auth/logout', (req, res) => {
    req.logOut() // removes req.user and clears any logged in session
    res.redirect('/')
})

app.get('/failure', (req, res) => {
    return res.status(401).json({ error: 'authrorization failed' })
})

app.get('/secret', checkLoggedIn, (req, res) => {  // only check login for protected endpoint
    return res.json({ msg: 'your personal secret value is 35' })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

module.exports = app

