const UPDATE_TIME = 2000;
const MAX_SESSION_DURATION = 1000 * 60 * 5;

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

function createField(fieldSize)
{
    var field = [];
    for (var row = 0; row < fieldSize; row++)
    {
        field.push([]);
        for (var col = 0; col < fieldSize; col++)
        {
            field[row].push('?');
        }
    }
    return field;
}

function isUserTurn(game, accesToken)
{
    var result = false;
    return result;
}

function makeMove(field, move)
{
    var result = false;
    return result;
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
            hostPlayer = {
                name: hostPlayerName,
                accessToken: accessToken
            };
            sessions[gameToken] = {
                gameDuration: 0,
                field: createField(fieldSize),
                players: [hostPlayer]
            };
            usersConnectionsToGames[accessToken] = gameToken;
            tokensPair = [gameToken, accessToken];
        }
        return tokensPair;
    },
    
    joinGame: function(playerName, gameToken)
    {
        var isGameExist = sessions[gameToken] !== undefined;
        var gameToken = '-1';
        if (isGameExist)
        {
            var game = sessions[gameToken];
            var accesToken = getNewAccessToken();
            var playersNumber = game.players.length;
            var isTokenCreated = accesToken !== '-1';
            if ((playersNumber < 2) && (isTokenCreated))
            {
                gameToken = game.gameToken;
                var player = {
                    name: playerName,
                    accessToken: accessToken
                }
                game.players.push(player);
                usersConnectionsToGames[accesToken] = gameToken;
            }
        }
        return gameToken;
    },
    
    makeMove: function(accesToken, move)
    {
        var result = false;
        var isGameExist = usersConnectionsToGames[accesToken] !== undefined;
        if (isGameExist)
        {
            var gameToken = usersConnectionsToGames[accesToken];
            result = makeMove(sessions[gameToken], move);
        }
        return result;
    },
    
    getState: function(accesToken)
    {
        var state = {status: 'not in game'};
        var isGameExist = usersConnectionsToGames[accesToken] !== undefined;
        if (isGameExist)
        {
            var gameToken = usersConnectionsToGames[accesToken];
            var game = session[gameToken];
            state = {
                status: 'ok',
                your_turn: isUserTurn(game, accesToken),
                game_duration: game.gameDuration,
                field: game.field
                //winner
            }
        }
        return state;
    }
}