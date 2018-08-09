import FragmentShader from "../shaders/fragment.glsl";
import VertexShader from "../shaders/vertex.glsl";

import {mat4} from "gl-matrix";

class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.zoom = 1;

		this.gl = canvas.getContext('webgl2');
		this.program = this.gl.createProgram();

		this.renderTo = 20;
		this.stride = 3;

		this.geometries = [];
		this.vertices = [];
		this.generateGeometry();

		this.resizeCanvas();
		this.initShaders();
		this.initBuffers();
		this.initVariables();
	}

	initShaders() {
		this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(this.fragmentShader, FragmentShader);
		this.gl.compileShader(this.fragmentShader);
		if(!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) {
			throw new Error('Shader failed to compile: ' + this.gl.getShaderInfoLog(this.fragmentShader));
		}

		this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(this.vertexShader, VertexShader);
		this.gl.compileShader(this.vertexShader);

		if(!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) {
			throw new Error('Shader failed to compile: ' + this.gl.getShaderInfoLog(this.vertexShader));
		}

		this.gl.attachShader(this.program, this.fragmentShader);
		this.gl.attachShader(this.program, this.vertexShader);
		this.gl.linkProgram(this.program);

		this.gl.useProgram(this.program);
	}

	initBuffers() {
		const position = this.gl.getAttribLocation(this.program, 'position');
		this.gl.enableVertexAttribArray(position);

		const screenBuffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, screenBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(position, 3, this.gl.FLOAT, false, 0, 0);
	}

	initVariables() {
		this.perspective = this.gl.getUniformLocation(this.program, 'perspective');
		this.matrix = mat4.create();
		this.matrix[0] = 2 / 10;
		this.matrix[5] = 2 / 20;
		this.matrix[10] = -2 / this.renderTo;
		this.matrix[12] = -1;
		this.matrix[13] = -1;
	}

	generateGeometry() {
		for (let z = -this.renderTo; z <= 0; z += this.stride) {
			for (let x = this.renderTo; x > -this.renderTo; x -= this.stride) {
				this.geometries.push(x, Math.random() * this.stride, z);
			}
		}

		this.generateVertices();

		return this.vertices;
	}

	generateVertices() {
		let i = 0;
		let geometries = this.geometries;

		for (let z = -this.renderTo; z <= 0; z += this.stride) {
			for (let x = this.renderTo; x > -this.renderTo; x -= this.stride) {
				this.vertices.push(geometries[i], geometries[i + 1], geometries[i + 2]);
				this.vertices.push(x - this.stride / 2, 0, z - this.stride / 2);
				this.vertices.push(x + this.stride / 2, 0, z - this.stride / 2);

				this.vertices.push(geometries[i], geometries[i + 1], geometries[i + 2]);
				this.vertices.push(x + this.stride / 2, 0, z - this.stride / 2);
				this.vertices.push(x + this.stride / 2, 0, z + this.stride / 2);

				this.vertices.push(geometries[i], geometries[i + 1], geometries[i + 2]);
				this.vertices.push(x + this.stride / 2, 0, z + this.stride / 2);
				this.vertices.push(x - this.stride / 2, 0, z + this.stride / 2);

				this.vertices.push(geometries[i], geometries[i + 1], geometries[i + 2]);
				this.vertices.push(x - this.stride / 2, 0, z + this.stride / 2);
				this.vertices.push(x - this.stride / 2, 0, z - this.stride / 2);
				i += 3;
			}
		}

		return this.vertices;
	}

	updateGeometry() {
		for(let i = 1; i < this.geometries.length; i += 3) {
			this.geometries[i] += Math.random() * 1 - 0.5;
			this.geometries[i] = Math.max(0, Math.min(this.stride * 2, this.geometries[i]));
			/*
			this.geometries[i + 1] -= 0.01;

			if(this.geometries[i + 1] < 0) {
				this.geometries[i + 1] += this.renderTo;
			}*/
		}

		this.updateVertices();

		return this.vertices;
	}

	updateVertices() {
		let j = 0;
		for(let i = 0; i < this.geometries.length; i += 3) {
			this.vertices[j] = this.vertices[j + 9] = this.vertices[j + 18] =
				this.vertices[j + 27] = this.geometries[i];

			this.vertices[j + 1] = this.vertices[j + 10] = this.vertices[j + 19] =
				this.vertices[j + 28] = this.geometries[i + 1];

			this.vertices[j + 2] = this.vertices[j + 11] = this.vertices[j + 20] =
				this.vertices[j + 29] = this.geometries[i + 2];

			j += 36;
		}
	}

	resizeCanvas() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
		this.gl.viewport(0, 0, this.width, this.height);
	}

	render() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.initBuffers();
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.updateGeometry()), this.gl.STATIC_DRAW);
		this.gl.uniformMatrix4fv(this.perspective, false, this.matrix);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 3);
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}
}

export default Renderer;
