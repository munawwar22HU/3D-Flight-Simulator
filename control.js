keyMaps = {
  W: false, //Pitch up
  S: false, //Pitch down
  A: false, //Yaw left
  D: false, //Yaw right
  Q: false, //Roll L
  E: false, //Roll R
  5: false,
  "%": false, //Near
  6: false,
  "^": false, //Far
  1: false,
  "!": false, //Left
  2: false,
  "@": false, //right
  3: false,
  "#": false, //top
  4: false,
  $: false, //bottom
  ArrowUp: false, //Increase speed
  ArrowDown: false, //Increase down
};

const keyPressHandler = (e) => {
  keyMaps[e.key.toUpperCase()] = true;
  updateView();
};

const keyReleaseHandler = (e) => {
  keyMaps[e.key.toUpperCase()] = false;

  updateView();
};

const updateView = () => {
  if (keyMaps["W"] === true) {
    at_vec[1] += 0.03;
  }
  if (keyMaps["S"] === true) {
    at_vec[1] -= 0.03;
  }
  if (keyMaps["Q"] === true) {
    if (up[0] > -1.0) {
      up[0] -= 0.03;
      console.log(up);
    }
  }
  if (keyMaps["E"] === true) {
    if (up[0] <= 1.0) {
      up[0] += 0.03;
      console.log(up);
    }
  }
  if (keyMaps["A"] === true) {
    at_vec[0] -= 0.03;
    speed[0] -= 0.03;
  }
  if (keyMaps["D"] === true) {
    at_vec[0] += 0.03;
    speed[0] += 0.03;
  }
  
  if (keyMaps['1']) {
    if (sleft < -0.5) { sleft += 0.05}
}
if (keyMaps['!']) {
    if (sleft > -2) { sleft -= 0.05}
}

if (keyMaps['2']) {
    if (sright > 0.5) { sright -= 0.05}
}
if (keyMaps['@']) {
    if (sright < 2) { sright += 0.05}
}

if (keyMaps['3']) {
    if (sTop > 0.5) { sTop -= 0.05}
}
if (keyMaps['#']) {
    if (sTop < 2) { sTop += 0.05}
}

if (keyMaps['4']) {
    if (sbottom < -0.5) { sbottom += 0.05}
}
if (keyMaps['$']) {
    if (sbottom > -2) { sbottom -= 0.05}
}


if (keyMaps['5']) {
    if (snear > 0.5) { snear -= 0.05}
}
if (keyMaps['%']) {
    if (snear < 2) { snear -= 0.05}
}

if (keyMaps['6']) {
    if (sfar < -0.5) { sfar += 0.05}
}
if (keyMaps['^']) {
    if (sfar > -2) { sfar -= 0.05}
}
};
