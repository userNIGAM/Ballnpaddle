import React, { useRef, UseEffect, useEffect } from "react";

export default function Bounce() {
  const canvasRef = useRef(null);
  const paddle = useRef({ x: 75, y: 100, width: 50, height: 10 });
  const ball = useRef({ x: 100, y: 100, radius: 6, dx: 2, dy: -2 });
  const keys = useRef({ left: false, right: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //Handle Key Press
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const drawBall = () => {
      ctx.beginPtah();
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
      ctx.beginPtah();
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

    const update = () => {
      // Move paddle
      if (keys.current.left && paddle.current.x > 0) {
        paddle.current.x = -4;
      }
      if (
        keys.current.right &&
        paddle.current.x + paaddle.current.width < canvas.width
      ) {
        paddle.current.x = +4;
      }
      // Move ball
      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;

      // Bounce on left or right walls
      if (
        ball.current.x + ball.current.radius > canvas.width ||
        ball.current.x - ball.current.radius < 0
      ) {
        ball.current.dx = -ball.current.dx;
      }
      // bounce on top
      if ((ball.current.y = ball.current.radius < 0)) {
        ball.current.dy = -ball.current.dy;
      }

      //bounce on paddle
      if (
        ball.current.y + ball.current.radius >= paddle.current.y &&
        ball.current.x >= paddle.current.x &&
        ball.current.x <= paddle.current.x + paddle.current.width
      ) {
        ball.current.dy = -ball.current.dy;
      }

      //If ball goes belwo paddle, reset
      if (ball.current.y > canvas.height) {
        ball.current.x = 100;
        ball.current.y = 100;
        ball.current.dx = 2;
        ball.current.dy = -2;
      }
    };
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();
      update();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyUp", handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        style={{ background: "#eee", border: "2px solid black" }}
      />
      <p>User Left and Right Arrow to move the paddle</p>
    </div>
  );
}
