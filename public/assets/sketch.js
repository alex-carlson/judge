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

function mouseDragged(){
    strokeWeight(radius);
    stroke(activeColor);
    line(pmouseX, pmouseY, mouseX, mouseY);
}