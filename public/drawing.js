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

    var thisIMG = $('.votingSection img:eq('+j+')');    
    $('.votingSection img:eq('+j+')').removeClass('disabled');

    var d = data[j];

    thisIMG.attr('src', d.drawing);
    thisIMG.attr('data-player', d.user);

    
  }
  $('section .votingSection').fadeIn(500);
}
 
function drawCircle( x, y, radius, color ) {
    var circle = new Path.Circle( new Point( x, y ), radius );
    circle.fillColor = color;

} 

function clearCanvas(){

    myPicture = [];
    project.activeLayer.removeChildren();

    // this is the code to force - update the canvas.  :)
    paper.view.update();
}

// on submit drawing

$('#submit').click(function(){
    var p = project.activeLayer.rasterize();
    var d = p.toDataURL();
    var data = {user: uniqueID, drawing: d};
    socket.emit('sendPicture', data);
    $('.myImage img').attr('src', data.drawing);

    $('.draw').fadeOut(500);
    $('.wait').fadeIn(500);
    $('.myImage').fadeIn(500);
    paper.view.update();
})

socket.on('sendImageJson', function(data, images, prompt, ips){
    $('.wait').fadeOut(500);
    $('section.vote').fadeIn(500, function(){
        $('#drawingPrompt').html(prompt);
    });
    $('section .ready').fadeOut(500);
    $('#playerList').html('');
    for(i = 0; i < ips.length; i++){
      $('#playerList').append('<li><img src='+data[i].drawing+'> - <span>'+ips[i][1]+'</span></li>');
    }
    getImage(data, ips);
})

socket.on('gameOver', function(){
    clearCanvas();
})