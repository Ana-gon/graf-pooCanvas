// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color  || 'white';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // ColisiÃ³n con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia direcciÃ³n al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automÃ¡tica (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
    this.ball = new Ball(canvas.width / 1, canvas.height / 5, 50, 4, 4, 'red');
    this.ball2 = new Ball(canvas.width / 3, canvas.height / 3, 20, 4, 4, "blue");
    this.ball3 = new Ball(canvas.width / 5, canvas.height / 4, 10, 4, 4, "green");
    this.ball4 = new Ball(canvas.width / 2, canvas.height / 5, 12, 4, 4, "purple");
    this.ball5 = new Ball(canvas.width / 9, canvas.height / 6, 5, 4, 4, "orange");

    this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 200, true); // jugador
    this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // CPU
    this.keys = {}; // Para capturar las teclas
}
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ball.draw();
        this.ball2.draw();
        this.ball3.draw();
        this.ball4.draw();
        this.ball5.draw();

        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        let balls = [this.ball, this.ball2, this.ball3, this.ball4, this.ball5];
        // this.ball.move();
        // this.ball2.move();
        // this.ball3.move();
        // this.ball4.move();
        // this.ball5.move();

        // Mover cada pelota
        balls.forEach(ball => ball.move());

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.ball);

        // Colisiones con las paletas
    
        balls.forEach(ball => {
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Detectar cuando la pelota sale de los bordes (punto marcado)
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();