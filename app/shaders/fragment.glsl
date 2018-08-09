precision highp float;

varying vec3 point;

void main(void) {
	float y = normalize(point).y;
	gl_FragColor = vec4(y, y, y, 1.0);
}
