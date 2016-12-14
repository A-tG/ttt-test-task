const UPDATE_TIME = 2000;
const MAX_IDLE_DURATION = 1000 * 60 * 5;

const gameLogicTTT = require('./ttt_game_logic.js');

var sessions = {};
var usersConnectionsToGames = {};

function deleteSession(token)
{
    var tokens = sessions[token].getPlayersTokens();
    for (var i = 0; i < tokens.length; i++)
    {
        delete usersConnectionsToGames[tokens[i]];
    }
    delete sessions[token];
}

function generateToken()
{
    var gameToken = Math.random() * 10000000000;
    return Math.round(gameToken).toString(16);
}

function getNewGameToken()
{
    var gameToken = generateToken();
    var isTokenUsed = sessions[gameToken] !== undefined;
    for (var attempts = 0; isTokenUsed && (attempts < 10000); attempts++)
    {
        gameToken = generateToken();
        isTokenUsed = sessions[gameToken] !== undefined;
    }
    return (!isTokenUsed) ? gameToken : '-1';
}

function getNewAccessToken()
{
    var accessToken = generateToken();
    var isTokenUsed = usersConnectionsToGames[accessToken] !== undefined;
    for (var attempts = 0; isTokenUsed && (attempts < 10000); attempts++)
    {
        accessToken = generateToken();
        isTokenUsed = usersConnectionsToGames[accessToken] !== undefined;
    }
    return (!isTokenUsed) ? accessToken : '-1';
}

function updateSessions()
{
    for (key in sessions)
    {
        var session = sessions[key];
        session.gameDuration += UPDATE_TIME;
        session.idleDuration += UPDATE_TIME;
        if (session.idleDuration > MAX_IDLE_DURATION)
        {
            deleteSession(key);
        }
    }
}

var updateIntervalId = setInterval(updateSessions, UPDATE_TIME);

module.exports = {
    createNewGame: function(hostPlayerName, fieldSize)
    {
        var tokens = {
            gameToken: '-1', 
            accessToken: '-1'
        };
        var gameToken = getNewGameToken();
        var accessToken = getNewAccessToken();
        var isTokensCreated = (gameToken !== '-1') && (accessToken !== '-1');
        if (isTokensCreated)
        {
            sessions[gameToken] = gameLogicTTT.createNewGame(hostPlayerName, fieldSize, accessToken, gameToken);
            usersConnectionsToGames[accessToken] = gameToken;
            tokens.gameToken = gameToken;
            tokens.accessToken = accessToken;
        }
        return tokens;
    },
    
    joinGame: function(playerName, gameToken)
    {
        var isGameExist = sessions[gameToken] !== undefined;
        var accessToken = '-1';
        if (isGameExist)
        {
            var game = sessions[gameToken];
            accessToken = getNewAccessToken();
            var playersNumber = game.getPlayersNumber();
            var isTokenCreated = accessToken !== '-1';
            if ((playersNumber < 2) && (isTokenCreated))
            {
                game.joinGame(playerName, accessToken);
                usersConnectionsToGames[accessToken] = gameToken;
            }
        }
        return accessToken;
    },
    
    makeMove: function(move, accessToken)
    {
        var result = false;
        var isGameExist = usersConnectionsToGames[accessToken] !== undefined;
        if (isGameExist)
        {
            var gameToken = usersConnectionsToGames[accessToken];
            result = sessions[gameToken].makeMove(move, accessToken);
        }
        return result;
    },
    
    getState: function(accessToken)
    {
        var state = {
            status: 'error',
            message: 'User not in game'
        };
        var isGameExist = usersConnectionsToGames[accessToken] !== undefined;
        if (isGameExist)
        {
            var gameToken = usersConnectionsToGames[accessToken];
            var game = sessions[gameToken];
            state = game.getState(accessToken);
        }
        return state;
    }
}
