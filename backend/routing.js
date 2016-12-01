const gameSessions = require('./functions/game_sessions.js');

module.exports = {
    newGame: function(req, res)
    {
        // check request POST /new_game { "user_name": "John Doe", size: 3 /* размер поля */ }
        // create session
        var tokensPair = gameSessions.createNewGame('John Doe', 3);
        // respond (status, acces token, game token)
        var resObj = {
            status: 'ok',
            access_token: tokensPair[1], 
            game_token: tokensPair[0]
        };
        res.json(resObj);
    },
    
    joinGame: function(req, res)
    {
        // check request POST /join_game { "game_token": "123abc", "user_name": "Chuck Norris" }
        // join to session 
        var accesToken = gameSessions.joinGame('John', '123abc');
        // respond (status, access token)
        var resObj = {
            status: 'ok',
            access_token: accesToken
        };
        res.json(resObj);
    },
    
    makeMove: function(req, res)
    {
        // check request (can make a move? acces token in header) POST /make_a_move { “row”: 1, “col”: 2 }
        var accesToken = '0test';
        var move = {row: 1, col: 2};
        // make a move
        gameSessions.makeMove(accesToken, move);
        // respond
        var resObj = {
            status: 'ok'
        };
        res.json(resObj);
    },
    
    getState: function(req, res)
    {
        // check request (acces token)
        var state = gameSessions.getState();
        // respond
        var resObj = state;
        res.json(resObj);
    },
    
    badRequest: function(req, res)
    {
        var resObj = {
            status: 'error',
            message: 'Bad request'
        };
        res.json(resObj);
    }
}
