//game display
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("levelSelectMenu");
const pauseButton = document.getElementById("pauseButton");
const pauseOverlay = document.getElementById("pauseOverlay");
const levelCompleteOverlay = document.getElementById("levelCompleteOverlay");
const levelCompleteTime = document.getElementById("levelCompleteTime");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//API configuration
const API_BASE_URL = 'http://localhost:3000/api';
let currentLevelNum = null; //track current level
let loadedLevelScript = null; //track loaded level script for cleanup
let isGameRunning = false; //track if game loop is running
let isPaused = false; //track if game is paused
let initialEnemies = null; //store initial enemies state for reset
let initialSpikes = null; // Store initial spikes state for reset
let levelStartTime = null; //track when level started
let lastPauseTime = null; //track when game was paused

//health system
let playerHealth = 3;
let lastHealthCheckTime = 0;
const HEALTH_CHECK_INTERVAL = 100; //check every 100ms to prevent infinite loops
let lastDamageTime = 0;
const DAMAGE_COOLDOWN = 1000; //1 second cooldown between damage
let invulnerableUntil = 0; //timestamp until which player is invulnerable

//health system interface
const HealthSystem = {
  healthValue: 0,
  hasPendingDamage: false,
  
  //writes damage
  writeDamage(damage) {
    this.healthValue = damage;
    this.hasPendingDamage = true;
  },
  
  //reads damage
  readDamage() {
    const damage = this.healthValue;
    this.healthValue = 0; //clear damage
    this.hasPendingDamage = false;
    return damage;
  }
};

//starting position
const START_X = 100; //100
const START_Y = 400; //400

//player setup and physics
const player = 
{
  x: START_X,
  y: START_Y,
  width: 40,
  height: 40,
  color: "red",
  velocityX: 0,
  velocityY: 0,
  speed: 7,
  jumping: false,
  gravity: 0.8,
  jumpForce: -15,
};

//controls
const keys = { a: false, d: false, space: false };

//left, right, and jump
document.addEventListener("keydown", (e) => 
{
  if (e.code === "KeyA") keys.a = true;
  if (e.code === "KeyD") keys.d = true;
  if (e.code === "Space") keys.space = true;
});

document.addEventListener("keyup", (e) => 
{
  if (e.code === "KeyA") keys.a = false;
  if (e.code === "KeyD") keys.d = false;
  if (e.code === "Space") keys.space = false;
});

//handle window resizing
window.addEventListener("resize", () => 
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//camera setup
const camera = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

//check if player has fallen below the map
function checkVoidCollision(player) {
  //if player falls below the base height, they hit the void
  if (player.y > BASE_HEIGHT + 100) {
    //write damage to function
    HealthSystem.writeDamage(3);
    return true;
  }
  return false;
}

//check if player reached the goal
function checkGoalCollision(player) {
  if (typeof goal !== 'undefined') {
    //check if player interacts with goal
    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
      return true;
    }
  }
  return false;
}


