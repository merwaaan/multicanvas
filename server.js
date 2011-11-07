var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(8080);

serve('/', '/index.html');
serve('/client.js');
serve('/jquery.js');

// Réduction du niveau de log pour ne pas polluer la console.
io.set('log level', 1);

/**
 * Connexion d'un nouveau client.
 *
 * - On lui attribue une teinte choisie aléatoirement.
 * - On lui communique sa teinte.
 * - On broadcast sa teinte et son identifiant aux autres clients.
 * - On spécifie les callbacks des deux événements restants:
 *     - L'utilisateur dessine.
 *     - L'utilisateur se déconnecte.
 */
io.sockets.on('connection', function(socket) {

	// Attribution d'une teinte aléatoire.
	// ???

	// Transmission de la teinte du client et de celles des autres.
	socket.emit('connected', {
		// ???,
		// ???
	});

	// Broadcast des infos du nouveau client aux autres.
	socket.broadcast.emit('user joins', {
		// ???,
		// ???
	});

	socket.on('user draws', function(data) {

		// Broadcast du segment passé à tous les autres clients.
		socket.broadcast.emit('user draws', {
			// ???,
			// ???,
			// ???
		});
	});

	socket.on('disconnect', function(data) {

		// Broadcast l'identifiant du client aux autres.
		socket.broadcast.emit('user leaves', {
			// ???
		});
	});
});

/**
 * Map des teintes de tous les clients connectés, sous la
 * forme 'id: teinte'.
 *
 * Exemple:
 * {
 *   453452332: 124,
 *   576578474: 90,
 *   239827329: 307
 * }
 */
var hues = {};

/**
 * Retourne une teinte choisie aléatoirement (0 <= h < 360).
 */
function randomHue() {

	return Math.floor(Math.random() * 360);
}

function serve(path, file) {
	app.get(path, function(req, res) {
		res.sendfile(__dirname + (file || path));
	});
}
