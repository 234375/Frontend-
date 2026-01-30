const board = document.getElementById("game-board");
    const instruction = document.getElementById("instruction-text");
    const logo = document.getElementById("logo");
    const scoreEl = document.getElementById("score");
    const highscoreEl = document.getElementById("highscore");

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = null;
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let interval = null;
    let started = false;
    let score = 0;
    let highscore = 0;

    function draw() {
      board.innerHTML = "";
      // Draw snake
      snake.forEach((seg, idx) => {
        const el = document.createElement("div");
        el.className = "snake";
        el.style.gridColumnStart = seg.x;
        el.style.gridRowStart = seg.y;
        board.appendChild(el);
      });
      // Draw food
      if (food) {
        const foodEl = document.createElement("div");
        foodEl.className = "food";
        foodEl.style.gridColumnStart = food.x;
        foodEl.style.gridRowStart = food.y;
        board.appendChild(foodEl);
      }
    }

    function move() {
      // Update direction
      direction = { ...nextDirection };
      // Calculate new head
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      // Check wall collision
      if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        return endGame();
      }
      // Check self collision
      if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        return endGame();
      }
      snake.unshift(head);
      // Check food
      if (food && head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function placeFood() {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * gridSize) + 1,
          y: Math.floor(Math.random() * gridSize) + 1
        };
        if (!snake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) break;
      }
      food = newFood;
    }

    function updateScore() {
      scoreEl.textContent = score.toString().padStart(3, '0');
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('snake_highscore', highscore);
      }
      highscoreEl.textContent = highscore.toString().padStart(3, '0');
    }

    function startGame() {
      started = true;
      instruction.style.display = "none";
      logo.style.display = "none";
      score = 0;
      updateScore();
      snake = [{ x: 10, y: 10 }];
      direction = { x: 1, y: 0 };
      nextDirection = { x: 1, y: 0 };
      placeFood();
      draw();
      interval = setInterval(move, 120);
    }

    function endGame() {
      clearInterval(interval);
      started = false;
      instruction.style.display = "block";
      logo.style.display = "block";
      instruction.innerText = "GAME OVER! TRY AGAIN";
    }

    function loadHighscore() {
      const hs = localStorage.getItem('snake_highscore');
      highscore = hs ? parseInt(hs) : 0;
      highscoreEl.textContent = highscore.toString().padStart(3, '0');
    }

    document.addEventListener("keydown", e => {
      if (!started && e.code === "Space") {
        e.preventDefault();
        startGame();
        return;
      }
      if (!started) return;
      if (e.key === "ArrowUp" && direction.y !== 1) {
        e.preventDefault();
        nextDirection = { x: 0, y: -1 };
      }
      if (e.key === "ArrowDown" && direction.y !== -1) {
        e.preventDefault();
        nextDirection = { x: 0, y: 1 };
      }
      if (e.key === "ArrowLeft" && direction.x !== 1) {
        e.preventDefault();
        nextDirection = { x: -1, y: 0 };
      }
      if (e.key === "ArrowRight" && direction.x !== -1) {
        e.preventDefault();
        nextDirection = { x: 1, y: 0 };
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    board.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    board.addEventListener('touchend', e => {
      if (!started) {
        startGame();
        return;
      }
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });

    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const minSwipeDistance = 30;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0 && direction.x !== -1) {
            nextDirection = { x: 1, y: 0 };
          } else if (diffX < 0 && direction.x !== 1) {
            nextDirection = { x: -1, y: 0 };
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0 && direction.y !== -1) {
            nextDirection = { x: 0, y: 1 };
          } else if (diffY < 0 && direction.y !== 1) {
            nextDirection = { x: 0, y: -1 };
          }
        }
      }
    }

    document.addEventListener("click", () => {
      if (!started) startGame();
    });

    // Mobile controls
    document.querySelectorAll('.arrow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!started) {
          startGame();
          return;
        }
        const dir = btn.dataset.direction;
        if (dir === 'up' && direction.y !== 1) {
          nextDirection = { x: 0, y: -1 };
        }
        if (dir === 'down' && direction.y !== -1) {
          nextDirection = { x: 0, y: 1 };
        }
        if (dir === 'left' && direction.x !== 1) {
          nextDirection = { x: -1, y: 0 };
        }
        if (dir === 'right' && direction.x !== -1) {
          nextDirection = { x: 1, y: 0 };
        }
      });
    });

    // Init
    loadHighscore();
    placeFood();
    draw();
    updateScore();