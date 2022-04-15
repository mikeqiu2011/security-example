# security node demo

## generate self signed cert using openssl
    openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365

## all in one security middleware - helmet
    npm i helmet

    strict-transport-security -- STS, force browser to switch to HTTPS
    X-Power-By is hidden
    X-XSS-protection
    content-security policy -- block user from saving script to our server

## passport.js for google OAuth2
    npm i passport
    npm install passport-google-oauth20
