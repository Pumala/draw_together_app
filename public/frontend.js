var canvas = document.getElementById('canvas');
var message = document.getElementById('message');
var colorPicker = document.getElementById('colorPicker');
var penThickness = document.getElementById('penThickness');
var eraser = document.getElementById('eraser');
var ctx = canvas.getContext('2d');

var socket = io();
var lastMousePosition = null;
var draw = '';
var color = null;
var width = null;
var is_erased = null;

colorPicker.addEventListener('change', function(event) {
  color = this.value;
  is_erased = false;
});

penThickness.addEventListener('change', function(event) {
  width = this.value;
})

eraser.addEventListener('click', function(event) {
  console.log(canvas.getAttribute('background-color'));
  color = canvas.getAttribute('background-color');
  is_erased = true;
  console.log('INSIDE eraser:', is_erased);
});

canvas.addEventListener('mousedown', function(event) {
  console.log('hello from mousedown');
  draw = true;
});

canvas.addEventListener('mouseup', function(e) {
  draw = false;
  lastMousePosition = null;
});

// mousemove event handler
canvas.addEventListener('mousemove', function(event) {
  console.log('grab global color: ', color);
  console.log('do you want to erase?', is_erased);
  if (is_erased) {
    color = canvas.getAttribute('background-color');
  } else {
    color = colorPicker.value;
  }
  // color = colorPicker.value;
  width = penThickness.value;
  if (draw) {
    // console.log('draw: offset x:: ', this.offsetLeft);
    console.log('offsets', canvas.offsetLeft, canvas.offsetTop);
    console.log('pos', event.clientX, event.clientY);
    var offsetx = canvas.offsetLeft;
    var offsety = canvas.offsetTop;
    var xPos = event.clientX - offsetx;
    var yPos = event.clientY - offsety;
    var mousePosition = {
      x: xPos,
      y: yPos
    };

    if (lastMousePosition) {
      ctx.strokeStyle = color;
      ctx.lineJoin = 'round';
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
      ctx.lineTo(xPos, yPos);
      ctx.closePath();
      ctx.stroke();
      socket.emit('drawing', {mousePosition, lastMousePosition, color: color, width: width } );
    }
    lastMousePosition = mousePosition;
  }
  // is_erased = false;
});

socket.on('welcome', function(greeting) {
  console.log('there is something here in welcome');
  message.innerHTML = greeting;
});

socket.on('broadcast', function(values) {
  var startPosition = values.lastMousePosition;
  var endPosition = values.mousePosition;
  ctx.strokeStyle = values.color;
  ctx.lineJoin = 'round';
  ctx.lineWidth = values.width;
  ctx.beginPath();
  ctx.moveTo(startPosition.x, startPosition.y);
  ctx.lineTo(endPosition.x, endPosition.y);
  ctx.closePath();
  ctx.stroke();

})

canvas.addEventListener('mouseup', function(event) {
  draw = false;
});
