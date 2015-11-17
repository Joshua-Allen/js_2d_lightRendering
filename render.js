var current_canvas
var current_context

var running;
var interval;

var lightCanvas;
var ctx_light;

var walls = [];
var lights = [];

var render_x = 0;
var render_y = 0;

// wait for the html to load
window.onload = function(){
	lightCanvas = document.getElementById("lightCanvas");
	ctx_light = lightCanvas.getContext("2d");
	lightCanvas.style.cursor = "none";
	
	current_canvas = lightCanvas;
	current_context = ctx_light;
	
	create_world();
	set_mouseListeners();
	
	running = true;
	interval = setInterval(render, 1000/30);
}

//
function create_world(){
	new_wall(250, 138, 32, 32);
	new_wall(250, 238, 32, 32);
	new_wall(280, 100, 32, 32);
	new_light(330, 168, 16, "#FFFFFF");
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
function reset(){

}

// main render
function render(){
	//draw_clear();
	var i;
	if (render_y == 0 && render_x == 0) {
		for	(i = 0; i < walls.length; i++) {
			draw_set_color("#000000")
			draw_rect(walls[i].x,walls[i].y,walls[i].width,walls[i].height);
			draw_set_color("#FFFFFF")
			draw_rect(walls[i].x+2,walls[i].y+2,walls[i].width-4,walls[i].height-4);
		}
		for	(i = 0; i < lights.length; i++) {
			draw_set_color("#000000")
			draw_circle(lights[i].x, lights[i].y, lights[i].r);
		}
	}
	
	draw_set_color("#000000");
	for	(i = 0; i < 100; i++) {
		renter_light();
	}
}
function renter_light()
{
	if (render_y > current_canvas.height) return true;
	
	var i, hit;
	for	(i = 0; i < lights.length; i++) {
		hit = collision_line(render_x, render_y, lights[i].x, lights[i].y);
	}
	
	if (hit)
		draw_set_color("#000000");
	else
		draw_set_color("#FFFFFF");
	
	draw_point(render_x, render_y);
	
	
	
	render_x++;
	if(render_x > current_canvas.width){
		render_x = 0;
		render_y++;
	}
	
}


//
function new_wall(x, y, width, height){
	var wall = {
		x: x,
		y: y,
		width: width,
		height: height
	};

	walls.push(wall);
}
function new_light(x, y, r, color){
	var light = {
		x: x,
		y: y,
		r: r,
		color: color
	};

	lights.push(light);
}

//
function collision_line(x1, y1, x2, y2){
	var i, wall, hit1, hit2, hit3, hit4, w, h, x4, y4;
	for	(i = 0; i < walls.length; i++) {
		wall = walls[i];
		
		w = wall.x + wall.width;
		h = wall.y + wall.height;
		
		hit1 = lines_intersect(x1,y1,x2,y2, 
					wall.x, wall.y, w, wall.y, true);
		hit2 = lines_intersect(x1,y1,x2,y2,
					wall.x, h, w, h,true);
		hit3 = lines_intersect(x1,y1,x2,y2,
					wall.x, wall.y,wall.x,h,true);
		hit4 = lines_intersect(x1,y1,x2,y2,
					w,wall.y,w,h,true);
		
		if (hit1 || hit2 || hit3 || hit4)
		{
			return true;
		}
	}
	return false;
}

//
function lines_intersect(x1,y1,x2,y2,x3,y3,x4,y4,segment) {
    var ua, ub, ud, ux, uy, vx, vy, wx, wy;
    ua = 0;
    ux = x2 - x1;
    uy = y2 - y1;
    vx = x4 - x3;
    vy = y4 - y3;
    wx = x1 - x3;
    wy = y1 - y3;
    ud = vy * ux - vx * uy;
	
    if (ud != 0) 
    {
        ua = (vx * wy - vy * wx) / ud;
        if (segment) 
        {
            ub = (ux * wy - uy * wx) / ud;
            if (ua < 0 || ua > 1 || ub < 0 || ub > 1) ua = 0;
        }
    }
	
	if (ua > 0 && ua <= 1)
		return true;
	else
		return false;
}
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

// mouse
var mouse = {
	x: 0,
	y: 0,
	over:false,
	down:false
};
function set_mouseListeners(){
	lightCanvas.addEventListener('mousemove', function(evt) {
		var rect = lightCanvas.getBoundingClientRect();
		mouse.x = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*lightCanvas.width);
		mouse.y = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*lightCanvas.height);
	}, false);
	
	lightCanvas.addEventListener('mousedown', function(evt) {mouse.down = true;}, false);
	lightCanvas.addEventListener('mouseup', function(evt) {mouse.down = false;}, false);
	
	lightCanvas.addEventListener('mouseover', function(evt) { mouse.over = true;}, false);
	lightCanvas.addEventListener('mouseout', function(evt) { mouse.over = false;}, false);
}


// draw helper functions
function draw_set_color(color){
	current_context.fillStyle = color;
	current_context.strokeStyle = color;
}
function draw_clear(){
	current_context.clearRect(0, 0, current_canvas.width, current_canvas.height);
}
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






















