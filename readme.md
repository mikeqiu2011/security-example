# security node demo

## generate self signed cert using openssl
    openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365