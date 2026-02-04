const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle
const paddleWidth = 12;
const paddleHeight = 90;
const paddleSpeed = 6;

// Player paddle (left)
let playerY = HEIGHT / 2 - paddleHeight / 2;

// AI paddle (right)
let aiY = HEIGHT / 2 - paddleHeight / 2;
const aiSpeed = 4; // lower = easier, higher = harder

// Ball
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballRadius = 7;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Score
let playerScore = 0;
let aiScore = 0;

// Controls
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Reset
document.getElementById("resetBtn").onclick = resetGame;

function resetGame() {
  playerScore = 0;
  aiScore = 0;
  resetBall();
}

function resetBall() {
  ballX = WIDTH / 2;
  ballY = HEIGHT / 2;
  ballSpeedX *= -1;
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5;
}

// Drawing
function drawPaddle(x, y) {
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
  ctx.shadowBlur = 0;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawCenterLine() {
  ctx.fillStyle = "#1f2a40";
  for (let y = 0; y < HEIGHT; y += 20) {
    ctx.fillRect(WIDTH / 2 - 2, y, 4, 10);
  }
}

function drawScore() {
  ctx.font = "40px Consolas";
  ctx.fillStyle = "white";
  ctx.fillText(playerScore, WIDTH / 4, 50);
  ctx.fillText(aiScore, WIDTH * 3 / 4, 50);
}

// Game logic
function update() {
  // Player movement
  if (keys["w"] && playerY > 0) playerY -= paddleSpeed;
  if (keys["s"] && playerY < HEIGHT - paddleHeight) playerY += paddleSpeed;

  // AI movement (tracks ball with delay)
  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 10) aiY += aiSpeed;
  else if (aiCenter > ballY + 10) aiY -= aiSpeed;

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision
  if (ballY <= 0 || ballY >= HEIGHT) ballSpeedY *= -1;

  // Player paddle collision
  if (
    ballX - ballRadius <= 52 &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // AI paddle collision
  if (
    ballX + ballRadius >= WIDTH - 52 &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // Scoring
  if (ballX < 0) {
    aiScore++;
    resetBall();
  }

  if (ballX > WIDTH) {
    playerScore++;
    resetBall();
  }
}

// Render
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawCenterLine();
  drawPaddle(40, playerY);
  drawPaddle(WIDTH - 52, aiY);
  drawBall();
  drawScore();
}

// Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
