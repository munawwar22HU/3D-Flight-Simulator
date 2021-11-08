"use strict";
// WebGL Variables
let program, canvas, gl;
// Terrain Bounds
let xmin, xmax, zmin, zmax;
xmin = -5;
xmax = 5;
zmin = -5;
zmax = 5;
var speed = vec3(0, 0, -0.01);

// Cordinate Arrays
let vertices = [];
let colors = [];
let normals = [];
// Perspective Projection
let near = -1;
let far = 1;
let fov = 45;
let aspect;
var radius = 6.0;
var theta = 55.0;
var phi = 50;
// Model View Project
let eye = vec3(0.0, 1.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);
let look_at;
let direction;
let p;
let mv;
let projLoc;
let mvLoc;
// Controls for Infinite terrain Generation
let center = vec2(0, 0);
let patchsize = 5;
let camera;
let depth = 0.1;

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

function get_height() {
  noise.seed(42);
  for (let i = 0; i < vertices.length; i++) {
    let height = noise.perlin2(vertices[i][0], vertices[i][2]);
    vertices[i][1] = height > 0 ? height : 0 ;
  }
}

function update_terrain() {
  let camera = vec2(eye[0], eye[2]);
  let distFromPatch = length(subtract(camera, center));
  if (depth * patchsize < distFromPatch) {
    center = camera;
    xmin = Math.floor(-patchsize + center[0]);
    xmax = Math.floor(patchsize + center[0]);
    zmin = Math.floor(-patchsize + center[1]);
    zmax = Math.floor(patchsize + center[1]);

    vertices = get_patch(xmin, xmax, zmin, zmax);
    get_height();
    load_buffer();
  }
}

function load_buffer() {
  gl.flush();
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

function render() {
  direction = normalize(new vec3(speed));
  look_at = add(eye, direction);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  projLoc = gl.getUniformLocation(program, "p");
  mvLoc = gl.getUniformLocation(program, "mv");
  mv = lookAt(eye, look_at, up);
  p = perspective(fov, canvas.width / canvas.height, near, far);
  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));
  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
  gl.drawArrays(gl.LINES, 0, vertices.length);
  eye = add(speed, eye);
  update_terrain();
  requestAnimationFrame(render);
}
