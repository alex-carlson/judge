
function getImage(data){
  var d = data[0];

  for(i = 0; i < d.length; i++){
    var x = d[i].drawing.x;
    var y = d[i].drawing.y;
    var radius = d[i].drawing.radius;
    var color = d[i].drawing.color;
    drawCircle( x, y, radius, color );
  }
}

function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = color;
    view.draw();
} 

// do this when we get image data from the server

socket.on('sendImageJson', function(data){
  //console.log(data);
  $('section .ready').fadeOut(500);
  $('section .votingSection').fadeIn(500);
  getImage(data);
})