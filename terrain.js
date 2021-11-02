// https://www.cs.uregina.ca/Links/class-info/315/WebGL/Lab4/
function get_patch(xmin, xmax, zmin, zmax) {
  let ret = [];
  const xDivs = 23;
  const zDivs = 23;
  let dx = (xmax - xmin) / xDivs;
  let dz = (zmax - zmin) / zDivs;

  for (let x = xmin; x < xmax; x += dx) {
    for (let z = zmin; z < zmax; z += dz) {
      // Triangle 1
      // (x,z) (x,z+dz),(x+dx,z+dz)
      ret.push(vec4(x, 0, z, 1));
      ret.push(vec4(x, 0, z + dz, 1));
      ret.push(vec4(x + dx, 0, z + dz, 1));
      // Triangle 2
      // (x,z) (x+dx,z),(x+dx,z+dz)
      ret.push(vec4(x, 0, z, 1));
      ret.push(vec4(x + dx, 0, z + dz, 1));
      ret.push(vec4(x + dx, 0, z, 1));
    }
  }
  return ret;
}
