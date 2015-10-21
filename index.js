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
  io.emit('players', playerCount);
  io.emit('drawingCount', submittedDrawings);

  socket.on('uniqueID', function(data){
    playerIPs.push(data);
    console.log(playerIPs);
  })
  
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

  socket.on( 'sendPickedImages', function(){
    socket.emit('sendImageJson', drawingData);
  })

});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});