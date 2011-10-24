var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(8080);

app.get('/', function(req, res) {
		res.sendfile(__dirname + '/index.html');
});
app.get('/client.js', function(req, res) {
		res.sendfile(__dirname + '/client.js');
});
app.get('/jquery.js', function(req, res) {
		res.sendfile(__dirname + '/jquery.js');
});

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

		socket.on('user leaves', function(data) {

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
