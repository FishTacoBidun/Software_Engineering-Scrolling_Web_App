//base canvas dimensions
const BASE_WIDTH = 800;
const BASE_HEIGHT = 500;
const groundY = BASE_HEIGHT - 50;

//surfaces array
const surfaces = [
  //left ground (before hole)
  { x: -120, y: groundY, width: 450, height: 50, color: "green", type: "ground" },

  //right ground (after hole)
  { x: 450, y: groundY, width: 460, height: 50, color: "green", type: "ground" },

  //pass-through platform (jump from below, land from above)
  { x: 400, y: 317, width: 120, height: 15, color: "brown", type: "platform" },

  //solid platform (block all sides)
  { x: 600, y: 300, width: 100, height: 60, color: "gray", type: "solid" },
];