var drawing = false;

var lastPoint = null;

var canvas = null;
var ctxt = null;

var myHue = null;
var otherHues = {};

var socket = null;

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

		  delete hues[userId];

		  console.log('User ' + userId + ' leaved');
	 });

	 socket.on('user draws', function(data) {

		  var userId = data.id;

		  draw(data.path, otherHues[userId]);
	 });

	 canvas = $('canvas');
	 canvas.attr('width', document.width);
	 canvas.attr('height', document.height);
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

	 if(lastPoint !== null) {

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
	 }

	 lastPoint = currentPoint;
}

function draw(path, hue) {

	 ctxt.strokeStyle = 'hsl(' + hue + ',60%,50%)';
	 console.log(hue);

	 ctxt.beginPath();
	 ctxt.moveTo(path[0][0], path[0][1]);

	 for(var i = 1; i < path.length; ++i)
		  ctxt.lineTo(path[i][0], path[i][1]);


	 ctxt.stroke();
}

$(function() {

	 init();
});
