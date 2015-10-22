var myPicture = [];
var rightCanvasPlayer, leftCanvasPlayer;

tool.maxDistance = 5;
tool.minDistance = 5;

function onMouseDrag(event) {
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;
    var radius = event.delta.length;
    var color = 'black';
    drawCircle( x, y, radius, color );
    emitCircle( x, y, radius, color );
} 

function getImage(data){
  for(j = 0; j < data.length; j++){
    paper = new paper.PaperScope();
    paper.setup($("canvas")[j+1]);
    $('.votingSection canvas:eq('+j+')').attr('data-player', data[j][0].user);
    var d = data[j];

    for(i = 0; i < d.length; i++){
        var x = d[i].drawing.x;
        var y = d[i].drawing.y;
        var radius = d[i].drawing.radius;
        var color = d[i].drawing.color;
        drawCircle( x, y, radius, color );
    }
  }
}
 
function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = color;
    //view.draw();
} 
 
function emitCircle( x, y, radius, color ) {
  
    var data = {
        "user": uniqueID,
        "drawing": { x: x, y: y, radius: radius, color: color }
    }

    myPicture.push(data);
}

// on submit drawing

$('#submit').click(function(){
    socket.emit('sendPicture', myPicture);
    $('.draw').fadeOut(500);
    $('.wait').fadeIn(500);
})

socket.on('sendImageJson', function(data, prompt){
  $('section .ready').fadeOut(500);
  $('#drawingPrompt').html(prompt);
  $('section .votingSection').fadeIn(500);
  getImage(data);
})