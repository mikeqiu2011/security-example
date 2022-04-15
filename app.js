const express = require('express')
const path = require('path')
const helmet = require('helmet')

const app = express()

app.use(helmet()) // add security middleware at the top of all mw and routes

function checkLoggedIn(req, res, next) {
    const isLoggedIn = true // TODO
    if (!isLoggedIn) {
        return res.status(401).json({ error: 'log in required' })
    }
    next()

}

app.get('/secret', checkLoggedIn, (req, res) => {  // only check login for protected endpoint
    return res.json({ msg: 'your personal secret value is 35' })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

module.exports = app

