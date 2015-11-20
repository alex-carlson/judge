var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {'timeout': 5000});
var bp = require('body-parser');

var submittedDrawings = [];
var drawingData = [];
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
  "Most Realistic",
  "Most Planar",
  "Most Grand",
  "Smallest",
  "Coldest",
  "Warmest",
  "Most Iconic",
  "Most Symbolic",
  "Most White Space",
  "Most Complex",
  "Most Natural",
  "Most Machine-like"
];
var rPrompt = 0;

app.use(bp.urlencoded({ extended:false }))
app.use(bp.json())
app.use(express.static('public'));

io.on('connection', function(socket){
  var timer = 0;
  socket.emit('playerID', socket.id, votingPrompts);
  allClients.push(socket);
  var obj = [ socket.id, 0 ];
  io.emit('updateScore', drawingData);
  io.emit('players', allClients.length);

  // timeout function

  setInterval(function(){

    if(timer == 60 * 5){
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
        io.emit('players', allClients.length);
      }

      if (allClients.length < 2){
        io.emit('backtolobby');
        drawingData = [];
        submittedDrawings = [];
        io.emit('updateScore', drawingData);
        io.emit('drawingCount', submittedDrawings);
      }

      // sending out the updates to everyone still in.

      io.emit('players', allClients.length);
      io.emit('drawingCount', submittedDrawings);
      socket.emit('disconnect');
      socket.disconnect();
      timer++;
    } else if(timer < 60 * 5){
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

    // sending out the updates to everyone still in.

    io.emit('players', allClients.length);
    io.emit('drawingCount', submittedDrawings);
  });

  // listen for all events

  socket.on( '*', function onWildcard ( event ) {
    timer = 0;
  })

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

    if(votes == drawingData.length){

      for(i = 0; i < drawingData.length; i++){

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
    rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
    getDrawings(rPrompt);
  })

  socket.on('getImage', function(){
    isPlaying = true;
    rPrompt = votingPrompts[Math.floor(Math.random() * votingPrompts.length)];
    getDrawings(rPrompt);
  })

});

function getDrawings(rPrompt){
    
  // only getting 2 images

  var imgnums = getNumbers();

  // do this when we have our two images

  io.emit('players', allClients.length);
  io.emit('sendImageJson', drawingData, imgnums, rPrompt);
}

function restart(){
  drawingData = [];
  submittedDrawings = [];
  io.emit('updateScore', drawingData);
  io.emit('drawingCount', submittedDrawings);
  io.emit('players', allClients.length);
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

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on localhost:3000');
});