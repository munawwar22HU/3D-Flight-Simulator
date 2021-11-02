"use strict";
let gl;
let points = [];
let program;
let color;
let shapes;
let canvas;


const eye = vec3(
    7.0*Math.sin(60)*Math.cos(60),
    7.0*Math.sin(60)*Math.sin(60),
    7.0*Math.cos(60)
);
// const eye = vec3(0.0, 5.0, 10)
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

//Handling Key Presses 
//True when Key Pressed, False when released. 
const keyMaps = {
    'W': false, //Pitch up
    'S': false, //Pitch down
    'A': false, //Yaw left
    'D': false, //Yaw right 
    'Q': false, //Roll L
    'E': false, //Roll R
    '5': false, '%': false, //Near
    '6': false, '^': false, //Far
    '1': false, '!': false, //Left
    '2': false, '@': false, //right
    '3': false, '#': false, //top
    '4': false, '$': false, //bottom
}

// For perspective Proection 
let near = 0.1;
let far = 100.0;
let fieldOfView = 35; 



window.onload = function init() {
 canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(1, 1);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  points = get_patch(-2, 2, -2, 2);
  shapes = {};
  shapes.hmap = {};
  shapes.hmap.Start = 0;
  shapes.hmap.Vertices = points.length;

  for (var i = 0; i < points.length; i++) {
    points[i][1] =
      Math.sin(points[i][0] * 1.5) / 3 + Math.sin(points[i][2] * 1) / 2;
  }

  shapes.hmapWires = {};
  shapes.hmapWires.Start = points.length;
  points = points.concat(TrianglesToWireframe(points));
  shapes.hmapWires.Vertices = points.length - shapes.hmapWires.Start;
  for (var i = 0; i < points.length; i++) {
    points[i][1] =
      Math.sin(points[i][0] * 1.5) / 3 + Math.sin(points[i][2] * 1) / 2;
  }

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  let positionLoc = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  document.onkeydown = keyPressHandler;
  document.onkeyup = keyReleaseHandler; 

  render();
};

// Converts triangles to Wireframes
function TrianglesToWireframe(Vertices) {
  var res = [];
  for (var i = 0x0; i < Vertices.length; i += 3) {
    res.push(Vertices[i]);
    res.push(Vertices[i + 1]);
    res.push(Vertices[i + 1]);
    res.push(Vertices[i + 2]);
    res.push(Vertices[i + 2]);
    res.push(Vertices[i]);
  }
  return res;
}

function render() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

//   gl.uniform4f(color, 1, 1, 1, 1);
//   gl.drawArrays(gl.TRIANGLES, shapes.hmap.Start, shapes.hmap.Vertices);

  let projLoc = gl.getUniformLocation(program, "p");
  let mvLoc = gl.getUniformLocation(program, "mv");
  color = gl.getUniformLocation(program, "uColor");

  // Projection Matrix
  let p = perspective(fieldOfView, canvas.clientWidth / canvas.clientHeight, near, far);
  // let p = frustum(-1.0, 1.0, -1.0, 1.0, -0.0, 0.0)

  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));


  // Modelview Matrix
  let mv = lookAt(eye, at, up);
  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
  gl.uniform4f(color, 0, 0, 0, 1);
  gl.drawArrays(gl.POINTS, shapes.hmapWires.Start, shapes.hmapWires.Vertices);
}

const keyPressHandler = ((e) => {
  keyMaps[e.key.toUpperCase()] = true;
  updateView();
   render();
  // console.log(e.key);
  // console.log(keyMaps)
})

const keyReleaseHandler = ((e) => {
  keyMaps[e.key.toUpperCase()] = false;
  
  updateView();
})

const updateView = (() => {
  if (keyMaps['W'] === true){
    at[1] += 0.02; //Bound to be added
  }
  if (keyMaps['S'] === true){
    at[1] -= 0.02;
  }
  if (keyMaps['Q'] === true){
    up[2] -= 0.03;
  }
  if (keyMaps['E'] === true){
    up[2] += 0.03;
  }
  if (keyMaps['A'] === true){
    at[2] += 0.03; 
  }
  if (keyMaps['D'] === true){
    at[2] -= 0.03;
  }
  if (keyMaps['5']== true || keyMaps['%'] == true){
    fieldOfView -= 3;
  }
  if (keyMaps['6']== true || keyMaps['^'] == true){
    fieldOfView += 3;
  }
  if (keyMaps['1']== true || keyMaps['!'] == true){
    at[2] -= 0.3;
  }
  if (keyMaps['2']== true || keyMaps['@'] == true){
    at[2] += 0.3;
  }
  if (keyMaps['3']== true || keyMaps['#'] == true){
    at[1] += 0.3;
  }
  if (keyMaps['4']== true || keyMaps['$'] == true){
    at[1] -= 0.3;
  }

})



