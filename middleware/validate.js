const crypto = require('crypto');

let validate = (req, res, next) => {
    // Bypass validation in dev mode
    if (process.env.NODE_ENV === 'development') {
        next();
        return;
    }

    console.log('Entering validation middleware');

    // Hash request body using SHA1
    const hmac = crypto.createHmac('sha1', process.env.APP_SECRET);
    hmac.update(req.rawBody, 'utf-8');

    if (req.headers['x-hub-signature'] === `sha1=${hmac.digest('hex')}`) {
        next();
    }
    else {
        res.status(400).send('Invalid signature');
    }
};

module.exports = {
    validate
};