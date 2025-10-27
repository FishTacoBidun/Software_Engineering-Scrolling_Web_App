//game display
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//health system
let playerHealth = 3;
let lastHealthCheckTime = 0;
const HEALTH_CHECK_INTERVAL = 100; //check every 100ms to prevent infinite loops

//Health system interface (simulates health.txt)
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
const START_X = 100;
const START_Y = 400;

//player setup
const player = 
{
  x: START_X,
  y: START_Y,
  width: 40,
  height: 40,
  color: "red",
  velocityX: 0,
  velocityY: 0,
  speed: 6,
  jumping: false,
  gravity: 0.8,
  jumpForce: -15,
};

//controls
const keys = { a: false, d: false, space: false };

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

//check if player has fallen below the map
function checkVoidCollision(player) {
  //if player falls below the base height, they hit the void
  if (player.y > BASE_HEIGHT + 100) {
    //write damage to function
    HealthSystem.writeDamage(1);
    return true;
  }
  return false;
}

//game logic
function update() 
{
  //check for void collision (player falling below map)
  if (checkVoidCollision(player)) {}
  
  //check health system
  const currentTime = Date.now();
  if (currentTime - lastHealthCheckTime >= HEALTH_CHECK_INTERVAL) {
    if (typeof HealthSystem !== 'undefined' && HealthSystem.hasPendingDamage) {
      const damage = HealthSystem.readDamage();
      if (damage > 0) {
        playerHealth -= damage;
        console.log(`Player took ${damage} damage! Health: ${playerHealth}`);
        
        //if health depleted, reset player
        if (playerHealth <= 0) {
          playerHealth = 3;
          player.x = START_X;
          player.y = START_Y;
          player.velocityX = 0;
          player.velocityY = 0;
          player.jumping = false;
          console.log("Player reset! Health restored to 3.");
        }
      }
      lastHealthCheckTime = currentTime;
    }
  }
  
  //store previous position for collision detection
  const prevY = player.y;
  const prevX = player.x;

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

  //surface collision
  let onSurface = false;

  for (const s of surfaces) {
    //check horizontal overlap
    const horizontalOverlap = 
      player.x + player.width > s.x &&
      player.x < s.x + s.width;

    if (!horizontalOverlap) continue;

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
        break;
      }
    }
    //solid platform for ground and solids
    else if (s.type === "solid" || s.type === "ground") 
    {
      //check if player intersects with the solid platform
      const verticalOverlap =
        player.y + player.height > s.y &&
        player.y < s.y + s.height;

      if (verticalOverlap) 
      {
        //determine collision direction based on smallest overlap
        const overlapX = Math.min(
          player.x + player.width - s.x,
          s.x + s.width - player.x
        );
        const overlapY = Math.min(
          player.y + player.height - s.y,
          s.y + s.height - player.y
        );

        if (overlapX < overlapY) 
        {
          //horizontal collision
          if (player.x < s.x) 
          {
            player.x = s.x - player.width;
          } else {
            player.x = s.x + s.width;
          }
          player.velocityX = 0;
        } else {
          //vertical collision
          if (player.y < s.y) 
          {
            //hit bottom of platform
            player.y = s.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            onSurface = true;
          } else {
            //hit top of platform
            player.y = s.y + s.height;
            player.velocityY = 0;
          }
        }
        break;
      }
    }
  }

  //if player isn't on a surface, keep falling
  if (!onSurface) 
  {
    player.jumping = true;
  }
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
  
  //draw health
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Health: ${playerHealth}/3`, 10, 30);
  
  //apply scaling for game elements
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  //draw surfaces
  for (const s of surfaces) {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, s.width, s.height);
  }

  //draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.restore();
}

//game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();