"use strict";

let allPieces = [];

class Player {
    constructor(color, name) {
        this.color = color;
        this.name = name;
        this.isMove = false;
    }
}

module.exports.Player = Player;

class ChessBoard {
    constructor(board) {
        this.board = this.generateBoard(board);
    }

    getBoard() {
        return this.board;
    }

    static isInBoard(x, y) {
        return x < 8 && y < 8 && x >= 0 && y >= 0;
    }

    generateBoard(board) {
        let newBoard = [8, 8];

        for (let i = 0; i < 8; i++){
            newBoard[i] = [];
            for (let j = 0; j < 8; j++){
                let space = board[i][j];

                switch (space) {
                    case 'p':
                        newBoard[i][j] = new Pawn('white', {x: j, y: i});
                        break;
                    case 'P':
                        newBoard[i][j] = new Pawn('black', {x: j, y: i});
                        break;
                    case 'b':
                        newBoard[i][j] = new Bishop('white', {x: j, y: i});
                        break;
                    case 'B':
                        newBoard[i][j] = new Bishop('black', {x: j, y: i});
                        break;
                    case 'r':
                        newBoard[i][j] = new Rook('white', {x: j, y: i});
                        break;
                    case 'R':
                        newBoard[i][j] = new Rook('black', {x: j, y: i});
                        break;
                    case 'n':
                        newBoard[i][j] = new Knight('white', {x: j, y: i});
                        break;
                    case 'N':
                        newBoard[i][j] = new Knight('black', {x: j, y: i});
                        break;
                    case 'q':
                        newBoard[i][j] = new Queen('white', {x: j, y: i});
                        break;
                    case 'Q':
                        newBoard[i][j] = new Queen('black', {x: j, y: i});
                        break;
                    case 'k':
                        newBoard[i][j] = new King('white', {x: j, y: i});
                        break;
                    case 'K':
                        newBoard[i][j] = new King('black', {x: j, y: i});
                        break;
                    case ' ':
                        newBoard[i][j] = new EmptySpace({x: j, y: i});
                        break;
                }
            }
        }

        return newBoard;
    }

    movePiece(board, pos, dest) {
        this.board[dest.y][dest.x] = this.board[pos.y][pos.x];
        this.board[pos.y][pos.x] = ' ';

        return this.board;
    }
}

module.exports.ChessBoard = ChessBoard;

class Piece {
    constructor(color, pos, icon, identifier, piece) {
        this.color = color;
        this.pos = pos;
        this.selected = false;
        this.available = true;
        this.icon = icon;
        this.identifier = '';
        this.id = pos.x + '-' + pos.y;
        this.piece = piece;
        this.isEmpty = false;
    }
}

module.exports.Piece = Piece;

// Pawn Class Definition
class Pawn extends Piece {
    constructor(color, pos) {
        super(color, pos, color === 'white' ? '♙' : '♟', ' ', 'pawn');
    }

    getValidMoves(board) {
        console.log("pawn moves:");
        let moves = [];
        let pos = this.pos;

        if (this.color === 'white') {
            if (pos.y > 0) {
                console.log(board[pos.y - 1][pos.x]);

                // check if the space in front of the pawn is empty for moving
                if (board[pos.y - 1][pos.x].isEmpty) {
                    moves.push(`${pos.x}-${pos.y - 1}`);
                }

                // check if the diagonals contain a piece to take
                if (ChessBoard.isInBoard(pos.y - 1, pos.x + 1)) {
                    if (board[pos.y - 1][pos.x + 1].color === 'black') {
                        moves.push(`${pos.x + 1}-${pos.y - 1}`);
                    }
                }

                if (ChessBoard.isInBoard(pos.y - 1, pos.x - 1)) {
                    if (board[pos.y - 1][pos.x - 1].color === 'black') {
                        moves.push(`${pos.x - 1}-${pos.y - 1}`);
                    }
                }

                // check for a double space move if still in starting position
                if (pos.y === 6) {
                    if (board[pos.y - 2][pos.x].isEmpty && board[pos.y - 1][pos.x].isEmpty) {
                        moves.push(`${pos.x}-${pos.y - 2}`);
                    }
                }
            }
        }

        // TODO: finish pawn checks
        if (this.color === 'black') {
            if (pos.y < 7) {
                console.log(board[pos.y + 1][pos.x]);
                if (board[pos.y + 1][pos.x].isEmpty) {
                    moves.push(`${pos.x}-${pos.y + 1}`);
                }

                if (pos.y === 1 && board[pos.y + 1][pos.x].isEmpty) {
                    if (board[pos.y + 2][pos.x].isEmpty) {
                        moves.push(`${pos.x}-${pos.y + 2}`);
                    }
                }
            }
        }

        return moves;
    }
}

