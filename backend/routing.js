const gameSessions = require('./functions/game_sessions.js');
const responds = require('./constants/responds.js');
const isCorrect = require('./functions/requests_check.js')

module.exports = {
    newGame: function(req, res)
    {
        var resObj = responds.NOT_VALID;
        if (isCorrect.newGameRequest(req))
        {
            resObj = responds.NEW_GAME_ERR;
            var tokens = gameSessions.createNewGame(req.body.user_name, req.body.size);
            if (isCorrect.token(tokens.accessToken) && isCorrect.token(tokens.gameToken))
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
        if (isCorrect.joinGameRequest(req))
        {
            resObj = responds.JOIN_GAME_ERR;
            var accesToken = gameSessions.joinGame(req.body.user_name, req.body.game_token);
            if (isCorrect.token(accesToken))
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
        if (isCorrect.header(req) && isCorrect.makeMoveRequest(req))
        {
            resObj = responds.MAKE_MOVE_ERR;
            if (gameSessions.makeMove(req.body, req.get('access_token')))
            {
                resObj = responds.OK;
            }
        }
        res.json(resObj);
    },
    
    getState: function(req, res)
    {
        var resObj = responds.NOT_VALID;
        if (isCorrect.header(req))
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
