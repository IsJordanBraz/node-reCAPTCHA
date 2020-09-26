const express = require('express');
const bodyParser = require('body-parser')
const request = require('request');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/check', (req, res) => {
    const captcha = req.body.captcha;
    const remoteAdress = req.connection.remoteAddress;
    
    if(captcha === undefined || captcha === null || captcha === '') {
        return res.json({"sucess": false, "msg": "Select Captcha."});
    }
    const secretKey = "Your site kEY";
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${remoteAdress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        if(body.sucess !== undefined && !body.sucess) {
            return res.json({"sucess": false, "msg": "Verification failed."});
        }
        return res.json({"sucess": true, "msg": "Captcha Sucess"});

    });    
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));