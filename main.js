
// screw it, we're doing things the old way
//#region shadercode
const _vertexShader = `#version 300 es

precision highp float;

out vec2 texCoord;

void main(void) {
	float x = float((gl_VertexID & 1) << 2);
	float y = float((gl_VertexID & 2) << 1);
	texCoord.x = x * 0.5;
	texCoord.y = y * 0.5;
	gl_Position = vec4(x - 1.0, y - 1.0, 0, 1);
}`

const _fragmentShader = `#version 300 es
precision highp float;

in vec2 texCoord;

uniform vec2 resolution;
uniform float time;

out vec4 fragmentColor;

void main(void) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv *= 10.;
    uv *= sin( time-uv.y * 10. )*( cos( time-uv.x * 10. ) );
    uv *= sin( time-uv.y );


	float color = 0.0;
	color += pow( pow( uv.x, 2. ) + pow( uv.y, 2. ), .5 );
	color += sin(10.*uv.x)-cos(10.*uv.y);
	vec3 col3 = mix(vec3(0.9137, 0., 1.), vec3(0.7020, 0., 1.), color );
	fragmentColor = vec4( col3, 1.);
}
`
//#endregion


// main run code
var gl;
var shaderProgram;

const canvas = document.querySelector("#back");
_start();

var time = gl.getUniformLocation(shaderProgram, "time");
var reso = gl.getUniformLocation(shaderProgram, "resolution");


// make the glsl context
// b e
function _start() {

	gl = canvas.getContext("webgl2");

	if (gl === null) {
		alert("Glsl don't work on your device\nNo cool background for you");
		return;
	}

	shaderProgram = initShaderProgram(gl, _vertexShader, _fragmentShader );

	gl.viewport(0,0, canvas.clientHeight, canvas.clientWidth);
	gl.useProgram(shaderProgram);

	canvas.addEventListener("resize", windowResizedEventHandler);
	
	render();
}

function render() {
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
}

// code shamelessly ripped from mdn docs
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
	// Create the shader program
  
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
  
	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	  alert(
		`Unable to initialize the shader program: ${gl.getProgramInfoLog(
		  shaderProgram,
		)}`,
	  );
	  return null;
	}
  
	return shaderProgram;
  }

function loadShader(gl, type, src) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(
			`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
		);
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

// shamelessly stolen from a randoproject
// https://gist.github.com/strangerintheq/27b8fc4e53432d8b9284364713ce8608
function scFromFile(fp) {
	var xhr = new XMLHttpRequest();
    xhr.open('get', fp, false);
    xhr.send();
    return xhr.responseText;
}

function mainloop(t) {
	gl.uniform1f( time, t/1000. );
	
	render();

	window.requestAnimationFrame(mainloop);
}

function windowResizedEventHandler() {
	gl.uniform2f(reso, canvas.clientHeight, canvas.clientWidth);
}

window.requestAnimationFrame(mainloop);