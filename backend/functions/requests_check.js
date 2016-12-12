function isCorrectUserName(name)
{
    // максимальную длину имени возможно нужно вывести в отдельный файл с константами
    return (typeof name === 'string') && (name.length > 0) && (name.length <= 20);
}

function isCorrectToken(token)
{
    return (typeof token === 'string') && (token.length > 0) && (token !== '-1');
}

module.exports = {
    newGameRequest: function(req)
    {
        var isJson = req.is('json') === 'json';
        var isNameCorrect = (req.body.user_name !== undefined) && 
            isCorrectUserName(req.body.user_name);
        var isSizeCorrect = (req.body.size !== undefined) && 
            Number.isInteger(req.body.size) &&
            (req.body.size > 0);
        return isNameCorrect && isSizeCorrect;
    },
    
    header: function(req)
    {
        return (req.get('access_token') !== undefined) && 
            isCorrectToken(req.get('access_token'));
    },
    
    joinGameRequest: function(req)
    {
        var isNameCorrect = (req.body.user_name !== undefined) && 
            isCorrectUserName(req.body.user_name);
        var isGameTokenCorrect = (req.body.game_token !== undefined) && 
            isCorrectToken(req.body.game_token);
        return isNameCorrect && isGameTokenCorrect;
    },
    
    makeMoveRequest: function(req)
    {
        var isRowCorrect = (req.body.row !== undefined) && 
            Number.isInteger(req.body.row) &&
            (req.body.row > 0);
        var isColCorrect = (req.body.col !== undefined) && 
            Number.isInteger(req.body.col) &&
            (req.body.col > 0);
        return isRowCorrect && isColCorrect;
    },
    
    userName: isCorrectUserName,
    
    token: isCorrectToken
}
