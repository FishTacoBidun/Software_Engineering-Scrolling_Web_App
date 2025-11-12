//base canvas dimensions
var BASE_WIDTH = 800;
var BASE_HEIGHT = 500;
var groundY = BASE_HEIGHT - 50;

//surfaces array
var surfaces = [
  //GROUND
  { x: -100, y: groundY, width: 420, height: 450, color: "green", type: "ground" },

  { x: 490, y: groundY, width: 410, height: 450, color: "green", type: "ground" },

  { x: 1600, y: groundY, width: 1700, height: 450, color: "green", type: "ground" },

  { x: 4180, y: 360, width: 550, height: 810, color: "green", type: "ground" },

  //PLATFORMS
  //two starter jumps
  { x: 1050, y: groundY, width: 125, height: 15, color: "brown", type: "platform" },

  { x: 1325, y: groundY, width: 125, height: 15, color: "brown", type: "platform" },

  //big wall
  { x: 2500, y: groundY - 550, width: 200, height: 550, color: "gray", type: "solid" },

  //to get over wall
  { x: 2125, y: 320, width: 120, height: 15, color: "brown", type: "platform" },

  { x: 2250, y: 190, width: 120, height: 15, color: "brown", type: "platform" },

  { x: 2000, y: 90, width: 120, height: 15, color: "brown", type: "platform" },

  { x: 2250, y: -10, width: 120, height: 15, color: "brown", type: "platform" },

  //to get over gap
  { x: 3400, y: 360, width: 600, height: 15, color: "brown", type: "platform" },
];

//goal object
var goal = {
  x: 4425,
  y: 300,
  width: 50,
  height: 50,
  color: "yellow"
};

//enemies array (orange cubes)
var enemies = [
  //on ground
  { x: 1820, y: groundY - 70, width: 40, height: 60, color: "orange" },

  //on platform
  { x: 3670, y: 290, width: 40, height: 60, color: "orange" },
];

//spikes array (gray triangles)
var spikes = [
  //below wall
  { x: 2700, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 2730, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 2760, y: groundY - 30, width: 30, height: 30, color: "gray" },

  //on platform
  { x: 3500, y: 330, width: 30, height: 30, color: "gray" },
  { x: 3530, y: 330, width: 30, height: 30, color: "gray" },

  { x: 3840, y: 330, width: 30, height: 30, color: "gray" },
  { x: 3870, y: 330, width: 30, height: 30, color: "gray" },
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

var currentLevel = 1;