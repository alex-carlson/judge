var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {'timeout': 5000});
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
  "Warmest",
  "Most Iconic",
  "Most Symbolic"
];
var rPrompt = 0;

app.use(bp.urlencoded({ extended:false }))
app.use(bp.json())
app.use(express.static('public'));

io.on('connection', function(socket){
  var timer = 0;
  socket.emit('playerID', socket.id, isPlaying, votingPrompts);
  allClients.push(socket);
  io.emit('drawingCount', submittedDrawings);
  var obj = [ socket.id, 0 ];
  io.emit('updateScore', drawingData);
  io.emit('players', allClients.length, isPlaying);

  // timeout function

  setInterval(function(){

    if(timer == 60 * 2){
      // remove this client from the game
      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);

      // decrement the submitted drawings if this player DID submit a drawing.

      var j = submittedDrawings.indexOf(socket.id);

      if(j != -1){
        submittedDrawings.splice(j, 1);
      }

      // shutting down the game if there's nobody left with a submitted drawing.

      if(submittedDrawings.length < 1){
        isPlaying = false;
        io.emit('players', allClients.length, isPlaying);
      }

      if (allClients.length < 2){
        io.emit('backtolobby');
        drawingData = [];
        submittedDrawings = [];
        io.emit('updateScore', drawingData);
        io.emit('drawingCount', submittedDrawings);
      }

      // sending out the updates to everyone still in.

      io.emit('players', allClients.length, isPlaying);
      io.emit('drawingCount', submittedDrawings);
      socket.emit('disconnect');
      socket.disconnect();
      timer++;
    } else if(timer < 60 * 2){
      timer++;
    }
  }, 1000);

  // do stuff on player disconnect
  
  socket.on('disconnect', function(){

    // remove this client from the game
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);

    // decrement the submitted drawings if this player DID submit a drawing.

    var j = submittedDrawings.indexOf(socket.id);

    if(j != -1){
      submittedDrawings.splice(j, 1);
    }

    // shutting down the game if there's nobody left with a submitted drawing.

    if(submittedDrawings.length < 1){
      isPlaying = false;
      io.emit('players', allClients.length, isPlaying);
    }

    if (allClients.length < 2){
      io.emit('backtolobby');
      drawingData = [];
      submittedDrawings = [];
      io.emit('updateScore', drawingData);
      io.emit('drawingCount', submittedDrawings);
    }

    // sending out the updates to everyone still in.

    io.emit('players', allClients.length, isPlaying);
    io.emit('drawingCount', submittedDrawings);
  });

  socket.onevent = function (packet) {
    console.log('anything');
    votes = 0;
  };

  // when we get a vote

  socket.on('vote', function (data){
    votes++;
    for(i = 0; i < drawingData.length; i++){
      var id = drawingData[i].user;
      if(id == data){
        drawingData[i].points++;
      }
    }
    io.emit('updateScore', drawingData);

    // if we have all the votes, do this.

    if(votes == allClients.length){

      for(i = 0; i < drawingData.length; i++){

        // change this number to adjust the score ceiling

        if(drawingData[i].points >= (allClients.length * 3)){
          io.emit('gameOver', drawingData[i]);
          restart();
          return;
        } else {
          rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
          getDrawings(rPrompt);
        }
      }
    }
  })

  socket.on( 'sendPicture', function ( data ) {
    submittedDrawings.push(socket.id);
    drawingData.push(data);
    io.emit('drawingCount', submittedDrawings);
  })

  socket.on('getImage', function(){
    isPlaying = true;
    rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
    getDrawings(rPrompt);
  })

});

function restart(){
    drawingData = [];
    submittedDrawings = [];
    io.emit('updateScore', drawingData);
    io.emit('drawingCount', submittedDrawings);
    io.emit('players', allClients.length, isPlaying);
}

function getNumbers(){
  var arr = [];
  while(arr.length < 2){
    var randomnumber=Math.ceil(Math.random()*submittedDrawings.length-1)
    var found=false;
    for(var i=0;i<arr.length;i++){
    if(arr[i]==randomnumber){found=true;break}
    }
    if(!found)arr[arr.length]=randomnumber;
  }
  return(arr);
}

function getDrawings(rPrompt){
  // only getting 2 images


    var imgnums = getNumbers();

    // do this when we have our two images

    io.emit('sendImageJson', drawingData, imgnums, rPrompt);
    io.emit('players', allClients.length, isPlaying);
}

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on localhost:3000');
});