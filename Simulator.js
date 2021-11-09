"use strict";
// WebGL Variables
let program, canvas, gl;
// Terrain Bounds
let xmin, xmax, zmin, zmax;
xmin = -5;
xmax = 5;
zmin = -5;
zmax = 5;
// Cordinate Arrays
let vertices = [];
let normals = [];
let colors = [];
// Model View Project
let eye = vec3(0.0, 1.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);
let look_at = vec3(0.0, 0.0, 0.0);
// Shader Variables
let p;
let mv;
let normalMat;
let projLoc;
let mvLoc;
let normLoc;
// Controls for Infinite terrain Generation
let center = vec2(0, 0);
let patchsize = 5;
let camera;
let depth = 0.8;
// Perspective Projection
let sTop = 1;
let sright = 1;
let sfar = -1;
let sbottom = -1;
let sleft = -1;
let snear = 1;
// Toggle Shading
let mode = 1;
// 0 - Flat
// 1 - Smooth
// 2 - Phong
// Toggle Terrain
let wiremode = 2;
// 0 - Points
// 1 - Wireframes
// 2 - Faces

// 0 -> 0 , 1 , 2
// 1 -> 0 , 1, 2
// 2 -> 2

let at_vec = vec3(0.0, -0.2, -0.5);
let direction;
let speed = vec3(0, 0.0, -0.02);
let keyMaps;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't availaible");

  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  if (mode == 0) {
    program = initShaders(gl, "vertex-shader-f", "fragment-shader-f");
  }
  if (mode == 1) {
    program = initShaders(gl, "vertex-shader-s", "fragment-shader-s");
  }
  if (mode == 2) {
    program = initShaders(gl, "vertex-shader-p", "fragment-shader-p");
  }



  gl.useProgram(program);

  vertices = get_patch(xmin, xmax, zmin, zmax);

  document.onkeydown = keyPressHandler;
  document.onkeyup = keyReleaseHandler;
  for (let i = 0; i < vertices.length; i++) {
    normals = vec3(0.0, 0.0, 0.0);
  }
  get_height();
  load_buffer();
  render();
};

function get_patch(minX, maxX, minZ, maxZ) {
  let ret = [];
  let dx = 0.05;
  let dz = 0.05;

  for (let x = minX; x <= maxX; x += dx) {
    for (let z = minZ; z <= maxZ; z += dz) {
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

// Return height map for a set of given vertices
function get_height() {
  noise.seed(6);
  for (let i = 0; i < vertices.length; i++) {
    let res = noise.perlin2(vertices[i][0], vertices[i][2]);
    vertices[i][1] = res[0];
    normals[i] = res[1];;
  }
}
// Check if new terrain is to be generated and then generate new terrain
function update_terrain() {
  let camera = vec2(eye[0], eye[2]);
  let distFromPatch = length(subtract(camera, center));
  if (depth * patchsize < distFromPatch) {
    center = camera;
    xmin = Math.floor(-patchsize + center[0]);
    xmax = Math.floor(patchsize + center[0]);
    zmin = Math.floor(-patchsize + center[1]);
    zmax = Math.floor(patchsize + center[1]);
    colors = [];
    normals = [];
    vertices = get_patch(xmin, xmax, zmin, zmax);
    get_height();
    load_buffer();
  }
}
// Load data into buffers
function load_buffer() {
  gl.flush();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  let positionLoc = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  if (mode != 2) {
    let normalLoc = gl.getAttribLocation(program, "Vnormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  let colorLoc = gl.getAttribLocation(program, "uColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);

}

function render() {
  update_terrain();
  eye = add(eye, speed);

  look_at = add(eye, at_vec);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  projLoc = gl.getUniformLocation(program, "p");
  mv = lookAt(eye, look_at, up);
  mvLoc = gl.getUniformLocation(program, "mv");
  if (mode != 1) {
    normLoc = gl.getUniformLocation(program, "normMat");
    normalMat = normalMatrix(mv, false);
    gl.uniformMatrix3fv(normLoc, gl.FALSE, flatten(normalMat));
  }
  p = frustum(sleft, sright, sbottom, sTop, snear, sfar);

  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));
  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));

  // Points
  if (wiremode == 0) {
    gl.drawArrays(gl.POINTS, 0, vertices.length);
  }
  // Wireframe
  if (wiremode == 1) {
    gl.drawArrays(gl.LINES, 0, vertices.length);
  }
  // Faces
  if (wiremode == 2) {

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

  }







  requestAnimationFrame(render);
}

function frustum(left, right, bottom, top, near, far) {

  if (left == right) { throw "frustum(): left and right are equal"; }

  if (bottom == top) { throw "frustum(): bottom and top are equal"; }

  if (near == far) { throw "frustum(): near and far are equal"; }

  let w = right - left;

  let h = top - bottom;

  let d = far - near;

  let result = mat4();

  result[0][0] = 2.0 * near / w;

  result[1][1] = 2.0 * near / h;

  result[2][2] = -(far + near) / d;

  result[0][2] = (right + left) / w;

  result[1][2] = (top + bottom) / h;

  result[2][3] = -2 * far * near / d;

  result[3][2] = -1;

  result[3][3] = 0.0;

  return result;

}
