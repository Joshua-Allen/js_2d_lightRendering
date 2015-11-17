var lifeCanvas;
var ctx_life
var current_canvas
var current_context

var life;
var cellSize;
var numCells_x;
var numCells_y;
var numberOfCells;

var running;
var interval;

var mouse = {
	x: 0,
	y: 0,
	over:false,
	down:false
};

// wait for the html to load
window.onload = function(){
	lifeCanvas = document.getElementById("lifeCanvas");
	ctx_life = lifeCanvas.getContext("2d");
	lifeCanvas.style.cursor = "none";
	current_canvas = lifeCanvas;
	current_context = ctx_life;
	
	life = [];
	cellSize = 4;
	numCells_x = Math.ceil(lifeCanvas.width / cellSize);
	numCells_y = Math.ceil(lifeCanvas.height / cellSize);
	numberOfCells = numCells_x * numCells_y;

	running = true;
	interval = setInterval(render, 1000/30);
	
	lifeStart();
	
	set_mouseListeners();
}

// mouse helper functions
function set_mouseListeners(){
	lifeCanvas.addEventListener('mousemove', function(evt) {
		var rect = lifeCanvas.getBoundingClientRect();
		mouse.x = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*lifeCanvas.width);
		mouse.y = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*lifeCanvas.height);
	}, false);
	
	lifeCanvas.addEventListener('mousedown', function(evt) {mouse.down = true;}, false);
	lifeCanvas.addEventListener('mouseup', function(evt) {mouse.down = false;}, false);
	
	lifeCanvas.addEventListener('mouseover', function(evt) { mouse.over = true;}, false);
	lifeCanvas.addEventListener('mouseout', function(evt) { mouse.over = false;}, false);
}
function mouse_update() {
	if (mouse.over && mouse.down)
	{
		var x = Math.floor(mouse.x / cellSize);
		var y = Math.floor(mouse.y / cellSize);
		
		life[x + (y*(numCells_x))] = true;
	}
}
function mouse_render() {
	if (mouse.over)
	{
		var x = Math.floor(mouse.x / cellSize);
		var y = Math.floor(mouse.y / cellSize);
		
		draw_rect(x*cellSize,y*cellSize,cellSize,cellSize);
	}
}



// life functions
function lifeStart() {
	for (i = 0; i < numberOfCells; i++) 
	{
		life[i] = (100*Math.random() < 15);
	}
}

function lifeGetCell(x, y) {
	if (y < 0) y = numCells_y-1;
	if (y > numCells_y-1) y = 0;
		
	if (x < 0) x = numCells_x-1;
	if (x > numCells_x-1) x = 0;
	
	return life[x + (y*(numCells_x))];
}
function lifeSetCell(array, x, y, val) {
	array[x + (y*(numCells_x))] = val;
}
function lifeUpdate() {
	numCells_x = (lifeCanvas.width / cellSize);
	numCells_y = (lifeCanvas.height / cellSize);
	numberOfCells = numCells_x * numCells_y;
	
	var newlife = [];
	for (x = 0; x < numCells_x; x++) 
	{
		for (y = 0; y < numCells_y; y++) 
		{
			
			var c = lifeGetCell(x,y);
			
			var c1 = lifeGetCell(x-1,y-1);
			var c2 = lifeGetCell(x  ,y-1);
			var c3 = lifeGetCell(x+1,y-1);
			var c4 = lifeGetCell(x-1,y  );
			var c5 = lifeGetCell(x+1,y  );
			var c6 = lifeGetCell(x-1,y+1);
			var c7 = lifeGetCell(x  ,y+1);
			var c8 = lifeGetCell(x+1,y+1);
			
			var total = c1+c2+c3+c4+c5+c6+c7+c8;
			
			lifeSetCell(newlife, x, y, false);
			if (c){
				if (total < 2)
				{
					lifeSetCell(newlife, x, y, false);
				}
				if (total == 2 || total == 3)
				{
					lifeSetCell(newlife, x, y, true);
				}
				if (total > 3)
				{
					lifeSetCell(newlife, x, y, false);
				}
			} else {
				if (total == 3)
				{
					lifeSetCell(newlife, x, y, true);
				}
			}
		}
	}
	
	Array.prototype.splice.apply(life, [0, newlife.length].concat(newlife));
}
function render_life() {
	var x = 0;
	var y = 0;
	
	for (i = 0; i < numberOfCells; i++) 
	{
		if (life[i])
		{
			draw_rect(x*cellSize,y*cellSize,cellSize,cellSize);
		}
		x++;
		if (x >= numCells_x)
		{
			x = 0;
			y++;
		}
	}
}

// sim functions
function start() {
	if (!running)
	{
		running = true;
		//interval = setInterval(render, 1000/30);
	}
}
function stop() {
	if (running)
	{
		running = false;
		//clearInterval(interval);
	}
}
function lifeClear(){
	for (i = 0; i < numberOfCells; i++) 
	{
		life[i] = false;
	}
}
// main render

function render(){
	//
	ctx_life.clearRect(0, 0, lifeCanvas.width, lifeCanvas.height);
	
	//
	current_context = ctx_life;
	if (running) {lifeUpdate();}
	mouse_update();
	render_life();
	mouse_render();
}

// draw helper functions
function draw_line(x1, y1, x2, y2) {
	current_context.beginPath();
	current_context.moveTo(x1,y1);
	current_context.lineTo(x2,y2);
	current_context.stroke();
}
function draw_circle(x, y, r) {
	current_context.beginPath();
	current_context.arc(x,y,r,0,2*Math.PI);
	current_context.stroke();
}
function draw_rect(x,y,width,height) {
	current_context.fillRect(x,y,width,height);
}
function draw_point(x,y) {
	current_context.fillRect(x,y,1,1);
}






















