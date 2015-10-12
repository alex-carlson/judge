var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var createdPlayers = [];

app.use(bp.urlencoded({ extended:false })) //some garbage to enable parsing of the body
app.use(bp.json()) // enable parsing of JSON files
app.use(express.static('public')); //use express in static mode to look into the 'public' folder for files (.html, .jpg, .css, etc.)

io.on('connection', function(socket){
  io.emit('players', io.sockets.sockets.length);

  socket.on('submitPlayer', function (data) {
    createdPlayers.push(data);
    console.log("playerCount: "+createdPlayers.length);
    io.emit('playerList', createdPlayers);
  });
  
  socket.on('disconnect', function(){
    io.emit('players', io.sockets.sockets.length);
  });
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});