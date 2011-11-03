// Le socket qui permettra de communiquer avec le serveur.
var socket = null;

// Dernière position visitée par le curseur.
var lastPoint = null;

// Le canvas HTML et son contexte 2D.
var canvas = null;
var ctxt = null;

// Teinte locale.
var myHue = null;

// Teintes de tous les autres clients.
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

	// Attribution des callbacks évenementiels.
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

		myHue = data.myHue;
		otherHues = data.otherHues;
		console.log('Connected with hue ' + myHue);
	});

	/**
	 * Arrivée d'un nouvel utilisateur.
	 *
	 * - Récupération de sa teinte.
	 */
	socket.on('user joins', function(data) {

		otherHues[data.id] = data.hue;
		console.log('User ' + data.id + ' joined with hue ' + data.hue);
	});

	/**
	 * Départ d'un utilisateur.
	 *
	 * - Suppression locale de sa teinte.
	 */
	socket.on('user leaves', function(data) {

		delete otherHues[data.id];
		console.log('User ' + data.id + ' leaved');
	});

	/**
	 * Un utilisateur dessine un segment.
	 *
	 * - Dessiner le segment sur le canvas local.
	 */
	socket.on('user draws', function(data) {
		console.log(data);
		drawSegment(data.p1, data.p2, otherHues[data.id]);
	});
}

function startDrawing(event) {

	canvas.bind('mousemove', doDrawing);

	lastPoint = {x: event.pageX, y: event.pageY};
}

function stopDrawing(event) {

	canvas.unbind('mousemove');
}

function doDrawing(event) {

	// Enregistre la position actuelle de la souris.
	var currentPoint = {x: event.pageX, y: event.pageY};

	// Dessine le segment entre la position actuelle et la précedente.
	drawSegment(lastPoint, currentPoint, myHue);

	// Envoie les coordonnées aux autres clients.
	socket.emit('user draws', {
		p1: lastPoint,
		p2: currentPoint
	});

	lastPoint = currentPoint;
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
	ctxt.strokeStyle = 'hsl(' + hue + ',60%,50%)';

	// trace un segment entre les deux positions.
	ctxt.beginPath();
	ctxt.moveTo(p1.x, p1.y);
	ctxt.lineTo(p2.x, p2.y);
	ctxt.stroke();
}

/**
 * Paramétrage du contexte 2D du canvas.
 *
 * - Epaisseur du tracé à 10,
 * - Extrémités de lignes rondes,
 * - Liaisons entre segments rondes.
 *
 * (Cherchez les nom des attributs sur http://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
 */
function setupContext() {

	ctxt.lineWidth = 10;
	ctxt.lineJoin = 'round';
	ctxt.lineCap = 'round';
}

$(function() {

	init();
});