//unlock next level via API
async function unlockNextLevel(levelNum) {
  if (levelNum <= 0 || levelNum >= 3) return; //skip tutorial level (level 0) and no next level after level 3
  
  try {
    const response = await fetch(`${API_BASE_URL}/levels/${levelNum + 1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unlocked: true })
    });
    
    if (response.ok) {
      console.log(`Level ${levelNum + 1} unlocked!`);
      //refresh the menu buttons
      refreshLevelButtons();
    } else {
      console.error('Failed to unlock next level');
    }
  } catch (error) {
    console.error('Error unlocking next level:', error);
  }
}

//pause game
function pauseGame() {
  if (!isPaused) {
    isPaused = true;
    pauseOverlay.style.display = "flex";
    //track when we paused to subtract paused time
    lastPauseTime = Date.now();
  }
}

//resume game
function resumeGame() {
  if (isPaused) {
    isPaused = false;
    pauseOverlay.style.display = "none";
    //adjust levelStartTime to account for paused time
    if (lastPauseTime !== null && levelStartTime !== null) {
      const pausedDuration = Date.now() - lastPauseTime;
      levelStartTime += pausedDuration; //shift start time forward by paused duration
      lastPauseTime = null;
    }
  }
}

//format time helper function
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

//show level complete screen
function showLevelComplete() {
  //calculate final total elapsed time
  const currentTime = Date.now();
  let finalTime = 0;
  
  if (levelStartTime !== null) {
    //calculate time since level start
    finalTime = currentTime - levelStartTime;
    
    //subtract any currently paused time
    if (isPaused && lastPauseTime !== null) {
      finalTime -= (currentTime - lastPauseTime);
    }
  }
  
  //format and display time
  const formattedTime = formatTime(finalTime);
  levelCompleteTime.textContent = `Time: ${formattedTime}`;
  
  //show overlay
  levelCompleteOverlay.style.display = "flex";
  
  //stop the game loop
  stopGameLoop();
}

//go to next level
function goToNextLevel() {
  if (currentLevelNum === null) return;
  
  //hide level complete overlay
  levelCompleteOverlay.style.display = "none";
  
  //determine next level
  let nextLevel = currentLevelNum + 1;
  
  //if we're at level 3, go back to menu
  if (nextLevel > 3) {
    returnToMenu();
    return;
  }
  
  //load next level
  loadLevel(nextLevel);
}

//restart level
function restartLevel() {
  if (confirm("Are you sure you want to restart the level?")) {
    resumeGame();
    //reset player position and state
    player.x = START_X;
    player.y = START_Y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.jumping = false;
    playerHealth = 3;
    lastDamageTime = 0;
    invulnerableUntil = 0;
    
    //reset enemies and spikes
    if (initialEnemies) {
      enemies.length = 0;
      enemies.push(...initialEnemies.map(e => ({...e})));
    }
    if (initialSpikes) {
      spikes.length = 0;
      spikes.push(...initialSpikes.map(s => ({...s})));
    }
  }
}

//return to main menu
function returnToMenu() {
  //stop the game loop
  stopGameLoop();
  
  //reset pause state
  isPaused = false;
  pauseOverlay.style.display = "none";
  levelCompleteOverlay.style.display = "none";
  
  //reset time tracking
  levelStartTime = null;
  lastPauseTime = null;
  
  //reset player position and state
  player.x = START_X;
  player.y = START_Y;
  player.velocityX = 0;
  player.velocityY = 0;
  player.jumping = false;
  playerHealth = 3;
  lastDamageTime = 0;
  invulnerableUntil = 0;
  
  //reset enemies (reload level to restore enemies)
  if (typeof enemies !== 'undefined' && Array.isArray(enemies)) {
    //enemies will be reset when level is reloaded
  }
  
  //hide canvas and pause button, show menu
  canvas.style.display = "none";
  pauseButton.style.display = "none";
  menu.style.display = "flex";
  
  //refresh button states
  refreshLevelButtons();
}

//game logic
function update() 
{
  //check for void collision (player falling below map)
  if (checkVoidCollision(player)) {}
  
  //check for goal collision
  if (checkGoalCollision(player)) {
    console.log(`Level ${currentLevelNum} completed!`);
    //only unlock next level if not tutorial (level 0)
    if (currentLevelNum > 0) {
      unlockNextLevel(currentLevelNum);
    }
    showLevelComplete();
    return;
  }
  
  //store previous position for collision detection (before movement)
  const prevY = player.y;
  const prevX = player.x;
  
  //check health system
  const currentTime = Date.now();
  if (currentTime - lastHealthCheckTime >= HEALTH_CHECK_INTERVAL) {
    if (HealthSystem.hasPendingDamage) {
      const damage = HealthSystem.readDamage();

      //only process if we actually have damage
      if (damage > 0) {
        const willBeFatal = (playerHealth - damage) <= 0;
        //check if we're invulnerable (only allow damage if fatal or invulnerability expired)
        if (willBeFatal || currentTime >= invulnerableUntil) {
          playerHealth -= damage;
          console.log(`Player took ${damage} damage! Health: ${playerHealth}`);

          if (playerHealth <= 0) {
            //fatal damage = reset player and level
            playerHealth = 3;
            player.x = START_X;
            player.y = START_Y;
            player.velocityX = 0;
            player.velocityY = 0;
            player.jumping = false;
            lastDamageTime = 0; //legacy cooldown reset
            invulnerableUntil = 0; //clear i-frames
            //reset enemies and spikes
            if (initialEnemies) {
              enemies.length = 0;
              enemies.push(...initialEnemies.map(e => ({...e})));
            }
            if (initialSpikes) {
              spikes.length = 0;
              spikes.push(...initialSpikes.map(s => ({...s})));
            }
            console.log("Player reset! Health restored to 3.");
          } else {
            //grant 1s invulnerability after non-fatal hit
            lastDamageTime = currentTime; //legacy, can be removed later
            invulnerableUntil = currentTime + 1000;
          }
        }
      }
    }
    lastHealthCheckTime = currentTime;
  }

  //horizontal movement
  if (keys.a) player.velocityX = -player.speed;
  else if (keys.d) player.velocityX = player.speed;
  else player.velocityX = 0;

  //jumping
  if (keys.space && !player.jumping) 
  {
    player.velocityY = player.jumpForce;
    player.jumping = true;
  }

  //gravity
  player.velocityY += player.gravity;
  player.x += player.velocityX;
  player.y += player.velocityY;

  //check enemy collisions before surface collisions (so landing on enemies works correctly)
  let enemyKilled = false;
  if (typeof enemies !== 'undefined' && enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      
      //check if player intersects with enemy
      if (player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y) {
        
        const playerBottom = player.y + player.height;
        const prevBottom = prevY + player.height;
        const wasAbove = prevBottom <= enemy.y;
        const isBelowTop = playerBottom >= enemy.y;
        const fallingDown = player.velocityY >= 0;
  
        if (wasAbove && isBelowTop && fallingDown) {
          //player landed on top = kill enemy and bounce
          player.y = enemy.y - player.height;
          player.velocityY = -12;
          player.jumping = false;
          enemies.splice(i, 1);
          enemyKilled = true;
          console.log("Enemy defeated!");
          break;
        } else {
          //player hit from side or bottom = take damage
          const currentTime = Date.now();
          if (currentTime >= invulnerableUntil) {
            HealthSystem.writeDamage(1);
          }
        }
      }
    }
  }
  
  //check spike collisions (before surface collisions)
  if (typeof spikes !== 'undefined' && spikes) {
    for (const spike of spikes) {
      //check if player intersects with spike
      if (player.x < spike.x + spike.width &&
          player.x + player.width > spike.x &&
          player.y < spike.y + spike.height &&
          player.y + player.height > spike.y) {
        //take damage from any side
        const currentTime = Date.now();
        if (currentTime >= invulnerableUntil) {
          HealthSystem.writeDamage(1);
        }
      }
    }
  }

  //surface collision
  let onSurface = false;

  for (const s of surfaces) {
    //pass-through platform
    if (s.type === "platform") {
      const playerBottom = player.y + player.height;
      const prevBottom = prevY + player.height;
    
      //only check collision if horizontally overlapping
      const horizontalOverlap =
        player.x + player.width > s.x && player.x < s.x + s.width;
      if (!horizontalOverlap) continue;
    
      //landing condition
      const wasAbove = prevBottom <= s.y;
      const isBelowTop = playerBottom >= s.y;
      const fallingDown = player.velocityY >= 0;
    
      if (wasAbove && isBelowTop && fallingDown) 
      {
        //snap player onto platform surface
        player.y = s.y - player.height;
        player.velocityY = 0;
        player.jumping = false;
        onSurface = true;
      }
    }
    //solid platform for ground and solids
    else if (s.type === "solid" || s.type === "ground") 
    {
      // Axis-aligned bounding box (AABB) collision detection
      const nextX = player.x + player.velocityX;
      const nextY = player.y + player.velocityY;

      //check if player will intersect with surface next frame
      const willIntersect =
        nextX < s.x + s.width &&
        nextX + player.width > s.x &&
        nextY < s.y + s.height &&
        nextY + player.height > s.y;

      if (willIntersect) {
        //compute overlap amounts
        const overlapX1 = (player.x + player.width) - s.x; //overlap from left
        const overlapX2 = (s.x + s.width) - player.x; //overlap from right
        const overlapY1 = (player.y + player.height) - s.y; //overlap from top
        const overlapY2 = (s.y + s.height) - player.y; //overlap from bottom

        //determine smallest overlap
        const minOverlapX = Math.min(overlapX1, overlapX2);
        const minOverlapY = Math.min(overlapY1, overlapY2);

        if (minOverlapX + 0.1 < minOverlapY) {
          //horizontal collision
          if (overlapX1 < overlapX2) {
            //hit wall on the left
            player.x = s.x - player.width;
          } else {
            //hit wall on the right
            player.x = s.x + s.width;
          }
          player.velocityX = 0;
        } else {
          //vertical collision
          if (overlapY1 < overlapY2) {
            //landed on top
            player.y = s.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            onSurface = true;
          } else {
            //hit from below
            player.y = s.y + s.height;
            player.velocityY = 0;
          }
        }
      }
    }
  }

  //if player isn't on a surface, keep falling
  if (!onSurface && !enemyKilled) 
  {
    player.jumping = true;
  }

  //update camera viewport to match world units and center on player
  if (typeof BASE_WIDTH !== "undefined") camera.width = BASE_WIDTH;
  if (typeof BASE_HEIGHT !== "undefined") camera.height = BASE_HEIGHT;

  //center camera on the player's midpoint (x) and bias vertically so player appears ~3/4 down the screen
  camera.x = player.x + player.width / 2 - camera.width / 2;
  camera.y = player.y + player.height / 2 - camera.height * 0.60;
}

//render game
function draw() {
  //compute scale and centering
  const scaleX = canvas.width / BASE_WIDTH;
  const scaleY = canvas.height / BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (canvas.width - BASE_WIDTH * scale) / 2;
  const offsetY = (canvas.height - BASE_HEIGHT * scale) / 2;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  //apply scaling for game elements
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  //apply camera offset
  ctx.translate(-camera.x, -camera.y);

  //draw surfaces
  for (const s of surfaces) {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, s.width, s.height);
  }

  //draw enemies (orange cubes)
  if (typeof enemies !== 'undefined' && enemies) {
    for (const enemy of enemies) {
      ctx.fillStyle = enemy.color || "orange";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }

  //draw spikes (gray triangles)
  if (typeof spikes !== 'undefined' && spikes) {
    for (const spike of spikes) {
      ctx.fillStyle = spike.color || "gray";
      ctx.beginPath();
      //draw triangle pointing up
      ctx.moveTo(spike.x + spike.width / 2, spike.y); //top point
      ctx.lineTo(spike.x, spike.y + spike.height); //bottom left
      ctx.lineTo(spike.x + spike.width, spike.y + spike.height); //bottom right
      ctx.closePath();
      ctx.fill();
    }
  }

  //draw goal if it exists
  if (typeof goal !== 'undefined') {
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
  }

  //draw player
  const currentTime = Date.now();
  let playerAlpha = 1.0;
  if (currentTime < invulnerableUntil) {
    //flash effect: alternate between 0.3 and 1.0 opacity every 100ms for invulnerability frames
    const timeSinceHit = currentTime - (invulnerableUntil - 1000);
    const flashCycle = Math.floor(timeSinceHit / 100);
    playerAlpha = (flashCycle % 2 === 0) ? 0.3 : 1.0;
  }
  
  ctx.globalAlpha = playerAlpha;
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.globalAlpha = 1.0; //reset alpha

  //draw tutorial text
  if (typeof tutorialTexts !== 'undefined' && Array.isArray(tutorialTexts)) {
    for (const textObj of tutorialTexts) {
      //set text properties from object or use defaults
      ctx.font = textObj.fontSize || "20px Arial";
      ctx.fillStyle = textObj.color || "white";
      ctx.textAlign = textObj.align || "center";
      ctx.strokeStyle = textObj.strokeColor || "black";
      ctx.lineWidth = textObj.strokeWidth !== undefined ? textObj.strokeWidth : 2;
      
      const x = textObj.x || 0;
      const y = textObj.y || 0;
      const text = textObj.text || "";
      
      //draw text with stroke for visibility
      if (ctx.lineWidth > 0) {
        ctx.strokeText(text, x, y);
      }
      ctx.fillText(text, x, y);
    }
  }

  ctx.restore();
  
  //draw UI elements on top
  ctx.save();
  
  //draw health (top left)
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Health: ${playerHealth}/3`, 10, 30);
  
  //draw timer (top center)
  if (levelStartTime !== null) {
    const currentTime = Date.now();
    let elapsedTime = currentTime - levelStartTime;
    
    //subtract any currently paused time
    if (isPaused && lastPauseTime !== null) {
      elapsedTime -= (currentTime - lastPauseTime);
    }
    
    const formattedTime = formatTime(elapsedTime);
    ctx.textAlign = "center";
    ctx.fillText(formattedTime, canvas.width / 2, 30);
  }
  
  ctx.restore();
}

//game loop
let animationFrameId = null;
function gameLoop() {
  if (!isGameRunning) return;
  
  if (!isPaused) {
    update();
  }
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

//stop game loop
function stopGameLoop() {
  isGameRunning = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

//level loading function
function loadLevel(levelNumber) {
  //stop any running game loop
  stopGameLoop();
  
  //store current level number
  currentLevelNum = parseInt(levelNumber);
  
  //remove previously loaded level script if it exists
  if (loadedLevelScript) {
    loadedLevelScript.remove();
    loadedLevelScript = null;
  }
  
  //hide menu and show canvas and pause button
  menu.style.display = "none";
  canvas.style.display = "block";
  pauseButton.style.display = "block";
  
  //reset pause state
  isPaused = false;
  pauseOverlay.style.display = "none";
  levelCompleteOverlay.style.display = "none";
  
  //reset time tracking
  levelStartTime = Date.now();
  lastPauseTime = null;
  
  //dynamically load the level file with cache busting
  const script = document.createElement("script");
  script.src = `level${levelNumber}.js?t=${Date.now()}`;
  script.onload = () => {
    //initialize enemies and spikes arrays if they don't exist
    if (typeof enemies === 'undefined') {
      window.enemies = [];
    }
    if (typeof spikes === 'undefined') {
      window.spikes = [];
    }
    //store initial state of enemies and spikes for reset
    if (enemies && Array.isArray(enemies)) {
      initialEnemies = enemies.map(e => ({...e}));
    } else {
      initialEnemies = [];
    }
    if (spikes && Array.isArray(spikes)) {
      initialSpikes = spikes.map(s => ({...s}));
    } else {
      initialSpikes = [];
    }
    //reset player state
    player.x = START_X;
    player.y = START_Y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.jumping = false;
    playerHealth = 3;
    lastDamageTime = 0;
    //set flag and start game loop after level is loaded
    isGameRunning = true;
    gameLoop();
  };
  loadedLevelScript = script; //track this script for cleanup
  document.body.appendChild(script);
}

//get level select buttons
const levelButtons = document.querySelectorAll(".level-button");

//set up level select button listeners
levelButtons.forEach(button => {
  button.addEventListener("click", () => {
    const levelNumber = button.getAttribute("data-level");
    loadLevel(levelNumber);
  });
});

//fetch level statuses and update buttons
async function refreshLevelButtons() {
  try {
    const response = await fetch(`${API_BASE_URL}/levels`);
    if (response.ok) {
      const levels = await response.json();
      
      //update each button based on unlock status
      levelButtons.forEach(button => {
        const levelNum = parseInt(button.getAttribute("data-level"));
        const level = levels.find(l => l.levelId === levelNum);
        
        if (level && level.unlocked) {
          button.disabled = false;
          button.classList.remove("locked");
          button.classList.add("unlocked");
        } else {
          button.disabled = true;
          button.classList.remove("unlocked");
          button.classList.add("locked");
        }
      });
    }
  } catch (error) {
    console.error('Error fetching level statuses:', error);
    //on error, unlock level 1 by default
    levelButtons.forEach(button => {
      const levelNum = parseInt(button.getAttribute("data-level"));
      if (levelNum === 1) {
        button.disabled = false;
        button.classList.remove("locked");
        button.classList.add("unlocked");
      } else {
        button.disabled = true;
        button.classList.remove("unlocked");
        button.classList.add("locked");
      }
    });
  }
}

//reset progress function
async function resetProgress() {
  try {
    //lock levels 2 and 3
    const response2 = await fetch(`${API_BASE_URL}/levels/2`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unlocked: false })
    });
    
    const response3 = await fetch(`${API_BASE_URL}/levels/3`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unlocked: false })
    });
    
    if (response2.ok && response3.ok) {
      console.log('Progress reset successfully');
      refreshLevelButtons();
    } else {
      console.error('Failed to reset progress');
    }
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
}

//set up reset button
const resetButton = document.getElementById("resetProgressButton");
if (resetButton) {
  resetButton.addEventListener("click", resetProgress);
}

//initialize button states on page load
refreshLevelButtons();

//tutorial button event listener
const tutorialButton = document.getElementById("tutorialButton");
if (tutorialButton) {
  tutorialButton.addEventListener("click", () => {
    loadLevel(0);
  });
}

//pause button event listener
pauseButton.addEventListener("click", () => {
  if (isGameRunning && !isPaused) {
    pauseGame();
  }
});

//pause menu option event listeners
document.getElementById("resumeOption").addEventListener("click", () => {
  resumeGame();
});

document.getElementById("restartOption").addEventListener("click", () => {
  restartLevel();
});

document.getElementById("exitOption").addEventListener("click", () => {
  returnToMenu();
});

//level complete menu option event listeners
document.getElementById("nextLevelOption").addEventListener("click", () => {
  goToNextLevel();
});

document.getElementById("mainMenuOption").addEventListener("click", () => {
  returnToMenu();
});