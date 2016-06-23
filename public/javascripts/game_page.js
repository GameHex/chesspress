var board = [];
var clicked = '';
var clickedPos = {};
var moves = [];
var game = {};
var player = {};
var source;
var template;
var turnSource;
var turnTemplate;
var socket = io();

function showValidMoves(data) {
    if (moves.length > 0) {
        moves.forEach(function(space) {
            $('#' + space).removeClass('validMove');
        })
    }

    data.forEach(function(space) {
        $('#' + space).addClass('validMove');
    });

    moves = data;
}

function initBoard() {
    // get and compile the template source on document ready
    source   = $("#entry-template").html();
    template = Handlebars.compile(source);

    turnSource   = $("#turn-template").html();
    turnTemplate = Handlebars.compile(turnSource);

    // query the board endpoint for the initial board
    $.ajax({
        type: 'GET',
        url: '/board',
        dataType: 'json',
        success: function(data){
            board = data.board;
            game = data.game;
            $('#chessTable').html(template({board: data.board}));
            $('#turn').html(turnTemplate({move: game.move.charAt(0).toUpperCase() + game.move.substr(1, game.move.length)}));
            player = data.player;
            socket.emit('joined', data.game.players[data.player.color].name, data.game.id);
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

$(document).ready(function() {
    initBoard();

    $('form').submit(function() {
        socket.emit('chat message', $('#chat-input').val());
        $('#chat-input').val('');
        return false;
    });
});

function selectSpace(id, x, y, isEmpty) {

    // restrict player to their own move and color
    if (game.move === player.color) {
        var isValidMove = moves.length > 0 ? moves.indexOf(id) > -1 : false;

        // we know to move a piece if there are valid moves
        if (moves.length > 0 && isValidMove) {
            var dat = {from: clickedPos, to: {x: x, y: y}};

            $.ajax({
                type: 'POST',
                url: '/moves/move',
                data: dat,
                dataType: 'json',
                success: function (data) {
                    if (data.board) {
                        moves = [];
                        $('#chessTable').html(template({board: data.board}));
                        board = data.board;
                        socket.emit('moved');
                    } else if (data.moves) {
                        showValidMoves(data.moves);
                    }
                },
                error: function (xhr, type) {
                    return xhr;
                }
            });
        }

        // get a list of valid moves to show if a non-empty square is clicked
        if (!isEmpty) {
            if (clicked !== '') {
                $('#' + clicked).removeClass('selected');
            }

            $('#' + id).addClass('selected');
            clicked = id;
            clickedPos = {x: x, y: y};

            $.ajax({
                type: 'POST',
                url: '/moves',
                data: {x: x, y: y},
                dataType: 'json',
                success: function (data) {
                    showValidMoves(data);
                    $('#' + id).removeClass('validMove');
                },
                error: function (xhr, type) {
                    return xhr;
                }
            });
        }
    }
}

socket.on('refresh board', function(data){
    $('#chessTable').html(template({board: data.board}));
    game = data.game;
    $('#turn').html(turnTemplate({move: game.move.charAt(0).toUpperCase() + game.move.substr(1, game.move.length)}));
});

socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
    $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
});