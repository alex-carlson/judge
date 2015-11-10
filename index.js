var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var submittedDrawings = [];
var drawingData = [];
var allClients = [];
var votes = 0;
var isPlaying = false;
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
  "Most Realistic",
  "Most Planar",
  "Most Grand",
  "Smallest",
  "Coldest",
  "Warmest"
];
var rPrompt = 0;

app.use(bp.urlencoded({ extended:false })) //some garbage to enable parsing of the body
app.use(bp.json()) // enable parsing of JSON files
app.use(express.static('public')); //use express in static mode to look into the 'public' folder for files (.html, .jpg, .css, etc.)

io.on('connection', function(socket){
  socket.emit('playerID', socket.id, isPlaying);
  allClients.push(socket);
  io.emit('drawingCount', submittedDrawings);
  var obj = [ socket.id, 0 ];
  io.emit('updateScore', drawingData);
  io.emit('players', allClients.length, isPlaying);

  // do stuff on player disconnect
  
  socket.on('disconnect', function(){

    console.log('drawings before removal: '+submittedDrawings.length);

    // remove this client from the game
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);

    // decrement the submitted drawings if this player DID submit a drawing.

    var j = submittedDrawings.indexOf(socket.id);

    if(j != -1){
      submittedDrawings.splice(j, 1);
      console.log('drawings after removal: '+submittedDrawings.length);
    }

    // shutting down the game if there's nobody left with a submitted drawing.

    if(submittedDrawings.length == 0){
      isPlaying = false;
    }

    if (allClients.length < 2){
      io.emit('backtolobby');
      isPlaying = false;
    }

    // sending out the updates to everyone still in.

    io.emit('players', allClients.length, isPlaying);
    io.emit('drawingCount', submittedDrawings);
    io.emit('updateScore', drawingData);
  });

  socket.on( 'sendPicture', function ( data ) {
    submittedDrawings.push(socket.id);
    drawingData.push(data);
    io.emit('drawingCount', submittedDrawings);
  })

  // when we get a vote

  socket.on('vote', function (data){
    votes++;
    for(i = 0; i < drawingData.length; i++){
      var id = drawingData[i].user;
      if(id == data){
        drawingData[i].score++;
        io.emit('updateScore', drawingData);
      }
    }

    // if we have all the votes, do this.

    if(votes >= drawingData.length){
      io.emit('votesCast');
      votes = 0;

      for(i = 0; i < drawingData.length; i++){

        // change this number to adjust the score ceiling

        if(drawingData[i].score >= 2){
          io.emit('gameOver', drawingData[i]);
        } else {
          rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
          getDrawings(rPrompt);
        }
      }
    }
  })

  socket.on('playerQuit', function(){
    var j = submittedDrawings.indexOf(socket.id);

    if(j != -1){
      submittedDrawings.splice(j, 1);
    }

    io.emit('drawingCount', submittedDrawings);
  })

  socket.on('getImage', function(){
    isPlaying = true;
    rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
    getDrawings(rPrompt);
  })

  socket.on('restart', function(){
    isPlaying = false;
    submittedDrawings = [];
    io.emit('drawingCount', submittedDrawings);
    drawingData = [];
    for(i = 0; i < drawingData.length; i++){
      drawingData[i][2] = 0;
    }
    io.emit('updateScore', drawingData);
  })

});

function getDrawings(rPrompt){
  // only getting 2 images

  var img1 = Math.floor((Math.random() * submittedDrawings.length));
  var img2 = Math.floor((Math.random() * submittedDrawings.length));


  // make sure we get 2 different images;

  while (img1 == img2){
    img2 = Math.floor((Math.random() * submittedDrawings.length));
  }

    var images = [img1, img2];

    // do this when we have our two images
    //io.emit('imagesSelected', img1, img2);
    io.emit('sendImageJson', drawingData, images, rPrompt);

}

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});