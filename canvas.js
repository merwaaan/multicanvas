var drawing = false;
var lastPoint = null;
var path = [];

var canvas = null;
var ctxt = null;

var socket = null;

function init() {

	 socket = io.connect('http://localhost');

	 socket.on('user joins', function(data) {
		  
		  var userName = data.name;
		  var userColor = data.color;

		  console.log(userName + ' joined');
	 });

	 socket.on('user leaves', function(data) {

		  var userName = data.name;

		  console.log(userName + ' leaved');
	 });

	 socket.on('user draws', function(data) {

		  draw(data.path);

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
	 
	 if(lastPoint !== null) {
		  ctxt.beginPath();
		  ctxt.moveTo(lastPoint.x, lastPoint.y);
		  ctxt.lineTo(x, y);
		  ctxt.stroke();
	 }
	 
	 lastPoint.x = x;
	 lastPoint.y = y;
}

function draw(path) {

	 ctxt.beginPath();
	 ctxt.moveTo(path[0][0], path[0][1]);

	 for(var i = 1; i < path.length; ++i)
		  ctxt.lineTo(path[i][0], path[i][1]);


	 ctxt.stroke();
}

$(function() {

	 init();
});