module.exports.Pawn = Pawn;
allPieces["pawn"] = function(color, pos) { return new Pawn(color, pos); };

// Rook Class Definition
class Rook extends Piece {
    constructor(color, pos) {
        super(color, pos, color === 'white' ? '♖' : '♜', 'R', 'rook');
        this.hasMoved = false;
    }

    getValidMoves(board) {
        let moves = [];
        let pos = this.pos;
        let blocked = {N: false, E: false, S: false, W: false};

        function checkAndMove(direction, x, y, color) {
            if (!blocked[direction] && ChessBoard.isInBoard(x, y)) {
                if (!board[y][x].isEmpty) {
                    if (board[y][x].color !== color) {
                        moves.push(`${x}-${y}`);
                        blocked[direction] = true;
                    } else {
                        blocked[direction] = true;
                    }
                } else {
                    moves.push(`${x}-${y}`);
                }
            }
        }

        for (let i = 1; i < 8; i++) {
            checkAndMove('N', pos.x, pos.y + i, this.color);
            checkAndMove('E', pos.x + i, pos.y, this.color);
            checkAndMove('S', pos.x, pos.y - i, this.color);
            checkAndMove('W', pos.x - i, pos.y, this.color);
        }

        return moves;
    }
}

module.exports.Rook = Rook;
allPieces["rook"] = function(color, pos) { return new Rook(color, pos); };

// Knight Class Definition
class Knight extends Piece {
    constructor(color, pos) {
        super(color, pos, color === 'white' ? '♘' : '♞', 'N', 'knight');
    }

    getValidMoves(board) {
        console.log("knight moves:");
        let moves = [];
        let pos = this.pos;

        // array of all moves a knight can make
        let moveCombos = [
            {x: pos.x + 2, y: pos.y + 1},
            {x: pos.x + 2, y: pos.y - 1},
            {x: pos.x - 2, y: pos.y + 1},
            {x: pos.x - 2, y: pos.y - 1},
            {x: pos.x + 1, y: pos.y + 2},
            {x: pos.x + 1, y: pos.y - 2},
            {x: pos.x - 1, y: pos.y + 2},
            {x: pos.x - 1, y: pos.y - 2}
        ];

        if (this.color === 'white') {
            moveCombos.forEach((move) => {
                if (ChessBoard.isInBoard(move.x, move.y)) {
                    if (board[move.y][move.x].isEmpty || board[move.y][move.x].color === 'black') {
                        moves.push(`${move.x}-${move.y}`);
                    }
                }
            });
        }

        if (this.color === 'black') {
            moveCombos.forEach((move) => {
                if (ChessBoard.isInBoard(move.x, move.y)) {
                    if (board[move.y][move.x].isEmpty || board[move.y][move.x].color === 'white') {
                        moves.push(`${pos.x}-${pos.y}`);
                    }
                }
            });
        }

        return moves;
    }
}

module.exports.Knight = Knight;
allPieces["knight"] = function(color, pos) { return new Knight(color, pos); };

class Bishop extends Piece {
    constructor(color, pos) {
        super(color, pos, color === 'white' ? '♗' : '♝', 'B', 'bishop');
    }

    getValidMoves(board) {
        let moves = [];
        let pos = this.pos;
        let blocked = {NW: false, NE: false, SW: false, SE: false};

        function checkAndMove(direction, x, y, color) {
            if (!blocked[direction] && ChessBoard.isInBoard(x, y)) {
                if (!board[y][x].isEmpty) {
                    if (board[y][x].color !== color) {
                        moves.push(`${x}-${y}`);
                        blocked[direction] = true;
                    } else {
                        blocked[direction] = true;
                    }
                } else {
                    moves.push(`${x}-${y}`);
                }
            }
        }

        for (let i = 1; i < 8; i++) {
            checkAndMove('NW', pos.x - i, pos.y + i, this.color);
            checkAndMove('NE', pos.x + i, pos.y + i, this.color);
            checkAndMove('SW', pos.x - i, pos.y - i, this.color);
            checkAndMove('SE', pos.x + i, pos.y - i, this.color);
        }

        return moves;
    }
}

