var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var submittedDrawings = 0;
var drawingData = [];
var scores = [];
var allClients = [];
var votes = 0;
var votingPrompts = [
  "Best Line Quality",
  "Most Dimensionality",
  "Most Human-like",
  "Most Rhythmic",
  "Most Structured",
  "Most Color Variation",
  "Cleanest",
  "Sloppiest",
  "Straightest Lines",
  "Most Realistic"
];
var rPrompt = 0;

app.use(bp.urlencoded({ extended:false })) //some garbage to enable parsing of the body
app.use(bp.json()) // enable parsing of JSON files
app.use(express.static('public')); //use express in static mode to look into the 'public' folder for files (.html, .jpg, .css, etc.)

io.on('connection', function(socket){
  socket.emit('playerID', socket.id);
  allClients.push(socket);
  //io.emit('players', playerCount, scores);
  io.emit('drawingCount', submittedDrawings);
  var obj = [ socket.id, 0 ];
  scores.push(obj);
  io.emit('updateScore', scores);
  io.emit('players', allClients.length, scores);

  // do stuff on player disconnect
  
  socket.on('disconnect', function(){
    submittedDrawings--;

    // remove this client from the game
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);

    //also remove this player's score.  :(
    scores.splice(i, 1);

    io.emit('players', allClients.length, scores);
    io.emit('drawingCount', submittedDrawings);
  });

  socket.on( 'sendPicture', function ( data ) {
    submittedDrawings++;
    drawingData.push(data);
    io.emit('drawingCount', submittedDrawings);
  })

  // when we get a vote

  socket.on('vote', function (data){
    votes++;
    for(i = 0; i < scores.length; i++){
      var id = scores[i][0];
      var thisPlayerScore = scores[i][1];
      if(id == data){
        scores[i][1] = thisPlayerScore+1;
      }
      io.emit('updateScore', scores);
    }

    // if we have all the votes, do this.

    if(votes >= scores.length){
      io.emit('votesCast');
      votes = 0;

      for(i = 0; i < scores.length; i++){
        if(scores[i][1] >= 2){
          io.emit('gameOver', scores[i]);
        } else {
          rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
          getDrawings(rPrompt);
        }
      }
    }
  })

  socket.on('getImage', function(){
    rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
    getDrawings(rPrompt);
  })

});

function getDrawings(rPrompt){
  // only getting 2 images

  var img1 = Math.floor((Math.random() * submittedDrawings));
  var img2 = Math.floor((Math.random() * submittedDrawings));


  // make sure we get 2 different images;

  while (img1 == img2){
    img2 = Math.floor((Math.random() * submittedDrawings));
  }

    var images = [img1, img2];

    // do this when we have our two images
    //io.emit('imagesSelected', img1, img2);
    io.emit('sendImageJson', drawingData, images, rPrompt);

}

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});