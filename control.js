keyMaps = {
  V: false,// Terrain
  C: false,// Shading
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
  'ARROWUP': false, //Increase speed
  'ARROWDOWN': false, //Increase down
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
  if (keyMaps["V"] === true) {
    if (mode == 2) {
      wiremode = 2
    }
    else {
      if (wiremode == 2) {
        wiremode = 0;
      }
      else {
        wiremode += 1;
      }
    }

  }
  if (keyMaps["C"] === true) {
    if (mode == 2) {
      mode = 0;
    }
    else {
      mode += 1;
    }

    if (mode == 2) {
      wiremode = 2;
    }
    toggle_shaders();
    r();
  }
  if (keyMaps["W"] === true) {
    at_vec[1] += 0.03;
  }
  if (keyMaps["S"] === true) {
    at_vec[1] -= 0.03;
  }
  if (keyMaps["Q"] === true) {
    if (up[0] > -1.0) {
      up[0] -= 0.03;
      // console.log(up);
    }
  }
  if (keyMaps["E"] === true) {
    if (up[0] <= 1.0) {
      up[0] += 0.03;
      // console.log(up);
    }
  }






  if (keyMaps["A"] === true) {

    at_vec[0] -= 0.03;





    if (at_vec[0] > 0) {
      speed[0] -= at_vec[0] / 1000;
      // if (speed[0] <= -0.05) {speed[0] = -0.05}

      speed[2] = speed[2] - Math.abs(speed[0])
      if (speed[2] <= -0.05) { speed[2] = -0.05 }
    }
    else {

      speed[0] = speed[0] + at_vec[0] / 1000;
      // if (speed[0] <= -0.05) {speed[0] = -0.05}

      speed[2] = speed[2] + Math.abs(speed[0])
      if (speed[2] > 0) { speed[2] = 0 }
    }

  }





  console.log(speed)
  // console.log(at_vec);
  if (keyMaps["D"] === true) {
    at_vec[0] += 0.03;

    if (at_vec[0] <= 0) {
      speed[0] = speed[0] - at_vec[0] / 1000;
      if (speed[0] >= 0.05) { speed[0] = 0.05 }

      speed[2] = speed[2] - Math.abs(speed[0])
      if (speed[2] <= -0.05) { speed[2] = -0.05 }
    }
    else {
      speed[0] = speed[0] + at_vec[0] / 1000;
      // if (speed[0] >= 0.05){speed[0] = 0.05}

      speed[2] = speed[2] + Math.abs(speed[0])
      if (speed[2] > 0) { speed[2] = 0 }
    }

  }




  if (keyMaps['1']) {
    if (sleft < -0.5) { sleft += 0.05 }
  }
  if (keyMaps['!']) {
    if (sleft > -2) { sleft -= 0.05 }
  }

  if (keyMaps['2']) {
    if (sright > 0.5) { sright -= 0.05 }
  }
  if (keyMaps['@']) {
    if (sright < 2) { sright += 0.05 }
  }

  if (keyMaps['3']) {
    if (sTop > 0.5) { sTop -= 0.05 }
  }
  if (keyMaps['#']) {
    if (sTop < 2) { sTop += 0.05 }
  }

  if (keyMaps['4']) {
    if (sbottom < -0.5) { sbottom += 0.05 }
  }
  if (keyMaps['$']) {
    if (sbottom > -2) { sbottom -= 0.05 }
  }


  if (keyMaps['5']) {
    if (snear > 0.5) { snear -= 0.05 }
  }
  if (keyMaps['%']) {
    if (snear < 2) { snear += 0.05 }
  }

  if (keyMaps['6']) {
    if (sfar < -0.5) { sfar += 0.05 }
  }
  if (keyMaps['^']) {
    if (sfar > -2) { sfar -= 0.05 }
  }

  if (keyMaps['ARROWUP']) {
    // console.log('hi')
    if (acc <= 2) {
      acc += 0.1;
      speed = vec3(speed[0] + acc * speed[0] * 0.3, speed[1] + acc * speed[1] * 0.3, speed[2] + acc * speed[2] * 0.3)
      console.log(speed);
    }
  }

  if (keyMaps['ARROWDOWN']) {
    // console.log('hi')
    if (acc >= 1) {
      acc -= 0.1;
      speed = vec3(speed[0] - acc * speed[0] * 0.2, speed[1] - acc * speed[1] * 0.2, speed[2] - acc * speed[2] * 0.2)
      console.log(speed);
    }
  }
};
