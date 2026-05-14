const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let selectedCharacter = "labubu";

function selectCharacter(character) {
  selectedCharacter = character;
  document.getElementById("menu").style.display = "none";
  startGame();
}

const gravity = 0.7;

const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 60,
  velX: 0,
  velY: 0,
  speed: 5,
  jumping: false,
};

const keys = {};

const platforms = [
  { x: 0, y: canvas.height - 50, width: 2000, height: 50 },
  { x: 300, y: canvas.height - 180, width: 200, height: 20 },
  { x: 650, y: canvas.height - 300, width: 220, height: 20 },
  { x: 1050, y: canvas.height - 220, width: 220, height: 20 },
];

const coins = [
  { x: 350, y: canvas.height - 220, collected: false },
  { x: 720, y: canvas.height - 340, collected: false },
  { x: 1100, y: canvas.height - 260, collected: false },
];

let score = 0;
let cameraX = 0;

window.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (
    ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
      e.code
    )
  ) {
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function drawPlayer() {
  ctx.save();

  ctx.translate(player.x - cameraX, player.y);

  if (selectedCharacter === "labubu") {
    ctx.fillStyle = "#ff77aa";

    ctx.beginPath();
    ctx.arc(25, 20, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, 5);
    ctx.lineTo(0, -20);
    ctx.lineTo(15, -5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(40, 5);
    ctx.lineTo(50, -20);
    ctx.lineTo(35, -5);
    ctx.fill();

    ctx.fillRect(10, 35, 30, 25);
  } else {
    ctx.fillStyle = "#8b5a2b";

    ctx.fillRect(10, 0, 30, 30);

    ctx.strokeStyle = "#5c3a1e";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(10, 5);
    ctx.lineTo(0, -10);
    ctx.moveTo(40, 5);
    ctx.lineTo(50, -10);
    ctx.stroke();

    ctx.fillRect(5, 30, 40, 30);
  }

  ctx.restore();
}

function drawPlatforms() {
  ctx.fillStyle = "#4caf50";

  platforms.forEach((platform) => {
    ctx.fillRect(
      platform.x - cameraX,
      platform.y,
      platform.width,
      platform.height
    );
  });
}

function drawCoins() {
  coins.forEach((coin) => {
    if (!coin.collected) {
      ctx.beginPath();
      ctx.arc(coin.x - cameraX, coin.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
    }
  });
}

function checkCoinCollision() {
  coins.forEach((coin) => {
    if (!coin.collected) {
      const dx = player.x + player.width / 2 - coin.x;
      const dy = player.y + player.height / 2 - coin.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        coin.collected = true;
        score += 10;
      }
    }
  });
}

function update() {
  if (keys["ArrowRight"]) {
    player.velX = player.speed;
  } else if (keys["ArrowLeft"]) {
    player.velX = -player.speed;
  } else {
    player.velX = 0;
  }

  if (keys["Space"] && !player.jumping) {
    player.velY = -14;
    player.jumping = true;
  }

  player.velY += gravity;

  player.x += player.velX;
  player.y += player.velY;

  player.jumping = true;

  platforms.forEach((platform) => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height < platform.y + 20 &&
      player.y + player.height + player.velY >= platform.y
    ) {
      player.y = platform.y - player.height;
      player.velY = 0;
      player.jumping = false;
    }
  });

  cameraX = player.x - 250;

  checkCoinCollision();
}

function drawBackground() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(i * 300 - cameraX * 0.2, 100, 40, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawUI() {
  ctx.fillStyle = "black";
  ctx.font = "28px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

function gameLoop() {
  update();

  drawBackground();
  drawPlatforms();
  drawCoins();
  drawPlayer();
  drawUI();

  requestAnimationFrame(gameLoop);
}

function startGame() {
  canvas.style.display = "block";
  gameLoop();
}
