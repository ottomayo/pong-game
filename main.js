let canvas = document.getElementById("gameBoard");
let ctx = canvas.getContext("2d");
const player1Score = document.getElementById("player1-score");
const player2Score = document.getElementById("player2-score");

function keyDownHandler(event) {
    if(event.key == "w") { paddle1.upPressed = true; }
    else if(event.key == "s") { paddle1.downPressed = true; }

    if(event.key == "ArrowUp") { paddle2.upPressed = true; }
    else if(event.key == "ArrowDown") { paddle2.downPressed = true; }
}
function keyUpHandler(event) {
    if(event.key == "w") { paddle1.upPressed = false; }
    else if(event.key == "s") { paddle1.downPressed = false; }

    if(event.key == "ArrowUp") { paddle2.upPressed = false; }
    else if(event.key == "ArrowDown") { paddle2.downPressed = false; }
}

function write(text, colour, font, x, y) {
    ctx.font = font;
    ctx.fillStyle = colour;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function reset() {
    ball = new Ball();
    paddle1 = new Paddle(20);
    paddle2 = new Paddle(canvas.width - 40);
}

function randChoice(a, b) {
    const num = Math.random();
    if(num >= 0.5) { return a; }
    else { return b; }
}

function drawScore() {
    player1Score.textContent = paddle1.score;
    player2Score.textContent = paddle2.score;
    write(paddle1.score + ' : ' + paddle2.score, 'black', '30px Arial', canvas.width/2, 50);
}

class Ball {
    constructor() {
        this.speed = 0.9;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = this.speed;
        this.dy = 0-this.speed;
        this.radius = 10;

        this.colour = "#0095DD";
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }

    reset() {
        this.speed = 1;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = this.speed;
        this.dy = 0-this.speed;
    }
}

class Paddle {
    constructor(xval) {
        this.speed = 2;

        this.x = xval;
        this.y = 20;
        this.width = 20;
        this.height = 75;

        this.colour = "black";

        this.upPressed = false;
        this.downPressed = false;

        this.score = 0;
    }

    moveDown() {
        if(this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }
    moveUp() {
        if(this.y > 0) {
            this.y += -this.speed;
        }
    }

    updatePos() {
        if (this.upPressed && this.y > 0) {
            this.moveUp();
        }
        if (this.downPressed && this.y + this.height < canvas.height) {
            this.moveDown();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }
}

let ball = new Ball();
let paddle1 = new Paddle(20);
let paddle2 = new Paddle(canvas.width - 40);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paddle1.updatePos();
    paddle1.draw();
    paddle2.updatePos();
    paddle2.draw();

    // Bounce off the right wall
    if(ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
        paddle2.score += 1;
        // ball.reset();
    }
    // Bounce off the left wall
    if(ball.x + ball.dx > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
        paddle1.score += 1;
        // ball.reset();
    }
    // Bounce off the floor and ceiling
    if(ball.y + ball.dy > canvas.height - ball.radius) {
        ball.dy = -ball.dy;
        ball.y = canvas.height - ball.radius;
    }
    if(ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
        ball.y = ball.radius;
    }

    if((ball.x + ball.dx) - ball.radius < paddle1.x + paddle1.width
        && paddle1.y + paddle1.height > (ball.y + ball.dy)
        && (ball.y + ball.dy) > paddle1.y) {
        ball.dx = -ball.dx;
    }
    if((ball.y + ball.dy) + ball.radius > paddle1.y
        && (ball.y + ball.dy) < paddle1.y + paddle1.height/2
        && (ball.x + ball.dx) < paddle1.x + paddle1.width + ball.radius) {
        ball.dy = -ball.dy;
        ball.y = paddle1.y - ball.radius - 5;
    }

    if((ball.x + ball.dx) + ball.radius > paddle2.x
        && paddle2.y + paddle2.height > (ball.y + ball.dy)
        && (ball.y + ball.dy) > paddle2.y) {
        ball.dx = -ball.dx;
    }

    ball.draw();
    // drawScore();
    player1Score.textContent = paddle1.score;
    player2Score.textContent = paddle2.score;
    write(paddle1.score + ' : ' + paddle2.score, 'black', '30px Arial', canvas.width/2, 50);
    console.log(paddle1.score + ' : ' + paddle2.score);

    ball.x += ball.dx;
    ball.y += ball.dy;
}

function AI() {
    if(ball.y > paddle2.y + paddle2.height/2) {
        paddle2.upPressed = false;
        paddle2.downPressed = true;
    } else if(ball.y < paddle2.y + paddle2.height/2) {
        paddle2.downPressed = false;
        paddle2.upPressed = true;
    }
}

setInterval(draw, 5);
setInterval(AI, 1)
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
