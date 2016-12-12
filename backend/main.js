const serverCfg = require('./server_config.js');
const routing = require('./routing.js');

const express = require('express');
const bodyParser = require('body-parser');
const server = express();
server.use(bodyParser.json());
server.listen(serverCfg.SERVER_PORT, serverCfg.SERVER_ADRESS);
server.get('/state', routing.getState);
server.post('/new_game', routing.newGame);
server.post('/join_game', routing.joinGame);
server.post('/make_a_move', routing.makeMove);
server.all('*', routing.badRequest);
