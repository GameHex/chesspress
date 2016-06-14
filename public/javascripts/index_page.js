var games = [];
var source;
var template;

function refreshGames() {
    $.ajax({
        type: 'GET',
        url: '/games',
        dataType: 'json',
        success: function(data){
            games = data;
            $('#gameList').html(template({games: data}));
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

function newGame() {
    if (document.getElementById('player').validity.valid) {
        $('#player').removeClass('invalid');
        $.ajax({
            type: 'POST',
            data: {name: $('#player').val()},
            url: '/game',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                games = data;
                $('#gameList').html(template({games: data}));
                window.location = "/game";
            },
            error: function(xhr, type){
                return xhr;
            }
        });
    } else {
        $('#player').addClass('invalid');
    }
}

function joinGame(uuid) {
    if (document.getElementById('player').validity.valid) {
        $('#player').removeClass('invalid');
        $.ajax({
            type: 'POST',
            data: {id: uuid},
            url: '/join',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if (data.canJoin) {
                    window.location = "/game";
                }
            },
            error: function(xhr, type){
                return xhr;
            }
        });
    } else {
        $('#player').addClass('invalid');
    }
}

function initPage() {
    // get and compile the template source on document ready
    source   = $("#entry-template").html();
    template = Handlebars.compile(source);

    // reset player name on reload
    $('#player').val("");

    // query the board endpoint for the initial board
    $.ajax({
        type: 'GET',
        url: '/games',
        dataType: 'json',
        cache:false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data){
            games = data;
            $('#gameList').html(template({games: data}));
        },
        error: function(xhr, type){
            return xhr;
        }
    });
}

$(document).ready(function() {
    initPage();
});
