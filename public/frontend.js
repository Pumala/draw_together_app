var canvas = document.getElementById('canvas');
var message = document.getElementById('message');
var colorPicker = document.getElementById('colorPicker');
var penThickness = document.getElementById('penThickness');
var backgroundColor = document.getElementById('backgroundColor');
var backgroundColorPicker = document.getElementById('backgroundColorPicker');
var eraser = document.getElementById('eraser');
var ctx = canvas.getContext('2d');

var socket = io();
var lastMousePosition = null;
var draw = '';
var color = null;
var width = null;
var is_erased = null;
var changeBackground = null;

// listen for when the user changes the color of the background color
backgroundColorPicker.addEventListener('change', function(event) {
  // update the canvas background to the value that the user chose
  canvas.style.backgroundColor = backgroundColorPicker.value;
});

// listen for when the user changes the color of the pen
colorPicker.addEventListener('change', function(event) {
  // assign the color picker value to global color variable
  color = this.value;
  is_erased = false;
});

// listen for when the user changes the pen thickness size
penThickness.addEventListener('change', function(event) {
  // assign the pen thickness value to the global width variable
  width = this.value;
})

// listen for when the user clicks on the eraser button
eraser.addEventListener('click', function(event) {
  // then, assign the canvas background to the global color variable
  color = canvas.getAttribute('background-color');
  // update the global variable is_erased to true
  is_erased = true;
});

// the canvas listens for when the user clicks and holds that click when on the canvas
canvas.addEventListener('mousedown', function(event) {
  // then assign true to the global variable draw because the user is drawing
  draw = true;
});

// the canvas listens for when the user stops holding onto the mouse click (releases the click)
canvas.addEventListener('mouseup', function(e) {
  // assign false to the global variable draw because the user is no longer drawing
  draw = false;
  // set the global variable lastMousePosition to null to reset it the next time the user begins drawing
  lastMousePosition = null;
});

// the canvas listens for when the mouse moves on it
canvas.addEventListener('mousemove', function(event) {
  // check if the user is drawing
  // this becomes true when the user holds the mouse down on the canvas
  if (draw) {
    // then check if is_erased is true
    // this values became true when the user clicked on the erase button
    if (is_erased) {
      // if so, then assign the background color to the global variable color
      // that means that the next time the user draws, the eraser will be
      // the same color as the background color
      color = backgroundColorPicker.value;
    }
    else {
      // else, assign the current color picker value to the global color variable
      color = colorPicker.value;
    }
    // assign pen thickness value to the global width variable
    width = penThickness.value;

    // grab the offset values
    var offsetx = canvas.offsetLeft;
    var offsety = canvas.offsetTop;

    // grab the coordinates of the mouse
    var xPos = event.clientX - offsetx;
    var yPos = event.clientY - offsety;

    // make an object with those coordinates
    var mousePosition = {
      x: xPos,
      y: yPos
    };

    // check if global variable lastMousePosition exists
    if (lastMousePosition) {

      // if it exists, then we begin drawing on the canvas
      ctx.strokeStyle = color;
      ctx.lineJoin = 'round';
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
      ctx.lineTo(xPos, yPos);
      ctx.closePath();
      ctx.stroke();

      // emit a drawing event to other users
      // pass an object of values containing mousePosition, lastMousePosition, color, and width
      socket.emit('drawing', {mousePosition, lastMousePosition, color: color, width: width } );
    }
    // assign the last mouse position to the global variable lastMousePosition
    lastMousePosition = mousePosition;
  }
});

// captures the welcome event
socket.on('welcome', function(greeting) {
  // send a greeting to the user
  message.innerHTML = greeting;
});

// captures the broadcast event
socket.on('broadcast', function(values) {
  // draw on other user's canvases
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
