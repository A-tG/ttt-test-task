const PLAYER1_MARK = 'X';
const PLAYER2_MARK = 'O';
const EMPTY_MARK = '?';
const PLAYERS_NUMBER = 2;
const MAX_FIELD_SIZE = 5;
const MIN_FIELD_SIZE = 3;

function Player(name, accessToken)
{
    this.name = name;
    this.accessToken = accessToken;
}

// есть ли смысл использовать прототип для экономии памяти и производительности?
function Game(hostPlayerName, fieldSize, accessToken, gameToken)
{
    this.idleDuration = 0;
    this.gameDuration = 0;
    this.field = createField(fieldSize);
    this.players = [
        new Player(hostPlayerName, accessToken)
    ];
    this.playerTurn = 0;
    this.gameToken = gameToken;
    
    this.getPlayersTokens = function()
    {
        var tokens = [];
        var players = this.players;
        for (var i = 0; i < players.length; i++)
        {
            tokens.push(players[i].accessToken);
        }
        return tokens;
    };
    
    this.getPlayersNumber = function()
    {
        return this.players.length;
    };
    
    this.getState = function(accessToken)
    {
        this.idleDuration = 0;
        var gameDuration = this.gameDuration;
        var field = this.field;
        var state = {
            status: 'ok',
            your_turn: isUserTurn(accessToken),
            game_duration: gameDuration,
            field: field
        };
        if (this.winner !== undefined)
        {
            state.winner = this.winner;
        }
        return state;
    }
    
    this.joinGame = function(playerName, accessToken)
    {
        var playersNumber = this.players.length;
        if (playersNumber < PLAYERS_NUMBER)
        {
            this.players.push(new Player(playerName, accessToken));
        }
    };
    
    this.makeMove = function(move, accessToken)
    {
        var result = false;
        if (isUserTurn(accessToken) && canMakeMove(move))
        {
            this.idleDuration = 0;
            var moveMarker = getMoveMarker();
            this.field[move.row][move.col] = moveMarker;
            determineWinner();
            incPlayerTurn();
            result = true;
        }
        return result;
    };
    
    var thisGame = this;
    
    function incPlayerTurn()
    {
        var playersNumber = thisGame.players.length;
        thisGame.playerTurn = (thisGame.playerTurn + 1) % playersNumber;
    }
    
    function getMoveMarker()
    {
        var moveMarker;
        switch (thisGame.playerTurn)
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
    
    
    function isUserTurn(accessToken)
    {
        return (thisGame.players[thisGame.playerTurn].accessToken === accessToken);
    }
    
    function canMakeMove(move)
    {
        var fieldSize = thisGame.field.length;
        var isCanMakeMoveOnField = (move.row < fieldSize) && (move.row >= 0) && 
            (move.col < fieldSize) && (move.col >= 0) && 
            thisGame.field[move.row][move.col] === EMPTY_MARK;
        var isEnoughPlayers = thisGame.players.length == PLAYERS_NUMBER;
        var isNoWinner = thisGame.winner === undefined;
        return isCanMakeMoveOnField && isEnoughPlayers && isNoWinner;
    }
    
    function determineWinner()
    {
        if (isFieldHaveMarkersLines(thisGame.field))
        {
            thisGame.winner = thisGame.players[thisGame.playerTurn];
        }
    }
}

function isMarkersFormsLine(line)
{
    var firstMarker = line[0];
    var isNoEmptyMarkers = line[0] !== EMPTY_MARK;
    return isNoEmptyMarkers && line.every(lineMarker => lineMarker === firstMarker);
}

function isFieldHaveMarkersLines(field)
{
    var isFormLine = false;
    for (var row = 0; row < field.length; row++)
    {
        isFormLine = isMarkersFormsLine(field[row]);
        if (isFormLine)
        {
            return true;
        }
    }
    for (var col = 0; col < field.length; col++)
    {
        var vertLine = [];
        for (var row = 0; row < field.length; row++)
        {
            vertLine.push(field[row][col]);
        }
        isFormLine = isMarkersFormsLine(vertLine);
        if (isFormLine)
        {
            return true;
        }
    }
    var diagonalLine = [];
    for (var i = 0; i < field.length; i++)
    {
        diagonalLine.push(field[i][i]);
    }
    isFormLine = isMarkersFormsLine(diagonalLine);
    return isFormLine;
}


function createField(fieldSize)
{
    var field = [];
    fieldSize = Math.max(MIN_FIELD_SIZE, fieldSize);
    fieldSize = Math.min(MAX_FIELD_SIZE, fieldSize);
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

module.exports = {
    createNewGame: function(hostPlayerName, fieldSize, accessToken, gameToken)
    {
        var game = new Game(hostPlayerName, fieldSize, accessToken, gameToken);
        return game;
    }
}
