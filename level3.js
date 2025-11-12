//base canvas dimensions
var BASE_WIDTH = 800;
var BASE_HEIGHT = 500;
var groundY = BASE_HEIGHT - 50;

//surfaces array
var surfaces = [
  //left ground (before hole)
  { x: -120, y: groundY, width: 450, height: 50, color: "red", type: "ground" },

  //right ground (after hole)
  { x: 450, y: groundY, width: 460, height: 50, color: "red", type: "ground" },

  //pass-through platform (jump from below, land from above)
  { x: 400, y: 317, width: 120, height: 15, color: "brown", type: "platform" },

  //solid platform (block all sides)
  { x: 600, y: 300, width: 100, height: 60, color: "gray", type: "solid" },
];

//goal object
var goal = {
  x: 750,
  y: groundY - 100,
  width: 50,
  height: 50,
  color: "yellow"
};

//enemies array (orange cubes)
var enemies = [
  { x: 150, y: groundY - 40, width: 40, height: 40, color: "orange" },
  { x: 550, y: groundY - 40, width: 40, height: 40, color: "orange" },
  { x: 500, y: 317 - 40, width: 40, height: 40, color: "orange" }
];

//spikes array (gray triangles)
var spikes = [
  { x: 330, y: groundY - 20, width: 30, height: 20, color: "gray" },
  { x: 360, y: groundY - 20, width: 30, height: 20, color: "gray" },
  { x: 390, y: groundY - 20, width: 30, height: 20, color: "gray" },
  { x: 420, y: groundY - 20, width: 30, height: 20, color: "gray" }
];

var tutorialTexts = [
  { //clear text
    x: 0,
    y: 0,
    text: "",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "white",
    strokeWidth: 2
  }
];

var currentLevel = 3;