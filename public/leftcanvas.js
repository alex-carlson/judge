function getImage(img1, img2){
  var x = img1.drawing.x;
  var y = img1.drawing.y;
  var radius = img1.drawing.radius;
  var color = img1.drawing.color;
  drawCircle( x, y, radius, color );
}