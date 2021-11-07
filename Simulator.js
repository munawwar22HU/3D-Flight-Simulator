"use strict";
// WebGL Variables
let program, canvas, gl;
// Terrain Bounds
let xmin, xmax, zmin, zmax;
xmin = -5;
xmax = 5;
zmin = -5;
zmax = 5;
var speed = vec3(0, 0, -0.001);

// Cordinate Arrays
let vertices = [];
let colors = [];
let normals = [];
// Perspective Projection
let near = 0.1;
let far = 100.0;
let fov = 45;
let aspect;
var radius = 6.0;
var theta = 55.0;
var phi = 50;
// Model View Project
var eye = vec3(0, 1, 0);
var up = vec3(0.0, 1.0, 0.0);

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't availaible");

  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  vertices = get_patch(xmin, xmax, zmin, zmax);

  get_height();
  load_buffer();
  render();
};

function get_patch(minX, maxX, minZ, maxZ) {
  let ret = [];
  let dx = 0.2;
  let dz = 0.2;

  for (let x = xmin; x <= xmax; x += dx) {
    for (let z = zmin; z <= zmax; z += dz) {
      // Triangle 1
      // (x,z) (x,z+dz),(x+dx,z+dz)

      ret.push(vec4(x, 0, z, 1));
      ret.push(vec4(x + dx, 0, z + dz, 1));
      ret.push(vec4(x + dx, 0, z, 1));

      ret.push(vec4(x, 0, z, 1));
      ret.push(vec4(x, 0, z + dz, 1));
      ret.push(vec4(x + dx, 0, z + dz, 1));
      // Triangle 2
      // (x,z) (x+dx,z),(x+dx,z+dz)

      colors.push(vec4(1.0, 1.0, 1.0, 1.0));
      colors.push(vec4(1.0, 1.0, 1.0, 1.0));

      colors.push(vec4(1.0, 1.0, 1.0, 1.0));
      colors.push(vec4(1.0, 1.0, 1.0, 1.0));

      colors.push(vec4(1.0, 1.0, 1.0, 1.0));
      colors.push(vec4(1.0, 1.0, 1.0, 1.0));
    }
  }
  return ret;
}

function get_height() {
  noise.seed(42);
  for (let i = 0; i < vertices.length; i++) {
    vertices[i][1] = noise.perlin2(vertices[i][0], vertices[i][2]);
  }
}

function load_buffer() {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  let positionLoc = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  let colorLoc = gl.getAttribLocation(program, "uColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);
}
var look_at;
function render() {
  var direction = normalize(new vec3(speed));
  console.log(look_at);

  look_at = add(eye, direction);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  let projLoc = gl.getUniformLocation(program, "p");
  let mvLoc = gl.getUniformLocation(program, "mv");
  let mv = lookAt(eye, look_at, up);
  console.log(mv);
  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
  let p = perspective(fov, canvas.width / canvas.height, near, far);
  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));
  gl.drawArrays(gl.LINES, 0, vertices.length);

  eye = add(speed, eye);

  requestAnimationFrame(render);
}
