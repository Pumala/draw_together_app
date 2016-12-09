const express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    io          = require('socket.io')(http);

app.use(express.static('public'));


io.on('connection', function(socket) {
  socket.emit('welcome', 'Welcome to the Drawing Together App!');

  socket.on('drawing', function(coords) {
    console.log('how do you draw?');
    console.log('coords:', coords);
    socket.broadcast.emit('broadcast', coords);
  })

});

http.listen(3000, function() {
  console.log('The server is listening on Port 3000.');
});
