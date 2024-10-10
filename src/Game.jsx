import { useState, useEffect, useRef } from "react";
import Spaceship from "./assets/Spaceship.svg";
import Invader from "./assets/Invader.svg";
import ShotImage from "./assets/Shot.svg";
function Game() {
  const canvasRef = useRef(null);
  let interval = null;

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    function GameObject(x, y, img) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.active = true;
    }

    GameObject.prototype.draw = function (ctx) {
      this.active && ctx.drawImage(this.img, this.x, this.y, 50, 50);
    };

    GameObject.prototype.move = function (dx, dy) {
      this.x += dx;
      this.y += dy;
    };

    GameObject.prototype.fire = function (dy) {
      return new Shot(this.x + 20, this.y + 20, dy);
    };

    function Shot(x, y, dy) {
      this.x = x;
      this.y = y;
      this.dy = dy;
    }

    Shot.prototype.move = function () {
      this.y += this.dy;
      return this.y > 0 && this.y < 580;
    };

    Shot.prototype.draw = function (ctx) {
      ctx.drawImage(shotImage, this.x - 1, this.y, 3, 20);
    };

    let invadersDx = -5;

    const invader = [];

    const playerImage = new Image();
    playerImage.src = Spaceship;
    const player = new GameObject(280, 550, playerImage);

    let playerShot = null;
    let invaderShot = null;
    const shotImage = new Image();
    shotImage.src = ShotImage;

    function init() {
      const InvaderImage = new Image();
      InvaderImage.src = Invader;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 8; x++) {
          invader.push(new GameObject(60 + x * 60, y * 60 + 30, InvaderImage));
        }
      }
      invader.forEach((invader) => (invader.img.src = Invader));
    }

    function draw() {
      ctx.fillStyle = "#00000";
      ctx.fillRect(0, 0, 600, 600);
      invader.forEach((invader) => invader.draw(ctx));
      player.draw(ctx);

      invaderShot && invaderShot.draw(ctx);
      playerShot && playerShot.draw(ctx);
    }

    function move() {
      const leftX = invader[0].x;
      const rightX = invader[invader.length - 1].x;

      if (leftX < 20 || rightX > 540) {
        invadersDx = -invadersDx;
      }
      invader.forEach((invader) => invader.move(invadersDx, 0.5));

      if (invaderShot && !invaderShot.move()) {
        invaderShot = null;
      }

      if (!invaderShot) {
        let active = invader.filter((i) => i.active);
        let r = active[Math.floor(Math.random() * active.length)];
        invaderShot = r.fire(20);
      }
    }

    function game() {
      move();
      draw();
    }

    function start() {
      init();
      document.addEventListener("keydown", function (e) {
        if ((e.key === "ArrowLeft" || e.key === "a") && player.x >= 10) {
          player.move(-10, 0);
        }
        if ((e.key === "ArrowRight" || e.key === "d") && player.x <= 540) {
          player.move(10, 0);
        }
      });
      interval = setInterval(game, 50);
    }

    start();
  }, [canvasRef]);

  return (
    <>
      <canvas
        className="bg-black ml-64 my-10 border-2 border-white"
        width={600}
        height={600}
        ref={canvasRef}
      ></canvas>
    </>
  );
}

export default Game;
