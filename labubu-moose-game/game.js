const canvas = document.getElementById("game");

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

  // Camera follow
  cameraX = player.x - 250;

  checkCoinCollision();
}

function drawBackground() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // clouds
  ctx.fillStyle = "white";

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(i * 300 - (cameraX * 0.2), 100, 40, 0, Math.PI * 2);
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

// Prevent the page from intercepting spacebar scrolling
window.addEventListener("keydown", (e) => {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
});

// Ensure canvas is visible
canvas.style.display = "block";
