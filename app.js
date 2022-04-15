const express = require('express')
const path = require('path')
const helmet = require('helmet')

const app = express()

app.use(helmet()) // add security middleware at the top of all mw and routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

module.exports = app