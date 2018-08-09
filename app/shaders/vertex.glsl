attribute vec3 position;
uniform mat4 perspective;
varying vec3 point;

void main(void) {
	point = position;
	vec4 perspectivePosition = perspective * vec4(position, 1.0);

	gl_Position = vec4(perspectivePosition.xyz, 1.0 + perspectivePosition.z);
}
