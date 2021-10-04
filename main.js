function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

let canvas = document.getElementById('myCanvas');
let gl = canvas.getContext('experimental-webgl');

let vertices = [
	...k1_alas, ...k1_atas, ...k1_shading, ...k1_layar,
    ...k2_atas, ...k2_alas, ...k2_shading, ...k2_layar, ...k2_keycaps
];

let vertexShaderCode = `
	attribute vec2 a_position;
	attribute vec4 a_color;
	varying vec4 v_color;
	uniform mat4 u_matrix;
	void main() {
		gl_Position = u_matrix * vec4(a_position, 0, 3);
		v_color = a_color;
	}
`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);


let fragmentShaderCode = `
	precision mediump float;
	varying vec4 v_color;
	void main() {
		gl_FragColor = v_color;
	}
`;
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

let coords = gl.getAttribLocation(shaderProgram, "a_position");
var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");

var color = [];

for (let i = 0; i < k1_alas.length/2; i++) {
	let r = 196/255;
	let g = 192/255;
	let b = 212/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k1_atas.length/2; i++) {
	let r = 219/255;
	let g = 219/255;
	let b = 219/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k1_layar.length/2; i++) {
	let r = 50/255;
	let g = 60/255;
	let b = 63/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k1_shading.length/2; i++) {
	let r = 50/255;
	let g = 60/255;
	let b = 63/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k2_atas.length/2; i++) {
	let r = 196/255;
	let g = 192/255;
	let b = 212/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k2_alas.length/2; i++) {
	let r = 132/255;
	let g = 132/255;
	let b = 138/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k2_shading.length/2; i++) {
	let r = 196/255;
	let g = 192/255;
	let b = 212/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k2_layar.length/2; i++) {
	let r = 50/255;
	let g = 60/255;
	let b = 63/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}
for (let i = 0; i < k2_keycaps.length/2; i++) {
	let r = 219/255;
	let g = 219/255;
	let b = 219/255;
	color.push(r);
	color.push(g);
	color.push(b);
	color.push(1);
}


let colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorLocation);

let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coords);

let dy = 0;
let speed = 0.110;
function drawScene() {
	dy >= 0.68 ? speed = -speed : speed = speed;
	dy <= -0.72 ? speed = -speed : speed = speed;
	dy += speed;
	gl.useProgram(shaderProgram);
	const leftObject = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		-0.5, 0.0, 0.0, 1.0,
	]
		
	const rightObject = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.5, dy, 0.0, 1.0,
	]
		
	gl.clearColor(0.972, 0.941, 0.874, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const u_matrix = gl.getUniformLocation(shaderProgram, 'u_matrix');
	gl.uniformMatrix4fv(u_matrix, false, rightObject);
    
    gl.drawArrays(
		gl.TRIANGLES, 
		(k1_alas.length + k1_atas.length + k1_shading.length + k1_layar.length)/2, 
		(k2_atas.length + k2_alas.length + k2_shading.length + k2_layar.length + k2_keycaps.length)/2
	);
		
	gl.uniformMatrix4fv(u_matrix, false, leftObject);
    gl.drawArrays(
		gl.TRIANGLES, 
		0, 
		(k1_alas.length + k1_atas.length + k1_shading.length + k1_layar.length )/2
	);
	requestAnimationFrame(drawScene);
}

drawScene();