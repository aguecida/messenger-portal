const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

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
        console.log(event);
    });

    res.status(200).send('EVENT_RECEIVED');
});

app.listen(port, () => {
    console.log(`Webhook is listening on port ${port}`);
});
