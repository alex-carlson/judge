var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var submittedDrawings = 0;
var playerCount = io.sockets.sockets.length;
var drawingData = [];
var playerIPs = [];
var votes = 0;
var votingPrompts = [
  "Best Line Quality",
  "Expresses Most Emotion",
  "Most Dimensionality"
];

app.use(bp.urlencoded({ extended:false })) //some garbage to enable parsing of the body
app.use(bp.json()) // enable parsing of JSON files
app.use(express.static('public')); //use express in static mode to look into the 'public' folder for files (.html, .jpg, .css, etc.)

io.on('connection', function(socket){
  playerCount++;
  io.emit('players', playerCount);
  io.emit('drawingCount', submittedDrawings);

  socket.on('uniqueID', function(data){
    var obj = [ data, 0 ];
    playerIPs.push(obj);
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
    var rPrompt = Math.floor(Math.random() * votingPrompts.length);
    socket.emit('sendImageJson', drawingData, votingPrompts[rPrompt]);
  })

  socket.on('vote', function (data){
    votes++;
    for(i = 0; i < playerIPs.length; i++){
      var id = playerIPs[i][0];
      var thisPlayerScore = playerIPs[i][1];
      if(id == data){
        playerIPs[i][1] = thisPlayerScore+1;
      }
    }
    if(votes >= playerIPs.length){
      socket.emit('votesCast');
    }
  })

});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});