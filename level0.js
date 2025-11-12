//base canvas dimensions
var BASE_WIDTH = 800;
var BASE_HEIGHT = 500;
var groundY = BASE_HEIGHT - 50;

//surfaces array
var surfaces = [
  //GROUND
  { x: -120, y: groundY, width: 2200, height: 450, color: "green", type: "ground" },

  { x: 2500, y: groundY, width: 500, height: 450, color: "green", type: "ground" },

  //PLATFORMS
  { x: 550, y: 320, width: 120, height: 15, color: "brown", type: "platform" },

  { x: 770, y: 300, width: 120, height: 150, color: "gray", type: "solid" },

  { x: 2200, y: 400, width: 185, height: 15, color: "brown", type: "platform" },
];

//goal object
var goal = {
  x: 2725,
  y: groundY - 60,
  width: 50,
  height: 50,
  color: "yellow"
};

//enemies array (orange cubes)
var enemies = [
  { x: 1700, y: groundY - 70, width: 40, height: 60, color: "orange" },
];

//spikes array (gray triangles)
var spikes = [
  { x: 1300, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 1330, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 1360, y: groundY - 30, width: 30, height: 30, color: "gray" },
];

var tutorialTexts = [
  { //controls
    x: 120,
    y: 380,
    text: "Use A, D, and SPACE to move and jump",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "purple",
    strokeWidth: 2
  },
  { //pass through platforms
    x: 610,
    y: 280,
    text: "You can jump through brown platforms",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "brown",
    strokeWidth: 2
  },
  {
    x: 610,
    y: 300,
    text: "Use this one to get over the wall",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "brown",
    strokeWidth: 2
  },
  { //solid platforms
    x: 830,
    y: 260,
    text: "Gray walls can't",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "gray",
    strokeWidth: 2
  },
  { //solid platforms
    x: 830,
    y: 280,
    text: "be passed through",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "gray",
    strokeWidth: 2
  },
  { //spikes
    x: 1345,
    y: groundY - 80,
    text: "Avoid spikes, they deal 1 damage to you",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "red",
    strokeWidth: 2
  },
  { //health (below spikes)
    x: 1345,
    y: groundY - 60,
    text: "If your health reaches 0, the level will restart",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "red",
    strokeWidth: 2
  },
  { //enemies
    x: 1720,
    y: groundY - 140,
    text: "Running into enemies deals 1 damage to you",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "orange",
    strokeWidth: 2
  },
  { 
    x: 1720,
    y: groundY - 120,
    text: "Jumping on top of an enemy will defeat it, and make you bounce",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "orange",
    strokeWidth: 2
  },
  {
    x: 1720,
    y: groundY - 100,
    text: "Holding SPACE while jumping on an enemy will make you bounce higher",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "orange",
    strokeWidth: 2
  },
  { //the void
    x: 2295,
    y: groundY + 30,
    text: "Avoid falling into the void,",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "green",
    strokeWidth: 2
  },
  {
    x: 2295,
    y: groundY + 50,
    text: "as it will make you lose all of your health",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "green",
    strokeWidth: 2
  },
  { //goal
    x: 2750,
    y: groundY - 80,
    text: "Reach the goal to complete the level and unlock the next one",
    fontSize: "14px Arial",
    color: "white",
    align: "center",
    strokeColor: "yellow",
    strokeWidth: 0.5
  }
];

var currentLevel = 0; //tutorial