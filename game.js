const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let selectedCharacter = "labubu";
let gameStarted = false;

const gravity = 0.7;
const keys = {};

const player = {
  x: 100,
  y: 200,
  width: 48,
  height: 48,
  velX: 0,
  velY: 0,
  speed: 5,
  jumping: false
};

const platforms = [
  { x: 0, y: canvas.height - 40, width: 3000, height: 40 },
  { x: 300, y: canvas.height - 150, width: 200, height: 20 },
  { x: 650, y: canvas.height - 260, width: 220, height: 20 },
  { x: 1000, y: canvas.height - 180, width: 220, height: 20 },
  { x: 1450, y: canvas.height - 300, width: 220, height: 20 },
  { x: 1900, y: canvas.height - 220, width: 220, height: 20 }
];

const enemies = [
  { x: 600, y: canvas.height - 88, width: 40, height: 40, dir: 1 },
  { x: 1200, y: canvas.height - 88, width: 40, height: 40, dir: -1 }
];

const coins = [];
for (let i = 0; i < 20; i++) {
  coins.push({
    x: 250 + i * 140,
    y: canvas.height - 120 - (i % 3) * 60,
    collected: false
  });
}

let score = 0;
let cameraX = 0;

function selectCharacter(character) {
  selectedCharacter = character;
  document.getElementById("menu").style.display = "none";
  gameStarted = true;
  initMusic();
  gameLoop();
}

window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  e.preventDefault();
});

window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function mobileControl(id, key) {
  const btn = document.getElementById(id);

  btn.addEventListener("touchstart", () => {
    keys[key] = true;
  });

  btn.addEventListener("touchend", () => {
    keys[key] = false;
  });
}

mobileControl("left", "ArrowLeft");
mobileControl("right", "ArrowRight");
mobileControl("jump", "Space");

function drawPixelCharacter() {
  const x = player.x - cameraX;
  const y = player.y;

  if (selectedCharacter === "labubu") {
    ctx.fillStyle = "#ff77aa";
  } else {
    ctx.fillStyle = "#8b5a2b";
  }

  ctx.fillRect(x, y, 48, 48);

  ctx.fillStyle = "#000";
  ctx.fillRect(x + 10, y + 10, 6, 6);
  ctx.fillRect(x + 30, y + 10, 6, 6);

  ctx.fillRect(x + 16, y + 30, 16, 4);
}

function drawPlatforms() {
  ctx.fillStyle = "#4caf50";

  platforms.forEach((p) => {
    ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
  });
}

function drawCoins() {
  coins.forEach((coin) => {
    if (!coin.collected) {
      ctx.fillStyle = "gold";
      ctx.fillRect(coin.x - cameraX, coin.y, 18, 18);
    }
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
  });
}

function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.x += enemy.dir * 2;

    if (enemy.x < 400 || enemy.x > 2200) {
      enemy.dir *= -1;
    }

    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      score = Math.max(0, score - 20);
      player.x = 100;
      player.y = 100;
    }
  });
}

function checkCoinCollision() {
  coins.forEach((coin) => {
    if (!coin.collected) {
      if (
        player.x < coin.x + 18 &&
        player.x + player.width > coin.x &&
        player.y < coin.y + 18 &&
        player.y + player.height > coin.y
      ) {
        coin.collected = true;
        score += 10;
        beep(700, 0.08);
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
    beep(300, 0.1);
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

  if (player.y > canvas.height) {
    player.x = 100;
    player.y = 100;
  }

  cameraX = player.x - 250;

  checkCoinCollision();
  updateEnemies();
}

function drawBackground() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";

  for (let i = 0; i < 10; i++) {
    ctx.fillRect(i * 300 - cameraX * 0.2, 100, 80, 30);
  }
}

function drawUI() {
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

function gameLoop() {
  if (!gameStarted) return;

  update();

  drawBackground();
  drawPlatforms();
  drawCoins();
  drawEnemies();
  drawPixelCharacter();
  drawUI();

  requestAnimationFrame(gameLoop);
}

function beep(freq, duration) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.frequency.value = freq;
  oscillator.type = "square";

  oscillator.start();

  gainNode.gain.exponentialRampToValueAtTime(
    0.00001,
    audioCtx.currentTime + duration
  );

  oscillator.stop(audioCtx.currentTime + duration);
}

function initMusic() {
  beep(200, 0.05);
}
