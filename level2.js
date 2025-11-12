//base canvas dimensions
var BASE_WIDTH = 800;
var BASE_HEIGHT = 500;
var groundY = BASE_HEIGHT - 50;

//surfaces array
var surfaces = [
  //GROUND
  { x: -120, y: groundY, width: 720, height: 450, color: "green", type: "ground" },

  { x: 1380, y: groundY, width: 1040, height: 450, color: "green", type: "ground" },

  { x: 3620, y: groundY, width: 1300, height: 450, color: "green", type: "ground" },

  //PLATFORMS
  //cave
  { x: 1680, y: groundY - 500, width: 120, height: 450, color: "gray", type: "solid" },

  { x: 1800, y: 200, width: 300, height: 100, color: "gray", type: "solid" },
  
  { x: 2100, y: groundY - 250, width: 120, height: 200, color: "gray", type: "solid" },

  //right ladder
  { x: 2220, y: groundY - 125, width: 80, height: 15, color: "brown", type: "platform" },

  { x: 2220, y: groundY - 250, width: 80, height: 15, color: "brown", type: "platform" },

  //left ladder
  { x: 1800, y: groundY - 375, width: 80, height: 15, color: "brown", type: "platform" },

  { x: 1800, y: groundY - 500, width: 80, height: 15, color: "brown", type: "platform" },

  //elevated jumps
  { x: 2015, y: groundY - 600, width: 80, height: 15, color: "brown", type: "platform" },

  { x: 2220, y: groundY - 700, width: 80, height: 15, color: "brown", type: "platform" },

  //large right pillar
  { x: 2300, y: groundY - 700, width: 35, height: 700, color: "gray", type: "solid" },

  { x: 2385, y: groundY - 700, width: 35, height: 250, color: "gray", type: "solid" },

  { x: 2385, y: groundY - 400, width: 35, height: 185, color: "gray", type: "solid" },

  { x: 2300, y: groundY - 700, width: 120, height: 250, color: "gray", type: "solid" },

  //fall jump 
  { x: 2420, y: groundY - 700, width: 250, height: 15, color: "brown", type: "platform" },

  { x: 2420, y: groundY - 600, width: 190, height: 15, color: "brown", type: "platform" },

  { x: 2420, y: groundY - 500, width: 130, height: 15, color: "brown", type: "platform" },

  { x: 2420, y: groundY - 400, width: 70, height: 15, color: "brown", type: "platform" },

  //spike pit platform and wall
  { x: 2420, y: groundY - 250, width: 720, height: 35, color: "gray", type: "solid" },

  { x: 3140, y: groundY - 700, width: 35, height: 485, color: "gray", type: "solid" },

  //under spike pit platform
  { x: 2920, y: groundY, width: 200, height: 15, color: "brown", type: "platform" },
  
  //large pillar
  { x: 4550, y: groundY - 125, width: 100, height: 125, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 300, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 475, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 650, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 825, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 1000, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 1175, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 1350, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 1525, width: 100, height: 100, color: "gray", type: "solid" },

  { x: 4550, y: groundY - 1700, width: 100, height: 100, color: "gray", type: "solid" },

  //large pillar platforms
  { x: 4450, y: groundY - 255, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4650, y: groundY - 430, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4450, y: groundY - 605, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4650, y: groundY - 780, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4450, y: groundY - 955, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4650, y: groundY - 1130, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4450, y: groundY - 1305, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4650, y: groundY - 1480, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 4450, y: groundY - 1655, width: 100, height: 15, color: "brown", type: "platform" },

  //after pillar platforms
  { x: 4850, y: groundY - 1700, width: 200, height: 15, color: "brown", type: "platform" },
  
  { x: 5275, y: groundY - 1700, width: 150, height: 15, color: "brown", type: "platform" },

  { x: 5675, y: groundY - 1700, width: 100, height: 15, color: "brown", type: "platform" },

  { x: 6050, y: groundY - 1700, width: 50, height: 15, color: "brown", type: "platform" },

  //after pillar solid area
  { x: 6400, y: groundY - 1700, width: 350, height: 1000, color: "gray", type: "solid" },

  { x: 6500, y: groundY - 600, width: 250, height: 1050, color: "gray", type: "solid" },

  //platforms after fake out 
  { x: 6750, y: groundY - 715, width: 215, height: 15, color: "brown", type: "platform" },

  { x: 6750, y: groundY - 840, width: 215, height: 15, color: "brown", type: "platform" },

  { x: 6750, y: groundY - 965, width: 215, height: 15, color: "brown", type: "platform" },

  { x: 6750, y: groundY - 1090, width: 215, height: 15, color: "brown", type: "platform" },

  { x: 6750, y: groundY - 1215, width: 215, height: 15, color: "brown", type: "platform" },

  { x: 6750, y: groundY - 1340, width: 215, height: 15, color: "brown", type: "platform" },

  //platform befire the finish
  { x: 7615, y: groundY - 1595, width: 100, height: 15, color: "brown", type: "platform" },
];

