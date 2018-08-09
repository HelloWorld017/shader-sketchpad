precision highp float;

varying vec3 point;

void main(void) {
	float z = normalize(point).y;
	gl_FragColor = vec4(z, z, z, 1.0);
}