module.exports.Bishop = Bishop;
allPieces["bishop"] = function(color, pos) { return new Bishop(color, pos); };

class Queen extends Piece {
    constructor(color, pos) {
        super(color, pos, color === 'white' ? '♕' : '♛', 'Q', 'queen');
    }

    getValidMoves(board) {
        let moves = [];
        let pos = this.pos;
        let blocked = {N: false, E: false, S: false, W: false, NW: false, NE: false, SW: false, SE: false};

        function checkAndMove(direction, x, y, color) {
            if (!blocked[direction] && ChessBoard.isInBoard(x, y)) {
                if (!board[y][x].isEmpty) {
                    if (board[y][x].color !== color) {
                        moves.push(`${x}-${y}`);
                        blocked[direction] = true;
                    } else {
                        blocked[direction] = true;
                    }
                } else {
                    moves.push(`${x}-${y}`);
                }
            }
        }

        // Queen moves are a combination of Bishop and Rook
        for (let i = 1; i < 8; i++) {
            checkAndMove('NW', pos.x - i, pos.y + i, this.color);
            checkAndMove('NE', pos.x + i, pos.y + i, this.color);
            checkAndMove('SW', pos.x - i, pos.y - i, this.color);
            checkAndMove('SE', pos.x + i, pos.y - i, this.color);
            checkAndMove('N', pos.x, pos.y + i, this.color);
            checkAndMove('E', pos.x + i, pos.y, this.color);
            checkAndMove('S', pos.x, pos.y - i, this.color);
            checkAndMove('W', pos.x - i, pos.y, this.color);
        }

        return moves;
    }
}

module.exports.Queen = Queen;
allPieces["queen"] = function(color, pos) { return new Queen(color, pos); };

class King extends Piece {
    constructor(color, pos) {
        super(color, pos, color === 'white' ? '♔' : '♚', 'K', 'king');
        this.hasMoved = false;
    }

    getValidMoves(board) {
        let moves = [];
        let pos = this.pos;
        let blocked = {N: false, E: false, S: false, W: false};

        // TODO: needs a check for if in range of another King
        function checkAndMove(direction, x, y, color) {
            if (!blocked[direction] && ChessBoard.isInBoard(x, y)) {
                if (!board[y][x].isEmpty) {
                    if (board[y][x].color !== color) {
                        moves.push(`${x}-${y}`);
                        blocked[direction] = true;
                    } else {
                        blocked[direction] = true;
                    }
                } else {
                    moves.push(`${x}-${y}`);
                }
            }
        }

        // Kings move like lazy Queens, who can only move one space
        checkAndMove('NW', pos.x - 1, pos.y + 1, this.color);
        checkAndMove('NE', pos.x + 1, pos.y + 1, this.color);
        checkAndMove('SW', pos.x - 1, pos.y - 1, this.color);
        checkAndMove('SE', pos.x + 1, pos.y - 1, this.color);
        checkAndMove('N', pos.x, pos.y + 1, this.color);
        checkAndMove('E', pos.x + 1, pos.y, this.color);
        checkAndMove('S', pos.x, pos.y - 1, this.color);
        checkAndMove('W', pos.x - 1, pos.y, this.color);

        return moves;
    }
}

module.exports.King = King;
allPieces["king"] = function(color, pos) { return new King(color, pos); };

class EmptySpace {
    constructor(pos) {
        this.pos = pos;
        this.id = pos.x + '-' + pos.y;
        this.isEmpty = true;
    }

    toString() {
        return ' ';
    }
}

module.exports.EmptySpace = EmptySpace;

class PieceFactory {
    getPiece(type, color, pos) {
        return new allPieces[type](color, pos);
    }
}

module.exports.PieceFactory = new PieceFactory();
