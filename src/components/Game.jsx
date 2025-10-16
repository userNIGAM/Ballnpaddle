// import React, { useEffect, useRef, useState } from "react";

// const Game = () => {
//   const canvasRef = useRef(null);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);

//   const ball = useRef({
//     x: 400,
//     y: 480,
//     radius: 12,
//     dx: 0,
//     dy: 0,
//   });

//   const paddle = useRef({
//     x: 350,
//     width: 120,
//     height: 15,
//     y: 490,
//   });

//   const obstacles = useRef([
//     // Example: obstacles near the borders or anywhere you like
//     { x: 0, y: 100, width: 200, height: 20 }, // top-left
//     { x: 600, y: 200, width: 200, height: 20 }, // top-right
//     { x: 300, y: 350, width: 200, height: 20 }, // middle
//   ]);

//   const maxBounceHeight = 290;
//   const ballSpeed = 3;

//   const restartGame = () => {
//     ball.current = { x: 400, y: 480, radius: 12, dx: 0, dy: 0 };
//     paddle.current.x = 350;
//     setIsGameOver(false);
//     setGameStarted(false);
//   };

//   const startGame = () => {
//     if (!gameStarted) {
//       setGameStarted(true);
//       ball.current.dx = ballSpeed;
//       ball.current.dy = -ballSpeed;
//     }
//   };

//   // Paddle movement logic
//   useEffect(() => {
//     let moveInterval = null;

//     const handleKeyDown = (e) => {
//       if (!gameStarted && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
//         startGame();
//       }

//       if (moveInterval) clearInterval(moveInterval);

//       if (e.key === "ArrowLeft") {
//         moveInterval = setInterval(() => {
//           if (paddle.current.x > 0) paddle.current.x -= 8;
//         }, 16);
//       } else if (e.key === "ArrowRight") {
//         moveInterval = setInterval(() => {
//           if (paddle.current.x + paddle.current.width < canvasRef.current.width)
//             paddle.current.x += 8;
//         }, 16);
//       }
//     };

//     const handleKeyUp = (e) => {
//       if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
//         if (moveInterval) clearInterval(moveInterval);
//         moveInterval = null;
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//       if (moveInterval) clearInterval(moveInterval);
//     };
//   }, [gameStarted]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // Helper: draw ball
//     const drawBall = () => {
//       ctx.beginPath();
//       ctx.arc(
//         ball.current.x,
//         ball.current.y,
//         ball.current.radius,
//         0,
//         Math.PI * 2
//       );
//       ctx.fillStyle = "red";
//       ctx.fill();
//       ctx.closePath();
//     };

//     // Helper: draw paddle
//     const drawPaddle = () => {
//       ctx.beginPath();
//       ctx.rect(
//         paddle.current.x,
//         paddle.current.y,
//         paddle.current.width,
//         paddle.current.height
//       );
//       ctx.fillStyle = "green";
//       ctx.fill();
//       ctx.closePath();
//     };

//     // Helper: draw obstacles
//     const drawObstacles = () => {
//       ctx.fillStyle = "orange";
//       obstacles.current.forEach((obs) => {
//         ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
//       });
//     };

//     // Collision detection between ball and rectangle obstacle
//     const checkObstacleCollision = (obs) => {
//       const b = ball.current;

//       if (
//         b.x + b.radius > obs.x &&
//         b.x - b.radius < obs.x + obs.width &&
//         b.y + b.radius > obs.y &&
//         b.y - b.radius < obs.y + obs.height
//       ) {
//         // Determine which side of the obstacle was hit
//         const overlapLeft = b.x + b.radius - obs.x;
//         const overlapRight = obs.x + obs.width - (b.x - b.radius);
//         const overlapTop = b.y + b.radius - obs.y;
//         const overlapBottom = obs.y + obs.height - (b.y - b.radius);
//         const minOverlap = Math.min(
//           overlapLeft,
//           overlapRight,
//           overlapTop,
//           overlapBottom
//         );

//         if (minOverlap === overlapLeft || minOverlap === overlapRight) {
//           b.dx = -b.dx; // bounce horizontally
//         } else {
//           b.dy = -b.dy; // bounce vertically
//         }
//       }
//     };

//     const update = () => {
//       if (gameStarted) {
//         const b = ball.current;

//         b.x += b.dx;
//         b.y += b.dy;

//         // Bounce off left/right walls
//         if (b.x + b.radius > canvas.width || b.x - b.radius < 0) b.dx = -b.dx;

//         // Bounce at max height
//         if (b.y - b.radius < maxBounceHeight) b.dy = Math.abs(b.dy);

//         // Bounce off paddle
//         if (
//           b.y + b.radius >= paddle.current.y &&
//           b.x >= paddle.current.x &&
//           b.x <= paddle.current.x + paddle.current.width
//         ) {
//           b.dy = -ballSpeed;
//           const hitPos = (b.x - paddle.current.x) / paddle.current.width;
//           b.dx = (hitPos - 0.5) * 2 * ballSpeed;
//         }

//         // Check obstacle collisions
//         obstacles.current.forEach(checkObstacleCollision);

//         // Game over
//         if (b.y - b.radius > canvas.height) setIsGameOver(true);
//       }
//     };

//     const gameLoop = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.beginPath();
//       ctx.moveTo(0, maxBounceHeight);
//       ctx.lineTo(canvas.width, maxBounceHeight);
//       ctx.strokeStyle = "rgba(255,255,255,0.3)";
//       ctx.stroke();

//       drawObstacles();
//       drawBall();
//       drawPaddle();

//       if (!gameStarted && !isGameOver) {
//         ctx.fillStyle = "white";
//         ctx.font = "24px Arial";
//         ctx.textAlign = "center";
//         ctx.fillText(
//           "Press LEFT or RIGHT arrow to start",
//           canvas.width / 2,
//           canvas.height / 2 - 50
//         );
//       }

//       if (!isGameOver) {
//         update();
//         requestAnimationFrame(gameLoop);
//       }
//     };

//     gameLoop();
//   }, [isGameOver, gameStarted]);

//   return (
//     <div className="flex flex-col items-center mt-10">
//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={600}
//         className="bg-gray-900 border-2 border-white"
//       />
//       {isGameOver && (
//         <div className="mt-4 p-6 bg-red-500 text-white rounded-lg shadow-lg text-center">
//           <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
//           <button
//             onClick={restartGame}
//             className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-lg"
//           >
//             Restart Game
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Game;
