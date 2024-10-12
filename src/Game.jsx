import { useState, useEffect, useRef } from "react";
import Spaceship from "./assets/Spaceship.svg";
import Invader from "./assets/Invader.svg";
import ShotImage from "./assets/Shot.svg";
import Background from "./assets/BG.svg";
function Game(props) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  let interval = null;
  const [resume, setResume] = useState(false);
  const canvasSize = props.canvasSize;

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  useEffect(() => {
    //* Represents functions of both the Player and Invaders
    function GameObject(x, y, img) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.active = true;

      this.draw = (ctx) => {
        //? drawImage is used instead of fillRect because "fillStyle" changes color of bg aswell
        this.active && ctx.drawImage(this.img, this.x, this.y, 50, 50);
      };

      this.move = function (dx, dy) {
        this.x += dx;
        this.y += dy;
      };

      this.fire = (dy) => {
        return new Shot(this.x + 20, this.y, dy);
      };

      this.isHitBy = (shot) => {
        function between(x, a, b) {
          return x >= a && x <= b;
        }
        return (
          this.active &&
          between(shot.x, this.x, this.x + 40) &&
          between(shot.y, this.y, this.y + 20)
        );
      };
    }

    //* All functions of Shot
    function Shot(x, y, dy) {
      this.x = x;
      this.y = y;
      this.dy = dy;

      this.move = () => {
        this.y += this.dy;
        return this.y > 0 && this.y < canvasSize.height - 20;
      };

      this.draw = (ctx) => {
        ctx.drawImage(shotImage, this.x, this.y, 3, 20);
      };
    }

    //* All variable declarations
    let invadersDx = -5;
    let invadersDxFactor = 1;

    const invader = [];

    const playerImage = new Image();
    playerImage.src = Spaceship;
    const player = new GameObject(
      canvasSize.width / 2,
      canvasSize.height - 50,
      playerImage
    );

    let playerShot = null;
    let invaderShot = null;
    const shotImage = new Image();
    shotImage.src = ShotImage;

    let bgImage = new Image();
    bgImage.src = Background;

    //* Set the initial position of the invaders
    function init() {
      const InvaderImage = new Image();
      InvaderImage.src = Invader;
      //* Creates 3 rows and 8 columns of invaders
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 8; x++) {
          invader.push(new GameObject(60 + x * 60, y * 60 + 30, InvaderImage));
        }
      }
      invader.forEach((invader) => (invader.img.src = Invader));
    }

    //* Draws the canvas, player, invaders and shots
    function draw() {
      ctx.fillStyle = "#00000";
      ctx.drawImage(bgImage, 0, 0, 600, 800);
      invader.forEach((invader) => invader.draw(ctx));
      player.draw(ctx);

      invaderShot && invaderShot.draw(ctx);
      playerShot && playerShot.draw(ctx);
    }

    //* Handles the movement of player, invader and shots
    function move() {
      const leftX = invader[0].x;
      const rightX = invader[invader.length - 1].x;

      //? Invaders movement, left to right and downwards
      if (leftX < 20 || rightX > canvasSize.width - 60) {
        invadersDx = -invadersDx;
      }
      invader.forEach((invader) =>
        invader.move(invadersDx * invadersDxFactor, 0.2)
      );

      if (invaderShot && !invaderShot.move()) {
        invaderShot = null;
      }

      //? Makes it so atleast one shot from random invader is always present
      if (!invaderShot) {
        let active = invader.filter((i) => i.active);
        let r = active[Math.floor(Math.random() * active.length)];
        invaderShot = r.fire(10);
      }

      //? Checks if any invader is hit by the player's shot
      if (playerShot) {
        const hit = invader.find((inv) => inv.isHitBy(playerShot));
        if (hit) {
          hit.active = false;
          playerShot = null;
          invadersDxFactor = invadersDxFactor * 1.05;
        } else {
          if (!playerShot.move()) {
            playerShot = null;
          }
        }
      }
    }

    //* Main game loop called every 50ms
    function game() {
      move();
      draw();

      //* Decides what to do when game ends
      if (isGameOver()) {
        clearInterval(interval);
        const res = false;
        setResume(res);
        alert("Game Over!");
      }
    }

    //* Checks if the game is over, when player is hit or invaders are too close
    function isGameOver() {
      return (
        player.isHitBy(invaderShot) ||
        invader.find((inv) => inv.y > canvasSize.height - 100)
      );
    }

    //* Starts the game
    function start() {
      init();
      //? EventListener for player controls
      document.addEventListener("keydown", function (e) {
        if ((e.key === "ArrowLeft" || e.key === "a") && player.x >= 10) {
          player.move(-10, 0);
        }
        if ((e.key === "ArrowRight" || e.key === "d") && player.x <= 540) {
          player.move(10, 0);
        }
        if (e.key === " " && !playerShot) {
          playerShot = player.fire(-20);
        }
      });
      interval = setInterval(game, 50);
    }
    if (ctx) {
      start();
    }
  }, [ctx]);

  return (
    <>
      <canvas
        className="w-[600px] h-[800px] bg-black border-2 border-white"
        width={canvasSize.width}
        height={canvasSize.height}
        ref={canvasRef}
      ></canvas>
      {/* <button
        onClick={handleClick}
        className="border-2 text-white border-white z-10"
      >
        Start!
      </button> */}
    </>
  );
}

export default Game;
