var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bp = require('body-parser');

var submittedDrawings = 0;
var drawingData = [];
var playerIPs = [];
var allClients = [];
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
  allClients.push(socket);
  //io.emit('players', playerCount, playerIPs);
  io.emit('drawingCount', submittedDrawings);

  socket.on('uniqueID', function(data){
    var obj = [ data, 0 ];
    playerIPs.push(obj);
    io.emit('updateScore', playerIPs);
    io.emit('players', allClients.length, playerIPs);
  })
  
  socket.on('disconnect', function(){
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
    io.emit('players', allClients.length);
    io.emit('drawingCount', submittedDrawings);
  });

  socket.on( 'sendPicture', function ( data ) {
    submittedDrawings++;
    drawingData.push(data);
    io.emit('drawingCount', submittedDrawings);
  })

  //when we recieve a new image

  socket.on( 'sendPickedImages', function(){
    var rPrompt = Math.floor(Math.random() * votingPrompts.length);
    io.emit('sendImageJson', drawingData, votingPrompts[rPrompt]);
  })

  // when we get a vote

  socket.on('vote', function (data){
    votes++;
    for(i = 0; i < playerIPs.length; i++){
      var id = playerIPs[i][0];
      var thisPlayerScore = playerIPs[i][1];
      if(id == data){
        playerIPs[i][1] = thisPlayerScore+1;
      }
      io.emit('updateScore', playerIPs);
    }

    // if we have all the votes, do this.

    if(votes >= playerIPs.length){
      io.emit('votesCast');
      votes = 0;
      var rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
      getDrawings(rPrompt);
    }
  })

  socket.on('getImage', function(){
    var rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
    getDrawings(rPrompt);
  })

});

function getDrawings(rPrompt){
  // only getting 2 images

  var img1 = Math.floor((Math.random() * submittedDrawings));
  var img2 = Math.floor((Math.random() * submittedDrawings));

  if(img1 == img2){
    getDrawings();
  } else {

    var images = [img1, img2];

    // do this when we have our two images
    //io.emit('imagesSelected', img1, img2);
    io.emit('sendImageJson', drawingData, images, rPrompt);

  }
}

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});