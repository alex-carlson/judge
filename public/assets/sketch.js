var myImage;
var activeColor = 'black';
var radius = 15;
var myCanvas;

function setup(){
    myCanvas = createCanvas(windowWidth, windowWidth);
    myCanvas.parent('draw');
    colorMode(HSB);
    strokeWeight(radius);
    fill(255, 0, 255);
    noStroke();
    rect(0, 0, width, height);
    noFill();
}

function touchMoved(){
    x = touchX;
    y = touchY;
    strokeWeight(radius);
    stroke(activeColor);
    line(ptouchX, ptouchY, x, y);
    return false;
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
    var data = {user: uniqueID, drawing: d, score: 0};
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