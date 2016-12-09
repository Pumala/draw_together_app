const express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    io          = require('socket.io')(http);

app.use(express.static('public'));


// once a user is connected
io.on('connection', function(socket) {
  // emit the welcome event, passing in a greeting that you want to send out to all users who are connected
  socket.emit('welcome', 'Welcome to the Drawing Together App!');

  // captures the drawing event and receives the coords
  socket.on('drawing', function(coords) {
    // once recieved, sends a the coords to all users except self
    socket.broadcast.emit('broadcast', coords);
  })

});

http.listen(3000, function() {
  console.log('The server is listening on Port 3000.');
});
