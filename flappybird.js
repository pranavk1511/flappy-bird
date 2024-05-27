const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Images
const backgroundImg = new Image();
backgroundImg.src = 'flappybirdbg.png';

const birdImg = new Image();
birdImg.src = 'flappybird.png';

const topPipeImg = new Image();
topPipeImg.src = 'toppipe.png';

const bottomPipeImg = new Image();
bottomPipeImg.src = 'bottompipe.png';

// Constants
const boardWidth = 360;
const boardHeight = 640;
const birdWidth = 34;
const birdHeight = 24;
const pipeWidth = 64;
const pipeHeight = 512;
const gravity = 0.5; // Reduced gravity

// Bird class
class Bird {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.width = birdWidth;
        this.height = birdHeight;
        this.img = img;
        this.velocityY = 0;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocityY += gravity;
        this.y += this.velocityY;
        this.y = Math.max(this.y, 0); // Prevent bird from going above the canvas
    }

    jump() {
        this.velocityY = -10; // Increased jump height
    }
}

// Pipe class
class Pipe {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.width = pipeWidth;
        this.height = pipeHeight;
        this.img = img;
        this.passed = false;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= 4; // Move pipes to the left
    }
}

// Game logic
let bird = new Bird(boardWidth / 8, boardHeight / 2, birdImg);
let pipes = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
let placePipeInterval;
let gameLoopInterval;

function placePipes() {
    const randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    const openingSpace = boardHeight / 4;

    const topPipe = new Pipe(boardWidth, randomPipeY, topPipeImg);
    pipes.push(topPipe);

    const bottomPipe = new Pipe(boardWidth, randomPipeY + pipeHeight + openingSpace, bottomPipeImg);
    pipes.push(bottomPipe);
}

function collision(bird, pipe) {
    return (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
    );
}

function resetGame() {
    bird = new Bird(boardWidth / 8, boardHeight / 2, birdImg);
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
}

function startGame() {
    gameStarted = true;
    placePipeInterval = setInterval(placePipes, 1500);
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
}

function gameLoop() {
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

    // Update and draw bird
    bird.update();
    bird.draw();

    // Update and draw pipes
    pipes.forEach((pipe, index) => {
        pipe.update();
        pipe.draw();

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (collision(bird, pipe)) {
            gameOver = true;
            clearInterval(placePipeInterval);
            clearInterval(gameLoopInterval);
            ctx.font = '32px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText('Game Over: ' + Math.floor(score), 10, 35);
        }
    });

    if (bird.y > boardHeight) {
        gameOver = true;
        clearInterval(placePipeInterval);
        clearInterval(gameLoopInterval);
        ctx.font = '32px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Game Over: ' + Math.floor(score), 10, 35);
    }

    // Draw score
    if (!gameOver) {
        ctx.font = '32px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(Math.floor(score), 10, 35);
    }
}

// Start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

    // Draw bird
    bird.draw();

    // Draw start message
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Press Enter to Start', 40, boardHeight / 2);
}

// Event listener for keys
document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        if (!gameStarted) {
            startGame();
        }
    } else if (e.code === 'Space') {
        if (gameStarted && !gameOver) {
            bird.jump();
        }
        if (gameOver) {
            resetGame();
            drawStartScreen();
        }
    }
});

// Initial draw
drawStartScreen();
