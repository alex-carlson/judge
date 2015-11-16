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

function getImage(data, imgs){
  for(j = 0; j < imgs.length; j++){

    var thisIMG = $('.votingSection img:eq('+j+')');    
    $('.votingSection img:eq('+j+')').removeClass('disabled');

    var d = data[imgs[j]];

    thisIMG.attr('src', d.drawing);
    thisIMG.attr('data-player', d.user);

    
  }
  $('section .votingSection').fadeIn(500);
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