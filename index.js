var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var submittedDrawings = 0;
var playerCount = io.sockets.sockets.length;
var drawingData = [];
var playerIPs = [];

app.use(bp.urlencoded({ extended:false })) //some garbage to enable parsing of the body
app.use(bp.json()) // enable parsing of JSON files
app.use(express.static('public')); //use express in static mode to look into the 'public' folder for files (.html, .jpg, .css, etc.)

io.on('connection', function(socket){
  playerCount++;
  var playerID = socket.handshake.address;
  playerIPs.push(playerID);
  io.emit('players', playerCount, playerID);
  socket.emit('drawingCount', submittedDrawings);
  
  socket.on('disconnect', function(){
    playerCount--;
    io.emit('players', playerCount);
    socket.emit('drawingCount', submittedDrawings);
  });

  socket.on( 'sendPicture', function ( data ) {
    // socket.broadcast.emit( 'drawCircle', data );
    submittedDrawings++;
    drawingData.push(data);
    socket.emit('drawingCount', submittedDrawings);
  })

});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});