// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape superclass
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// Ball class extends Shape
function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY, true);
  this.color = color;
  this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function () {
  if (!this.exists) return;
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  if (!this.exists) return;
  if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
    this.velX = -this.velX;
  }

  if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
    this.velY = -this.velY;
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
  if (!this.exists) return;
  for (let i = 0; i < balls.length; i++) {
    if (!(this === balls[i]) && balls[i].exists) {
      const dx = this.x - balls[i].x;
      const dy = this.y - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[i].size) {
        this.color = balls[i].color = randomRGB();
      }
    }
  }
};

// EvilCircle class
function EvilCircle(x, y) {
  Shape.call(this, x, y, 20, 20, true);
  this.color = "white";
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
  if ((this.x + this.size) >= width) this.x = width - this.size;
  if ((this.x - this.size) <= 0) this.x = this.size;
  if ((this.y + this.size) >= height) this.y = height - this.size;
  if ((this.y - this.size) <= 0) this.y = this.size;
};

EvilCircle.prototype.setControls = function () {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "a":
      case "ArrowLeft":
        this.x -= this.velX;
        break;
      case "d":
      case "ArrowRight":
        this.x += this.velX;
        break;
      case "w":
      case "ArrowUp":
        this.y -= this.velY;
        break;
      case "s":
      case "ArrowDown":
        this.y += this.velY;
        break;
    }
  });
};

EvilCircle.prototype.collisionDetect = function () {
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      const dx = this.x - balls[i].x;
      const dy = this.y - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[i].size) {
        balls[i].exists = false;
        score++;
        para.textContent = "Score: " + score;
      }
    }
  }
};

// Create balls
let balls = [];
while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

// Create EvilCircle
let evilCircle = new EvilCircle(width / 2, height / 2);
evilCircle.setControls();

// Score display
let score = 0;
const para = document.createElement("p");
para.style.position = "fixed";
para.style.color = "white";
para.style.fontSize = "20px";
para.style.left = "10px";
para.style.top = "10px";
para.textContent = "Score: 0";
document.body.appendChild(para);

// Animation loop
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
