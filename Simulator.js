"use strict";
let gl;
let points = [];
let program;
let color;
let shapes;

window.onload = function init() {
  let canvas = document.getElementById("gl-canvas");
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

  let projLoc = gl.getUniformLocation(program, "p");
  let mvLoc = gl.getUniformLocation(program, "mv");
  color = gl.getUniformLocation(program, "uColor");

  // Projection Matrix
  let p = perspective(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);

  gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));

  var eye = vec3(0.0, 5.0, 10);
  var at = vec3(0.0, 0.0, 0.0);
  var up = vec3(0.0, 1.0, 0.0);
  // Modelview Matrix
  let mv = lookAt(eye, at, up);
  gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));

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
  gl.uniform4f(color, 0, 0, 0, 1);
  gl.drawArrays(gl.POINTS, shapes.hmapWires.Start, shapes.hmapWires.Vertices);
}
