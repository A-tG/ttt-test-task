const UPDATE_TIME = 2000;
const MAX_SESSION_DURATION = 1000 * 60 * 5;

const gameLogic = require('./game_logic.js');

var sessions = {};
var usersConnectionsToGames = {};

function deleteSession(gameToken)
{
    var players = sessions[gameToken].players;
    for (var i = 0; players.length; i++)
    {
        delete usersConnectionsToGames[players.accessToken]
    }
    delete sessions[gameToken];
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
        sessions[key].gameDuration += UPDATE_TIME;
        if (sessions[key].gameDuration > (MAX_SESSION_DURATION))
        {
            deleteSession(gameToken);
        }
    }
}

var updateIntervalId = setInterval(updateSessions, UPDATE_TIME);

module.exports = {
    createNewGame: function(hostPlayerName, fieldSize)
    {
        var tokensPair = ['-1', '-1'];
        var gameToken = getNewGameToken();
        var accessToken = getNewAccessToken();
        var isTokensCreated = (gameToken !== '-1') && (accessToken !== '-1');
        if (isTokensCreated)
        {
            sessions[gameToken] = gameLogic.createNewGame(hostPlayerName, fieldSize, accesToken, gameToken);
            usersConnectionsToGames[accessToken] = gameToken;
            tokensPair = [gameToken, accessToken];
        }
        return tokensPair;
    },
    
    joinGame: function(playerName, gameToken)
    {
        var isGameExist = sessions[gameToken] !== undefined;
        var accesToken = '-1';
        if (isGameExist)
        {
            var game = sessions[gameToken];
            accessToken = getNewAccessToken();
            var playersNumber = getPlayersNumber(game);
            var isTokenCreated = accesToken !== '-1';
            if ((playersNumber < 2) && (isTokenCreated))
            {
                gameLogic.joinGame(game, playerName, accessToken);
                usersConnectionsToGames[accesToken] = gameToken;
            }
        }
        return accesToken;
    },
    
    makeMove: function(accesToken, move)
    {
        var result = false;
        var isGameExist = usersConnectionsToGames[accesToken] !== undefined;
        if (isGameExist)
        {
            var gameToken = usersConnectionsToGames[accesToken];
            result = gameLogic.makeMove(sessions[gameToken], move, accesToken);
        }
        return result;
    },
    
    getState: function(accesToken)
    {
        var state = {
            status: 'error',
            message: 'User not in game'
        };
        var isGameExist = usersConnectionsToGames[accesToken] !== undefined;
        if (isGameExist)
        {
            var gameToken = usersConnectionsToGames[accesToken];
            var game = session[gameToken];
            state = gameLogic.getState(game, accesToken);
        }
        return state;
    }
}
