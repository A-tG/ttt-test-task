const gameSessions = require('./functions/game_sessions.js');
const responds = require('./constants/responds.js');

function isCorrectNewGameRequest(req)
{
    var isJson = req.is('json') === 'json';
    // нужна проверка длины имени и размера поля
    var isNameCorrect = (req.body.user_name !== undefined) && (typeof req.body.user_name === 'string');
    var isSizeCorrect = (req.body.size !== undefined) && Number.isInteger(req.body.size);
    return isNameCorrect && isSizeCorrect;
}

function isCorrectHeader(req)
{
    return (req.get('access_token') !== undefined) && (typeof req.get('access_token') === 'string');
}

function isCorrectJoinGameRequest(req)
{
    var isNameCorrect =  (req.body.user_name !== undefined) && (typeof req.body.user_name === 'string');
    var isGameTokenCorrect = (req.body.game_token !== undefined) && (typeof req.body.game_token === 'string');
    return isNameCorrect && isGameTokenCorrect;
}

function isCorrectMakeMoveRequest(req)
{
    // нужна проверка - ход в пределах размера поля
    var isRowCorrect = (req.body.row !== undefined) && Number.isInteger(req.body.row);
    var isColCorrect = (req.body.col !== undefined) && Number.isInteger(req.body.col);
    return isRowCorrect && isColCorrect;
}

function isValidToken(token)
{
    return (typeof token === 'string') && (token.length > 0) && (token !== '-1');
}

module.exports = {
    newGame: function(req, res)
    {
        var resObj = responds.NOT_VALID;
        if (isCorrectNewGameRequest(req))
        {
            resObj = responds.NEW_GAME_ERR;
            var tokens = gameSessions.createNewGame(req.body.user_name, req.body.size);
            if (isValidToken(tokens.accessToken) && isValidToken(tokens.gameToken))
            {
                resObj = {
                    status: 'ok',
                    access_token: tokens.accessToken, 
                    game_token: tokens.gameToken
                };
            }
        }
        res.json(resObj); 
    },
    
    joinGame: function(req, res)
    {
        var resObj = responds.NOT_VALID;
        if (isCorrectJoinGameRequest(req))
        {
            resObj = responds.JOIN_GAME_ERR;
            var accesToken = gameSessions.joinGame(req.body.user_name, req.body.game_token);
            if (isValidToken(accesToken))
            {
                resObj = {
                    status: 'ok',
                    access_token: accesToken
                }; 
            }
        }
        res.json(resObj);
    },
    
    makeMove: function(req, res)
    {
        var resObj = responds.NOT_VALID;
        if (isCorrectHeader(req) && isCorrectMakeMoveRequest(req))
        {
            resObj = responds.MAKE_MOVE_ERR;
            if (gameSessions.makeMove(req.get('access_token'), req.body))
            {
                resObj = {
                    status: 'ok'
                };
            }
        }
        res.json(resObj);
    },
    
    getState: function(req, res)
    {
        var resObj = responds.NOT_VALID;
        if (isCorrectHeader(req))
        {
            var state = gameSessions.getState(req.get('access_token'));
            resObj = state;
        }
        res.json(resObj);
    },
    
    badRequest: function(req, res)
    {
        var resObj = responds.BAD;
        res.json(resObj);
    }
}
