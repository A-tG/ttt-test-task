module.exports = {
    NOT_VALID: {
        status: 'error',
        message: 'Not valid request data'
    },
    
    BAD: {
        status: 'error',
        message: 'Bad request'
    },
    
    OK: {
        status: 'ok'
    },
    
    NEW_GAME_ERR: {
        status: 'error',
        message: 'Failed to create a game'
    },
    
    JOIN_GAME_ERR: {
        status: 'error',
        message: 'Failed to join a game'
    },
    
    MAKE_MOVE_ERR: {
        status: 'error',
        message: 'Failed to make a move'
    }
}
