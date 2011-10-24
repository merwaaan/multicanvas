var drawing = false;
var lastPoint = null;
var path = [];

var canvas = null;
var ctxt = null;

var myHue = null;
var hues = {};

var socket = null;

function init() {

		socket = io.connect('http://localhost');

		socket.on('connected', function(data) {

				myHue = data.myHue;
				hues = data.otherHues;

				console.log('Connected with hue ' + myHue);
		});

		socket.on('user joins', function(data) {

				var userId = data.id;
				var userHue = data.hue;

				hues[userId] = userHue;

				console.log('User ' + userId + ' joined with hue ' + userHue);
		});

		socket.on('user leaves', function(data) {

				var userId = data.id;

				delete hues[userId];

				console.log('User ' + userId + ' leaved');
		});

		socket.on('user draws', function(data) {
				console.log(hues);
				console.log(data);
				var userId = data.id;

				draw(data.path, hues[userId]);
		});

		canvas = $('canvas');
		canvas.bind('mousedown', startDrawing);
		canvas.bind('mouseup', stopDrawing);
		canvas.bind('mousemove', doDrawing);

		ctxt = canvas[0].getContext('2d');
}

function startDrawing(event) {

		drawing = true;

		var x = event.clientX;
		var y = event.clientY;

		lastPoint = {x: x, y: y};
}

function stopDrawing(event) {

		drawing = false;

		socket.emit('user draws', {
				path: path
		});

		path = [];
		lastPoint = null;
}

function doDrawing(event) {

		if(!drawing)
				return;

		var x = event.clientX;
		var y = event.clientY;

		path.push([x, y]);
		ctxt.strokeStyle = 'hsl(' + myHue + ',100%,50%)';
		if(lastPoint !== null) {
				ctxt.beginPath();
				ctxt.moveTo(lastPoint.x, lastPoint.y);
				ctxt.lineTo(x, y);
				ctxt.stroke();
		}

		lastPoint.x = x;
		lastPoint.y = y;
}

function draw(path, hue) {

		ctxt.strokeStyle = 'hsl(' + hue + ',100%,50%)';
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
