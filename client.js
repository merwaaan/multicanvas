var socket = null;

// Booléen valant vrai quand un tracé est en cours.
var drawing = false;

// Dernière position visitée par le curseur.
var lastPoint = null;

var canvas = null;
var ctxt = null;

// Teinte locale.
var myHue = null;

// Teintes de tous les autres clients.
var otherHues = {};

function init() {

	 socket = io.connect('http://localhost');

	 socket.on('connected', function(data) {

		  myHue = data.myHue;
		  otherHues = data.otherHues;

		  console.log('Connected with hue ' + myHue);
	 });

	 socket.on('user joins', function(data) {

		  var userId = data.id;
		  var userHue = data.hue;

		  otherHues[userId] = userHue;

		  console.log('User ' + userId + ' joined with hue ' + userHue);
	 });

	 socket.on('user leaves', function(data) {

		  var userId = data.id;

		  delete otherHues[userId];

		  console.log('User ' + userId + ' leaved');
	 });

	 socket.on('user draws', function(data) {

		  var userId = data.id;

		  draw(data.path, otherHues[userId]);
	 });

	 canvas = $('canvas');

	 $(window).resize(function() {
		  canvas.attr('width', window.innerWidth);
		  canvas.attr('height', window.innerHeight);
	 }).resize();

	 canvas.bind('mousedown', startDrawing);
	 canvas.bind('mouseup', stopDrawing);
	 canvas.bind('mousemove', doDrawing);

	 ctxt = canvas[0].getContext('2d');
	 ctxt.lineWidth = 10;
	 ctxt.lineJoin = 'round';
	 ctxt.lineCap = 'round';
}

function startDrawing(event) {

	 drawing = true;

	 lastPoint = {x: event.clientX, y: event.clientY};
}

function stopDrawing(event) {

	 drawing = false;

	 lastPoint = null;
}

function doDrawing(event) {

	 if(!drawing)
		  return;

	 var currentPoint = {x: event.clientX, y: event.clientY};

	 var path = [
		  [lastPoint.x, lastPoint.y],
		  [currentPoint.x, currentPoint.y]
	 ];

	 // Dessine le tracé.
	 draw(path, myHue);

	 // Envoie le tracé aux autres clients.
	 socket.emit('user draws', {
		  path: path
	 });

	 lastPoint = currentPoint;
}

function draw(path, hue) {

	 ctxt.strokeStyle = 'hsl(' + hue + ',60%,50%)';

	 ctxt.beginPath();
	 ctxt.moveTo(path[0][0], path[0][1]);

	 for(var i = 1; i < path.length; ++i)
		  ctxt.lineTo(path[i][0], path[i][1]);

	 ctxt.stroke();
}

$(function() {

	 init();
});
