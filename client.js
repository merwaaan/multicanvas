// Le socket qui permettra de communiquer avec le serveur.
var socket = null;

// Dernière position visitée par le curseur, contient deux attributs x
// et y. Exemple: {x: 120, y: 23}
var lastPoint = null;

// Le canvas HTML et son contexte 2D.
var canvas = null;
var ctxt = null;

// Teinte du client local.
var myHue = null;

// Teintes des clients distants, sous la forme 'id: teinte'.
var otherHues = {};

function init() {

	canvas = $('canvas');
	ctxt = canvas[0].getContext('2d');

	// Le canvas remplit entièrement la fenêtre.
	$(window).resize(function() {
		canvas.attr('width', window.innerWidth);
		canvas.attr('height', window.innerHeight);

		setupContext();
	}).resize();

	// Attribution des callbacks événementiels.
	canvas.bind('mousedown', startDrawing);
	canvas.bind('mouseup', stopDrawing);

	// Initialisation du socket.
	socket = io.connect();

	/**
	 * Connexion au serveur.
	 *
	 * - Récupération de notre teinte.
	 * - Récupération des teintes des autres clients déjà connectés.
	 */
	socket.on('connected', function(data) {

		// ???
	});

	/**
	 * Arrivée d'un nouvel utilisateur.
	 *
	 * - Récupération de sa teinte.
	 */
	socket.on('user joins', function(data) {

		// ???
	});

	/**
	 * Départ d'un utilisateur.
	 *
	 * - Suppression locale de sa teinte.
	 */
	socket.on('user leaves', function(data) {

		// ???
	});

	/**
	 * Un utilisateur dessine un segment.
	 *
	 * - Dessiner le segment sur le canvas local.
	 */
	socket.on('user draws', function(data) {

		// ???
	});
}

function startDrawing(event) {

	canvas.bind('mousemove', doDrawing);

	// Enregistre la position de la souris.
	lastPoint = {x: event.pageX, y: event.pageY};
}

function stopDrawing(event) {

	canvas.unbind('mousemove');
}

function doDrawing(event) {

	// Enregistre la position actuelle de la souris.
	// ???

	// Dessine le segment entre la position actuelle et la précédente.
	// ???

	// Envoie les coordonnées du nouveau segment aux autres clients.
	socket.emit('user draws', {
		// ???
	});
}

/**
 * Dessine un segment reliant la position 'p1' à la position 'p2'
 * de teinte 'hue'.
 *
 * - p1: point de départ (objet contenant les attributs x et y),
 * - p2: point d'arrivée (idem),
 * - hue: teinte du segment.
 */
function drawSegment(p1, p2, hue) {

	// Change la couleur de tracé du canvas.
	// ???

	// trace un segment entre les deux positions.
	// ???
}

/**
 * Paramétrage du contexte 2D du canvas.
 *
 * - Épaisseur du tracé à 10,
 * - Extrémités de lignes rondes,
 *
 * (Cherchez les nom des attributs sur http://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
 */
function setupContext() {

	// ctxt.??? = ???;
	// ctxt.??? = ???;
}

$(function() {

	init();
});
