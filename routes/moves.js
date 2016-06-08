"use strict";

const classes = require('../bin/classes.js');
var express = require('express');
var router = express.Router();

function movePiece(board, pos, dest) {
    
    // TODO: refactor into ChessBoard method
    if (!board[parseInt(pos.y)][parseInt(pos.x)].isEmpty) {
        let moves = classes.PieceFactory.getPiece(board[parseInt(pos.y)][parseInt(pos.x)].piece, 'white', {
            x: parseInt(pos.x),
            y: parseInt(pos.y)
        }).getValidMoves(board);
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
            let tempPosPiece = board[parseInt(pos.y)][parseInt(pos.x)];
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
    let board = req.session.board;
    let x = parseInt(req.body.x);
    let y = parseInt(req.body.y);

    let moves = classes.PieceFactory.getPiece(board[y][x].piece, 'white', {x: x, y: y}).getValidMoves(board);
    res.send(moves);
});

/* moves a piece */
router.post('/move', function(req, res, next) {
    let newBoard = movePiece(req.session.board, req.body.from, req.body.to);

    if (newBoard.board) {
        req.session.board = newBoard.board;
    }

    res.send(newBoard);
});

module.exports = router;
