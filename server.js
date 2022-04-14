const https = require('https')
const fs = require('fs')

const app = require('./app')
const PORT = 3000

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(PORT, () => {
    console.log('listening on port', PORT);
})
