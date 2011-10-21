var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(8080);

app.get('/', function(req, res) {
	 res.sendfile(__dirname + '/index.html');
});
app.get('/canvas.js', function(req, res) {
	 res.sendfile(__dirname + '/canvas.js');
});
app.get('/jquery.js', function(req, res) {
	 res.sendfile(__dirname + '/jquery.js');
});

io.sockets.on('connection', function(socket) {

	 socket.on('user joins', function(data) {
		  
	 });

	 socket.on('user leaves', function(data) {
		  
	 });

	 socket.on('user draws', function(data) {

		  socket.broadcast.emit('user draws', data);
	 });
});
