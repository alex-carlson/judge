var myPicture = [];
var rightCanvasPlayer, leftCanvasPlayer, myImage;
var myPng;

tool.maxDistance = 2;
tool.minDistance = 1;

function onMouseDrag(event) {
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;
    var radius = $('#brushSize').val()*1;
    var color = $("#colorpicker").spectrum('get').toHexString();
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
  }
  $('section .votingSection').fadeIn(500);
}
 
function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = color;
    myImage = new Group();
    //view.draw();

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

socket.on('sendImageJson', function(data, images, prompt){
    $('.wait').fadeOut(500);
    $('section.vote').fadeIn(500, function(){
        $('#drawingPrompt').html(prompt);
    });
    $('section .ready').fadeOut(500);
    getImage(data, images);
})