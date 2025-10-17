import React, { useRef, useEffect } from "react";

const Bounce = () => {
  const canvasRef = useRef(null);

  const paddle = useRef({
    x: 75,
    y: 350, // Moved to bottom
    width: 50,
    height: 10,
  });

  const ball = useRef({
    x: 100,
    y: 100,
    radius: 6,
    dx: 2,
    dy: 2, // Changed to positive to move down initially
  });

  const keys = useRef({ left: false, right: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw functions
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(
        ball.current.x,
        ball.current.y,
        ball.current.radius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(
        paddle.current.x,
        paddle.current.y,
        paddle.current.width,
        paddle.current.height
      );
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
    };

    // Key handlers - FIXED!
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const update = () => {
      // Move paddle based on keys pressed
      if (keys.current.left && paddle.current.x > 0) {
        paddle.current.x -= 4;
      }
      if (
        keys.current.right &&
        paddle.current.x + paddle.current.width < canvas.width
      ) {
        paddle.current.x += 4;
      }

      // Move ball
      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;

      // Bounce off side walls
      if (
        ball.current.x + ball.current.radius > canvas.width ||
        ball.current.x - ball.current.radius < 0
      ) {
        ball.current.dx = -ball.current.dx;
      }

      // Bounce off top
      if (ball.current.y - ball.current.radius < 0) {
        ball.current.dy = -ball.current.dy;
      }

      // Bounce off paddle - FIXED!
      if (
        ball.current.y + ball.current.radius >= paddle.current.y &&
        ball.current.x >= paddle.current.x &&
        ball.current.x <= paddle.current.x + paddle.current.width
      ) {
        ball.current.dy = -ball.current.dy;
      }

      // Reset ball if it goes below paddle
      if (ball.current.y - ball.current.radius > canvas.height) {
        ball.current.x = 100;
        ball.current.y = 100;
        ball.current.dx = 2;
        ball.current.dy = 2;
      }
    };

    // Game loop - FIXED!
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      update();
      drawBall();
      drawPaddle();
      requestAnimationFrame(gameLoop);
    };

    // Start the game
    gameLoop();

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{
          background: "#eee",
          border: "2px solid black",
        }}
      />
      <p>Use Left and Right Arrow to move the paddle</p>
    </div>
  );
};

export default Bounce;
