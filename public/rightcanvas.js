var myPicture = [];

function getImage(data){
  var d = data.uniqueID;
  console.log(d);
  var x = d.drawing.x;
  var y = d.drawing.y;
  var radius = d.drawing.radius;
  var color = d.drawing.color;
  myPicture.push(d.drawing);
  drawCircle( x, y, radius, color );
}

function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = new RgbColor( 0, 0, 0, 1 );
    //view.draw();
} 