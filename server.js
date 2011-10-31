var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(8080);

serve('/', '/index.html');
serve('/client.js');
serve('/jquery.js');

io.set('log level', 1);
io.sockets.on('connection', function(socket) {

		// Attribue une teinte au nouvel utilisateur.
		var hue = hues[socket.id] = randomHue();

		// Envoie la teinte à l'utilisateur.
		socket.emit('connected', {
				myHue: hue,
				otherHues: hues
		});

		// Transmet les infos du nouvel utilisateur aux autres.
		socket.broadcast.emit('user joins', {
				id: socket.id,
				hue: hue
		});

		socket.on('disconnect', function(data) {

			 socket.broadcast.emit('user leaves', {
				  id: socket.id
			 });
		});

		socket.on('user draws', function(data) {

				socket.broadcast.emit('user draws', {
						id: socket.id,
						path: data.path
				});
		});
});

var hues = {};

function randomHue() {

		return Math.floor(Math.random() * 360);
}

function serve(path, file) {
	app.get(path, function(req, res) {
		res.sendfile(__dirname + (file || path));
	});
}
