let config = require('./config.json');

function SendResponse(res, json, status){
    res.status(status).send(json);
}

function Authorize(req, res, next_func){
    if (req.body.auth_key === config.authorization_key){
        next_func();
    } else {
        SendResponse(res, { error: 'Incorrect authorization key'}, 401)
    };
}

module.exports = {
    Authorize: Authorize
}