const PLAYER1_MARK = 'X';
const PLAYER2_MARK = 'O';
const EMPTY_MARK = '?';
const PLAYERS_NUMBER = 2;

function createField(fieldSize)
{
    var field = [];
    for (var row = 0; row < fieldSize; row++)
    {
        field.push([]);
        for (var col = 0; col < fieldSize; col++)
        {
            field[row].push(EMPTY_MARK);
        }
    }
    return field;
}

function isUserTurn(game, accesToken)
{
    return (game.players[game.playerTurn].accesToken == accesToken);
}

function isCanMakeMove(game, move)
{
    var isCanMakeMoveOnField = game.field[move.row][move.col] === EMPTY_MARK;
    var isEnoughPlayers = game.players.length == PLAYERS_NUMBER;
    var isNoWinner = game.winner === undefined;
    return isCanMakeMoveOnField && isEnoughPlayers && isNoWinner;
}

function getMoveMarker(game)
{
    var moveMarker;
    switch (game.playerTurn)
    {
        case 0:
            moveMarker = PLAYER1_MARK;
            break;
        case 1:
            moveMarker = PLAYER2_MARK;
            break;
        default:
            moveMarker = PLAYER1_MARK;
    }
    return moveMarker;
}

function determineWinner(game)
{
    return false;
}

module.exports = {
    createNewGame: function(hostPlayerName, fieldSize, accesToken, gameToken)
    {
        var hostPlayer = {
            name: hostPlayerName,
            accessToken: accessToken
        };
        var game = {
            gameDuration: 0,
            field: createField(fieldSize),
            players: [hostPlayer],
            playerTurn: 0
        };
        return game;
    },
    joinGame: function(game, playerName, accessToken)
    {
        var player = {
            name: playerName,
            accessToken: accessToken
        }
        game.players.push(player);
    },
    getPlayersNumber: function(game)
    {
        return game.players.length;
    },
    getState: function(game, accesToken)
    {
        state = {
            status: 'ok',
            your_turn: isUserTurn(game, accesToken),
            game_duration: game.gameDuration,
            field: game.field
            // winner
        };
        if (game.winner !== undefined)
        {
            state.winner = game.winner;
        }
        return state;
    },
    makeMove: function(game, move, accesToken)
    {
        var result = false;
        if (isUserTurn(game, accesToken) && isCanMakeMove(game, move))
        {
            var moveMarker = getMoveMarker(game);
            field[move.row][move.col] = moveMarker;
            game.playerTurn = (game.playerTurn + 1) % Math.min(game.players.length, PLAYERS_NUMBER);
            determineWinner(game);
            result = true;
        }
        return result;
    }
}
