"use strict";

const classes = require('../bin/classes.js');
var express = require('express');
var router = express.Router();
var index = require('./index.js');
var boards = index.router.boards;
var games = index.router.games;

function movePiece(board, pos, dest) {

    // TODO: refactor into ChessBoard method
    if (!board[parseInt(pos.y)][parseInt(pos.x)].isEmpty) {
        let moves = board[parseInt(pos.y)][parseInt(pos.x)].getValidMoves(board);
        let canMove = false;

        moves.forEach((move) => {
            if (canMove === false) {
                let splitMove = move.split('-');
                let possiblePos = {x: parseInt(splitMove[0]), y: parseInt(splitMove[1])};

                if (parseInt(dest.x) === possiblePos.x && parseInt(dest.y) === possiblePos.y) {
                    canMove = true;
                }
            }
        });

        if (canMove) {
            let tempDestPiece = board[parseInt(dest.y)][parseInt(dest.x)];

            // swap the pieces but maintain the original id and pos
            board[parseInt(dest.y)][parseInt(dest.x)] = board[parseInt(pos.y)][parseInt(pos.x)];
            board[parseInt(dest.y)][parseInt(dest.x)].pos = tempDestPiece.pos;
            board[parseInt(dest.y)][parseInt(dest.x)].id = tempDestPiece.id;

            // the constructor for EmptySpace should take care of the new id and pos
            board[parseInt(pos.y)][parseInt(pos.x)] = new classes.EmptySpace({x: pos.x, y: pos.y});

            return {board: board};
        } else {
            return {moves: moves};
        }
    } else {
        return {board: board};
    }
}

/* gets moves for a piece */
router.post('/', function(req, res, next) {
    console.log(req.session.uuid);
    let board = boards.get(req.session.uuid).board;
    let x = parseInt(req.body.x);
    let y = parseInt(req.body.y);

    let moves = board[y][x].getValidMoves(board);
    res.send(moves);
});

/* moves a piece */
router.post('/move', function(req, res, next) {
    console.log(req.session.uuid);
    let newBoard = movePiece(boards.get(req.session.uuid).board, req.body.from, req.body.to);

    if (newBoard.board) {
        boards.set(req.session.uuid, newBoard);
    }

    res.send(newBoard);
});

module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('disconnect', function() {
            if (socket.request.session.uuid && socket.request.session.player) {
                console.log(socket.request.session.uuid);
                console.log(socket.request.session.player);
                console.log(`${socket.request.session.player.name} got disconnected!`);
                let gameIndex = games.findIndex(game => game.id === socket.request.session.uuid);
                let player = socket.request.session.player;

                if (games.length > 0 && gameIndex > -1) {
                    games[gameIndex].players[player.color] = undefined;
                    games[gameIndex].disabled = false;
                }
            }

        });

        socket.on('moved', function(player){
            console.log(`${socket.request.session.player.name} made a move.`);
            let board = boards.get(socket.request.session.uuid).board;
            let game = games.find(game => game.id === socket.request.session.uuid);

            io.sockets.in(socket.request.session.uuid).emit('refresh board', {board: board, game: game, player: socket.request.session.player});
        });
    });

    return router;
};
