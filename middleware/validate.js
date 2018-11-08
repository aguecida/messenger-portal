let validate = (req, res, next) => {
    console.log('Entering validation middleware');
    next();
};

module.exports = {
    validate
};