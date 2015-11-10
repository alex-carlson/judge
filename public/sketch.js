var myImage;
var activeColor = 'black';
var radius = 15;
var myCanvas;

function setup(){
    myCanvas = createCanvas(350, 350);
    myCanvas.parent('draw');
    colorMode(HSB);
    strokeWeight(radius);
    noFill();
}

function mouseDragged(){
    x = mouseX;
    y = mouseY;
    drawCircle(x, y, activeColor);
}

function drawCircle( x, y, color ) {
    //ellipse(x, y);
    strokeWeight(radius);
    line(pmouseX, pmouseY, x, y);
} 

$('.colors span').click(function(){
    $('.colors span').removeClass('active');
    activeColor = $(this).attr('data-color');
    $(this).addClass('active');
});

$('#brushSize').change(function(){
    radius = $(this).val();
})

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
})