const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

require('dotenv').config();

const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 8080;
const host = process.env.HOST;
const accessToken = process.env.ACCESS_TOKEN;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json());

io.on('connection', socket => {
    console.log('Connection established');

    let endpoint = `${host}:${port}`;

    socket.emit('config', { endpoint });
});

app.get('/test', (req, res) => {
    //io.sockets.emit('test', 'test123');
    res.sendStatus(200);
});

app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = 'qt3.141592654';

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
        else {
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object !== 'page') {
        res.sendStatus(404);
        return;
    }

    body.entry.forEach(entry => {
        let event = entry.messaging[0];
        io.sockets.emit('newMessage', event);
        console.log(event);
    });

    res.status(200).send('EVENT_RECEIVED');
});

app.post('/send', (req, res) => {
    if (!accessToken) {
        res.sendStatus(500);
        return;
    }

    let options = {
        url: `https://graph.facebook.com/me/messages?access_token=${accessToken}`,
        method: 'post',
        body: req.body,
        json: true
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error('error posting json: ', error);
            throw error;
        }

        res.sendStatus(200);
    });
});

server.listen(port, () => {
    console.log(`Webhook is listening on port ${port}`);
});
