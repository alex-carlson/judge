var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var submittedDrawings = 0;
var drawingData = [];

app.use(bp.urlencoded({ extended:false })) //some garbage to enable parsing of the body
app.use(bp.json()) // enable parsing of JSON files
app.use(express.static('public')); //use express in static mode to look into the 'public' folder for files (.html, .jpg, .css, etc.)

io.on('connection', function(socket){
  io.emit('players', io.sockets.sockets.length);
  socket.emit('drawingCount', submittedDrawings);
  
  socket.on('disconnect', function(){
    submittedDrawings--;
    io.emit('players', io.sockets.sockets.length);
    socket.emit('drawingCount', submittedDrawings);
  });

  socket.on( 'sendPicture', function( data ) {
    var playerCount = io;
    // socket.broadcast.emit( 'drawCircle', data );
    submittedDrawings++;
    drawingData.push(data);
    console.log(drawingData)
    socket.emit('drawingCount', submittedDrawings);
  })
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});