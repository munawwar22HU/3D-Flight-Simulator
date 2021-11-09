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
    'ArrowUp': false, //Increase speed
    'ArrowDown': false, //Increase down
}



const keyPressHandler = ((e) => {
    keyMaps[e.key.toUpperCase()] = true;
    updateView();
    render();
  })
  
  const keyReleaseHandler = ((e) => {
    keyMaps[e.key.toUpperCase()] = false;
    
    updateView();
  })
  
  const updateView = (() => {
    if (keyMaps['W'] === true){
      if (look_at[1] <= 1.5) {look_at[1] += 0.03;}
    }
    if (keyMaps['S'] === true){
      if (look_at[1] > -0.5) {look_at[1] -= 0.03;}
    }
    if (keyMaps['Q'] === true){
      if (up[2] > -1.0) {up[2] -= 0.03;}
    }
    if (keyMaps['E'] === true){
      if (up[2] <= 1.0) {up[2] += 0.03;}
    }
    if (keyMaps['A'] === true){
      if (look_at[2] <= 1.0) {look_at[2] += 0.03;}
    }
    if (keyMaps['D'] === true){
      if (look_at[2] > -1.0) {look_at[2] -= 0.03};
    }
    if (keyMaps['5']== true || keyMaps['%'] == true){
      if (fov >= 20) {fov -= 3;}
    }
    if (keyMaps['6']== true || keyMaps['^'] == true){
      if (fov <= 60) {fov += 3;}
    }
    if (keyMaps['1']== true || keyMaps['!'] == true){
      if (look_at[2] > -1.0) {look_at[2] -= 0.3;}
    }
    if (keyMaps['2']== true || keyMaps['@'] == true){
       if (look_at[2] <= 1.0) {look_at[2] += 0.3;}
    }
    if (keyMaps['3']== true || keyMaps['#'] == true){
      if (look_at[1] <= 1.5 ) {look_at[1] += 0.3;}
    }
    if (keyMaps['4']== true || keyMaps['$'] == true){
      if (look_at[1] > -1.5) {look_at[1] -= 0.3;}
    }
    if (keyMaps['ArrowUp'] === true){
        speed[2] += 0.03;
    }
    if (keyMaps['ArrowDown'] === true){
        speed[2] -= 0.03;
    }
  })
