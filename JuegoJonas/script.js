const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameOver = false;

canvas.width = 400;
canvas.height = 600;

let car = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 50,
    speed: 25
};

let obstacles = [];
let signals = [];
let score = 0;

let lanes = [canvas.width / 4, canvas.width / 2, 3 * canvas.width / 4];

let lastObstacleY = [canvas.height, canvas.height, canvas.height];

function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function moveCar(event) {
    if (event.key === 'ArrowLeft' && car.x > 0) {
        car.x -= car.speed;
    }
    if (event.key === 'ArrowRight' && car.x < canvas.width - car.width) {
        car.x += car.speed;
    }
}

function generateObstacles() {
    let freeLaneIndex = Math.floor(Math.random() * lanes.length);
    let y = -car.height;
    let width = 30;
    let height = 30;
    let speed = 3;

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
        if (laneIndex !== freeLaneIndex) {
            if (lastObstacleY[laneIndex] > car.height + y) {
                obstacles.push({ x: lanes[laneIndex], y, width, height, speed });
                lastObstacleY[laneIndex] = y;
            }
        }
    }
}

function moveObstacles() {
    obstacles.forEach((obs, index) => {
        obs.y += obs.speed;
        lastObstacleY[index] = obs.y;
    });
    obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function detectCollisions() {
    obstacles.forEach(obs => {
        if (car.x < obs.x + obs.width &&
            car.x + car.width > obs.x &&
            car.y < obs.y + obs.height &&
            car.y + car.height > obs.y) {
            endGame();
        } else {
            score++;
        }
    });
}

function updateGame() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCar();
        drawObstacles();
        moveObstacles();
        detectCollisions();
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);
    }
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('¡Juego terminado!', canvas.width / 2, canvas.height / 2);
}

document.addEventListener('keydown', moveCar);

// Actualiza el juego cada 20 milisegundos
setInterval(updateGame, 20);

// Genera obstáculos cada 2 segundos
setInterval(generateObstacles, 4000);