//goal object
var goal = {
  x: 6550,
  y: groundY - 1760,
  width: 50,
  height: 50,
  color: "yellow"
};

//enemies array (orange cubes)
var enemies = [
  //first jumps
  { x: 775, y: groundY - 70, width: 40, height: 60, color: "orange" },

  { x: 990, y: groundY - 70, width: 40, height: 60, color: "orange" },

  { x: 1205, y: groundY - 70, width: 40, height: 60, color: "orange" },

  //under spike pit enemies
  { x: 2650, y: groundY + 40, width: 40, height: 60, color: "orange" },

  { x: 3350, y: groundY + 40, width: 40, height: 60, color: "orange" },

  //fake out enemy
  { x: 6360, y: groundY - 550, width: 40, height: 60, color: "orange" },

  //before the finish enemies (bottom)
  { x: 7165, y: groundY - 1395, width: 40, height: 60, color: "orange" },

  { x: 7405, y: groundY - 1445, width: 40, height: 60, color: "orange" },

  { x: 7645, y: groundY - 1495, width: 40, height: 60, color: "orange" },

  //(top)
  { x: 7405, y: groundY - 1645, width: 40, height: 60, color: "orange" },
  
  { x: 7165, y: groundY - 1695, width: 40, height: 60, color: "orange" },

  { x: 6925, y: groundY - 1745, width: 40, height: 60, color: "orange" },
];

//spikes array (gray triangles)
var spikes = [
  //cave spikes
  { x: 1905, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 1935, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 1965, y: groundY - 30, width: 30, height: 30, color: "gray" },

  //top of cave spikes
  { x: 2190, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2160, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2130, y: groundY - 280, width: 30, height: 30, color: "gray" },

  { x: 2025, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 1995, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 1965, y: groundY - 280, width: 30, height: 30, color: "gray" },

  { x: 1860, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 1830, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 1800, y: groundY - 280, width: 30, height: 30, color: "gray" },

  //spike pit spikes
  { x: 2420, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2450, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2480, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2510, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2540, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2570, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2600, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2630, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2660, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2690, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2720, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2750, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2780, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2810, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2840, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2870, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2900, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2930, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2960, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 2990, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 3020, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 3050, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 3080, y: groundY - 280, width: 30, height: 30, color: "gray" },
  { x: 3110, y: groundY - 280, width: 30, height: 30, color: "gray" },

  //spikes on under spike pit platform
  { x: 2975, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 3005, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 3035, y: groundY - 30, width: 30, height: 30, color: "gray" },

  //spikes on ground
  { x: 3900, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 3930, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 3960, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 3990, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 4020, y: groundY - 30, width: 30, height: 30, color: "gray" },
  { x: 4050, y: groundY - 30, width: 30, height: 30, color: "gray" },

  //after fake out platform spikes
  { x: 6935, y: groundY - 745, width: 30, height: 30, color: "gray" },
  { x: 6905, y: groundY - 745, width: 30, height: 30, color: "gray" },
  { x: 6875, y: groundY - 745, width: 30, height: 30, color: "gray" },

  { x: 6750, y: groundY - 870, width: 30, height: 30, color: "gray" },
  { x: 6780, y: groundY - 870, width: 30, height: 30, color: "gray" },
  { x: 6810, y: groundY - 870, width: 30, height: 30, color: "gray" },

  { x: 6935, y: groundY - 995, width: 30, height: 30, color: "gray" },
  { x: 6905, y: groundY - 995, width: 30, height: 30, color: "gray" },
  { x: 6875, y: groundY - 995, width: 30, height: 30, color: "gray" },

  { x: 6750, y: groundY - 1120, width: 30, height: 30, color: "gray" },
  { x: 6780, y: groundY - 1120, width: 30, height: 30, color: "gray" },
  { x: 6810, y: groundY - 1120, width: 30, height: 30, color: "gray" },

  { x: 6935, y: groundY - 1245, width: 30, height: 30, color: "gray" },
  { x: 6905, y: groundY - 1245, width: 30, height: 30, color: "gray" },
  { x: 6875, y: groundY - 1245, width: 30, height: 30, color: "gray" },

  { x: 6750, y: groundY - 1370, width: 30, height: 30, color: "gray" },
  { x: 6780, y: groundY - 1370, width: 30, height: 30, color: "gray" },
  { x: 6810, y: groundY - 1370, width: 30, height: 30, color: "gray" },
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

var currentLevel = 2;