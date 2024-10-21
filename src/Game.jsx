//* hooks
import { useState, useEffect, useRef } from "react";
import Spaceship from "./assets/Spaceship.svg";
//* Images
import Invader from "./assets/Invader.svg";
import ShotImage from "./assets/Shot.svg";
import Background from "./assets/BG.svg";
import PlayerShotImage from "./assets/PlayerShot.svg";
import Explosion from "./assets/Explosion.svg";
//* Audio
import InsertSound from "./assets/audio/Coin Insert.mp3";
import ShootSound from "./assets/audio/Shoot.mp3";
import ExplosionSound from "./assets/audio/Hit.mp3";
import PlayerExplodeSound from "./assets/audio/PlayerExplode.mp3";
import PauseSound from "./assets/audio/Pause.mp3";
import GameOverSound from "./assets/audio/GameOver.mp3";
import NextLevelSound from "./assets/audio/NextLevel.mp3";
//* Components
import Scoreboard from "./Scoreboard";
import Intro from "./Intro";
import { Pause } from "./Intro";
import { End } from "./Intro";
import { NextLevel } from "./Intro";

function Game(props) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const canvasSize = props.canvasSize;
  const [score, setScore] = useState(0);
  const [canvasIndex, setConvasIndex] = useState(-1);
  const [showIntro, setShowIntro] = useState(true);
  const [showPause, setShowPause] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showNextLevel, setShowNextLevel] = useState(false);
  const [canvasMargin, setCanvasMargin] = useState(-800);
  const [lives, setLives] = useState(3);
  var Lives;
  let Score = 0;
  var HiScore = localStorage.getItem("HiScore") || 0;

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  //* Represents functions of both the Player and Invaders
  class GameObject {
    constructor(x, y, img) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.active = true;
      this.explode = false;

      this.draw = (ctx) => {
        //? drawImage is used instead of fillRect because "fillStyle" changes color of bg aswell
        this.active && ctx.drawImage(this.img, this.x, this.y, 50, 50);
      };

      this.move = function (dx, dy) {
        this.x += dx;
        this.y += dy;
      };

      this.fire = (dy, img) => {
        return new Shot(this.x + 20, this.y, dy, img);
      };

      this.isHitBy = (shot) => {
        function between(x, a, b) {
          return x >= a && x <= b;
        }
        return (
          this.active &&
          between(shot.x, this.x, this.x + 50) &&
          between(shot.y, this.y, this.y + 50)
        );
      };
    }
  }

  //* All functions of Shot
  class Shot {
    constructor(x, y, dy, img) {
      this.x = x;
      this.y = y;
      this.dy = dy;

      this.move = () => {
        this.y += this.dy;
        return this.y > 0 && this.y < canvasSize.height - 20;
      };

      this.draw = (ctx) => {
        ctx.drawImage(img, this.x, this.y, 3, 20);
      };
    }
  }

  //* All variable declarations
  let invadersDx = -2;
  let invadersDxFactor = 1;
  let invaderDyFactor = 1;

  const [invader, setInvader] = useState([]);

  let playerShot = null;
  let invaderShot = null;

  //* Image Objects
  const playerImage = new Image();
  playerImage.src = Spaceship;

  const explosionImage = new Image();
  explosionImage.src = Explosion;

  const shotImage = new Image();
  shotImage.src = ShotImage;

  const playerShotImage = new Image();
  playerShotImage.src = PlayerShotImage;

  let bgImage = new Image();
  bgImage.src = Background;

  //* Audio Objects
  const InsertAudio = new Audio();
  InsertAudio.src = InsertSound;

  const ShootAudio = new Audio();
  ShootAudio.src = ShootSound;

  const ExplosionAudio = new Audio();
  ExplosionAudio.src = ExplosionSound;

  const PauseAudio = new Audio();
  PauseAudio.src = PauseSound;

  const PlayerExplodeAudio = new Audio();
  PlayerExplodeAudio.src = PlayerExplodeSound;

  const GameOverAudio = new Audio();
  GameOverAudio.src = GameOverSound;

  const NextLevelAudio = new Audio();
  NextLevelAudio.src = NextLevelSound;

  //* Player init
  const player = new GameObject(
    canvasSize.width / 2,
    canvasSize.height - 50,
    playerImage
  );

  //* Set the initial position of the invaders
  function init() {
    const InvaderImage = new Image();
    InvaderImage.src = Invader;
    // Creates 3 rows and 8 columns of invaders
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 8; x++) {
        setInvader(
          invader.push(new GameObject(60 + x * 60, y * 60 + 30, InvaderImage))
        );
      }
    }
    invader.forEach((invader) => (invader.img.src = Invader));
  }

  //* Draws the canvas, player, invaders and shots
  function draw() {
    ctx.fillStyle = "#00000";
    ctx.drawImage(bgImage, 0, 0, 600, 800);

    invader.forEach((invader) => invader.draw(ctx));
    invader.forEach((invader) => {
      if (invader.explode) {
        ctx.drawImage(explosionImage, invader.x, invader.y, 50, 50);
      }
    });
    player.active && player.draw(ctx);

    invaderShot && invaderShot.draw(ctx);
    playerShot && playerShot.draw(ctx);

    if (player.explode) {
      ctx.drawImage(explosionImage, player.x, player.y, 50, 50);
    }
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
      invader.move(invadersDx * invadersDxFactor, 0.2 * invaderDyFactor)
    );

    if (invaderShot && !invaderShot.move()) {
      invaderShot = null;
    }

    //? Makes it so atleast one shot from random invader is always present
    if (!invaderShot) {
      let active = invader.filter((i) => i.active);
      let r = active[Math.floor(Math.random() * active.length)];
      if (r) {
        invaderShot = r.fire(5, shotImage);
      }
    }
    //? Checks if any invader is hit by the player's shot
    if (playerShot) {
      ShootAudio.play();
      const hit = invader.find((inv) => inv.isHitBy(playerShot));
      if (hit) {
        ExplosionAudio.play();
        InvExplode(hit);
        hit.active = false;
        playerShot = null;
        invadersDxFactor = invadersDxFactor + 0.05;
        setScore((score) => score + 100);
        Score = Score + 100;

        // Next Level
        if (invader.every((i) => !i.active)) {
          nextLevel();
        }
      } else {
        if (!playerShot.move()) {
          playerShot = null;
          ShootAudio.currentTime = 0;
          ShootAudio.pause();
        }
      }
    }
  }

  //* Main game loop called every 50ms
  function game() {
    move();
    draw();

    // Decides what to do when game ends
    if (isGameOver()) {
      gameEnd();
    }
  }

  //* Checks if the game is over, when player is hit or invaders are too close
  function isGameOver() {
    if (player.isHitBy(invaderShot)) {
      PlayerIsHit();
    }
    return Lives <= 0 || invader.find((inv) => inv.y > canvasSize.height - 100);
  }

  function PlayerIsHit() {
    PlayerExplodeAudio.play();
    Lives -= 1;
    setLives((lives) => lives - 1);
    invaderShot = null;
    player.active = false;
    player.explode = true;
    setTimeout(() => {
      player.active = true;
      player.explode = false;
    }, 300);
  }

  function InvExplode(hit) {
    hit.explode = true;
    setTimeout(() => {
      hit.explode = false;
    }, 500);
  }

  //* Starts the game
  function start() {
    init();
    //? EventListener for player controls
    document.addEventListener("keydown", function (e) {
      if (
        (e.key === "ArrowLeft" || e.key === "a") &&
        player.x >= 10 &&
        player.active
      ) {
        player.move(-10, 0);
      }
      if (
        (e.key === "ArrowRight" || e.key === "d") &&
        player.x <= 540 &&
        player.active
      ) {
        player.move(10, 0);
      }
      if (e.key === " " && !playerShot && player.active) {
        playerShot = player.fire(-20, playerShotImage);
      }
      if (e.key === "p" || e.key === "P") {
        gamePause();
      }
      if (e.key === "Enter") {
        gameStart();
      }
      if (e.key === "r" || e.key === "R") {
        gameResume();
      }
    });
    Lives = lives;
  }
  var interval = 0;
  let counter = 0;
  function gameStart() {
    if (interval === 0) {
      InsertAudio.play();
      setTimeout(() => {
        interval = setInterval(game, 25);
      }, 1000);
      counter = interval;
      setShowIntro(false);
      setCanvasMargin(0);
    }
  }

  function gamePause() {
    PauseAudio.play();
    clearInterval(interval);
    counter = 0;
    setShowPause(true);
    setCanvasMargin(-800);
  }

  function gameResume() {
    if (counter != interval) {
      interval = setInterval(game, 25);
      counter = interval;
      setShowPause(false);
      setCanvasMargin(0);
    }
  }

  function gameEnd() {
    if (Score > HiScore) {
      HiScore = Score;
      localStorage.setItem("HiScore", HiScore);
    }
    GameOverAudio.play();
    clearInterval(interval);
    setShowEnd(true);
    setCanvasMargin(-800);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
  function nextLevel() {
    invadersDxFactor = invadersDxFactor / 1.2;
    invaderDyFactor = invaderDyFactor + 0.2;
    setScore((score) => score + 1000);
    Score = Score + 1000;
    setInvader((invader.length = 0));
    init();
    NextLevelAudio.play();

    setShowNextLevel(true);
    setCanvasMargin(-800);
    setTimeout(() => {
      setShowNextLevel(false);
      setCanvasMargin(0);
    }, 1500);
  }

  useEffect(() => {
    if (ctx) {
      start();
    }
  }, [ctx]);

  return (
    <>
      <div className="flex w-[900px] h-[800px] mt-10">
        <div className="w-[600px] h-[800px]">
          {showIntro && <Intro />}
          {showPause && <Pause />}
          {showEnd && <End />}
          {showNextLevel && <NextLevel />}
          <canvas
            className={`w-[600px] h-[800px] bg-black border-2 border-white relative`}
            width={canvasSize.width}
            height={canvasSize.height}
            ref={canvasRef}
            style={{ zIndex: -1, marginTop: `${canvasMargin}px` }}
          ></canvas>
        </div>
        <Scoreboard score={score} lives={lives} HiScore={HiScore} />
      </div>
    </>
  );
}

export default Game;
