#version 300 es
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