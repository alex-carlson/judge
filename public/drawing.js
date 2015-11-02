var myPicture = [];
var rightCanvasPlayer, leftCanvasPlayer, myImage;
var myPng;
var activeColor = "black";

tool.maxDistance = 2;
tool.minDistance = 1;

$('.colors span').click(function(){
    $('.colors span').removeClass('active');
    activeColor = $(this).attr('data-color');
    $(this).addClass('active');
});

$('#brushSize').click(function(){
    var size = $(this).val();
    $('#strokeSize').css('height', size);
    $('#strokeSize').css('width', size);
})

function onMouseDrag(event) {
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;
    var radius = $('#brushSize').val()*1;
    var color = activeColor;
    drawCircle( x, y, radius, color );
} 

function getImage(data, imgs){
  for(j = 0; j < imgs.length; j++){

    if (myImage != null){
        myImage.removeChildren();
    }
    paper = new paper.PaperScope();
    paper.setup($("canvas")[j+1]);
    
    $('.votingSection canvas:eq('+j+')').attr('data-player', data[imgs[j]][0].user);
    $('.votingSection canvas:eq('+j+')').removeClass('disabled');

    var d = data[imgs[j]];

    for(i = 0; i < d.length; i++){
        var x = d[i].drawing.x;
        var y = d[i].drawing.y;
        var radius = d[i].drawing.radius;
        var color = d[i].drawing.color;
        drawCircle( x, y, radius, color );
    }
    paper.view.update();
  }
  $('section .votingSection').fadeIn(500);
}
 
function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = color;
    myImage = new Group();

    var data = {
        "user": uniqueID,
        "drawing": { x: x, y: y, radius: radius, color: color }
    }

    myPicture.push(data);
} 

function clearCanvas(){

    myPicture = [];
    project.activeLayer.removeChildren();
    paper.view.update();
}

// on submit drawing

$('#submit').click(function(){
    socket.emit('sendPicture', myPicture);
    $('.draw').fadeOut(500);
    $('.wait').fadeIn(500);
    paper.view.update();
})

socket.on('sendImageJson', function(data, images, prompt){
    $('.wait').fadeOut(500);
    $('section.vote').fadeIn(500, function(){
        $('#drawingPrompt').html(prompt);
    });
    $('section .ready').fadeOut(500);
    getImage(data, images);
})

socket.on('gameOver', function(){
    clearCanvas();
})