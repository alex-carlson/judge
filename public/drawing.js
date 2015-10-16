var myPicture = [];

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
 
function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = new RgbColor( 0, 0, 0, 1 );
    //view.draw();
} 
 
function emitCircle( x, y, radius, color ) {
  
    var data = {
        x: x,
        y: y,
        radius: radius,
        color: color
    };

    myPicture.push(data);

}

$('#submit').click(function(){
  socket.emit('sendPicture', myPicture);
  $('.draw').fadeOut(500);
  $('.wait').fadeIn(500);
  //console.log(myPicture);
})
