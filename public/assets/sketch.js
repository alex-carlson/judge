var myImage;
var activeColor = 'black';
var radius = 15;
var myCanvas;
var s;

function setup(){
    myCanvas = createCanvas($('#draw').width(), $('#draw').width());
    myCanvas.parent('draw');
    s = myCanvas.parent('draw').size();
    resizeCanvas($('#draw').width(), $('#draw').width());
    resizeCanvas(s.width, s.height);
    colorMode(HSB);
    strokeWeight(radius);
    fill(255, 0, 255);
    noStroke();
    rect(0, 0, width, height);
    noFill();
}

function touchStart(){
    resizeCanvas($('#draw').width(), $('#draw').width());
}

function touchMoved(){
    strokeWeight(radius);
    stroke(activeColor);
    line(ptouchX, ptouchY, touchX, touchY);
}

// on submit drawing

$('#submit').click(function(){
  myCanvas.loadPixels();
  var c = myCanvas.canvas;
  var d = c.toDataURL();
  var data = {user: uniqueID, points: 0, drawing: d};
  socket.emit('sendPicture', data);
  $('.myImage img').attr('src', data.drawing);

  $('.draw').fadeOut(500);
  $('.wait').fadeIn(500);
  $('.myImage').fadeIn(500);

  fill(255, 0, 255);
  noStroke();
  rect(0, 0, width, height);
  noFill();
})