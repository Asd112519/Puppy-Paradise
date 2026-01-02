import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";

export default function GameFetch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">(
    "start",
  );
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("fetchHighScore") || "0"),
  );
  const [gameOverReason, setGameOverReason] = useState("");
  const gameRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number | null = null;
    let gameActive = false;
    let score = 0;
    let difficultyMultiplier = 1;
    const BALL_TYPES = [
      {
        type: "tennis",
        emoji: "🎾",
        size: 30,
        bounce: 0.8,
        speedMod: 1.0,
        score: 1,
      },
      {
        type: "frisbee",
        emoji: "🥏",
        size: 35,
        bounce: 0.95,
        speedMod: 1.2,
        score: 2,
      },
      {
        type: "bone",
        emoji: "🦴",
        size: 30,
        bounce: 0.6,
        speedMod: 1.1,
        score: 3,
      },
      {
        type: "soccer",
        emoji: "⚽",
        size: 40,
        bounce: 0.75,
        speedMod: 0.8,
        score: 1,
      },
    ];

    const OBSTACLES = ["🪨", "🌵", "🌳", "🐈"];

    let balls: any[] = [];
    let particles: any[] = [];
    let obstacles: any[] = [];
    let backgroundClouds: any[] = [];
    let floatingTexts: any[] = [];
    let mouse = { x: 0, y: 0, clicked: false };

    class Cloud {
      x: number;
      y: number;
      speed: number;
      size: number;
      emoji: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height / 2);
        this.speed = 0.2 + Math.random() * 0.5;
        this.size = 30 + Math.random() * 40;
        this.emoji = "☁️";
      }

      update() {
        this.x += this.speed;
        if (this.x > width + 50) this.x = -50;
      }

      draw() {
        ctx!.font = `${this.size}px Arial`;
        ctx!.globalAlpha = 0.6;
        ctx!.fillText(this.emoji, this.x, this.y);
        ctx!.globalAlpha = 1.0;
      }
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 1.0;
        this.color = color;
        this.size = Math.random() * 5 + 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.03;
        this.vy += 0.5;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = this.life;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1.0;
      }
    }

    class Obstacle {
      size: number;
      emoji: string;
      x: number;
      y: number;
      hitboxRadius: number;

      constructor() {
        this.size = 40 + Math.random() * 20;
        this.emoji = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
        this.x = Math.random() * (width - 100) + 50;
        this.y = height - 60;
        this.hitboxRadius = this.size / 2.5;
      }

      draw() {
        ctx!.font = `${this.size}px Arial`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(this.emoji, this.x, this.y);
      }
    }

    class Ball {
      emoji: string;
      size: number;
      bounceFactor: number;
      points: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      gravity: number;
      rotation: number;
      rotationSpeed: number;
      active: boolean;

      constructor() {
        const variant =
          BALL_TYPES[Math.floor(Math.random() * BALL_TYPES.length)];
        this.emoji = variant.emoji;
        this.size = variant.size;
        this.bounceFactor = variant.bounce;
        this.points = variant.score;

        this.x = -50;
        this.y = height - 100 - Math.random() * 150;

        const baseSpeed = width * 0.0045;
        this.vx =
          (baseSpeed + Math.random() * 1.5) *
          variant.speedMod *
          difficultyMultiplier;
        this.vy = -(8 + Math.random() * 8);

        this.gravity = 0.6;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        this.active = true;
      }

      update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        const floorLevel = height - 60;
        if (this.y + this.size / 2 > floorLevel) {
          this.y = floorLevel - this.size / 2;
          this.vy *= -this.bounceFactor;

          if (this.emoji !== "🥏") {
            this.vx *= 0.95;
          }
        }

        if (this.y - this.size / 2 < 0) {
          this.y = this.size / 2;
          this.vy *= -0.8;
        }

        obstacles.forEach((obs) => {
          const dx = this.x - obs.x;
          const dy = this.y - obs.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size / 2 + obs.hitboxRadius) {
            gameOverFn("The ball hit an obstacle!");
          }
        });

        if (mouse.clicked) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.size * 1.5) {
            this.catchBall();
          }
        }

        if (this.x > width + 50) {
          gameOverFn("The ball ran away!");
        }

        if (
          Math.abs(this.vx) < 0.1 &&
          Math.abs(this.vy) < 0.1 &&
          this.y > height - 100
        ) {
          this.vx = 0;
          gameOverFn("The ball stopped!");
        }
      }

      catchBall() {
        this.active = false;
        score += this.points;
        setScore(score);

        difficultyMultiplier += 0.05;

        createExplosion(this.x, this.y, "#FFF");
        createExplosion(this.x, this.y, "#FFFF00");

        spawnFloatingText(this.x, this.y, "+" + this.points);

        spawnBall();

        if (score % 5 === 0) {
          if (obstacles.length < 3) obstacles.push(new Obstacle());
        }
      }

      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation);
        ctx!.font = `${this.size}px Arial`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.shadowColor = "rgba(0,0,0,0.3)";
        ctx!.shadowBlur = 10;
        ctx!.fillText(this.emoji, 0, 0);
        ctx!.restore();
      }
    }

    class FloatingText {
      x: number;
      y: number;
      text: string;
      life: number;
      vy: number;

      constructor(x: number, y: number, text: string) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.life = 1.0;
        this.vy = -2;
      }

      update() {
        this.y += this.vy;
        this.life -= 0.02;
      }

      draw() {
        ctx!.fillStyle = `rgba(255, 255, 255, ${this.life})`;
        ctx!.font = "bold 30px 'Fredoka', sans-serif";
        ctx!.strokeStyle = `rgba(0, 0, 0, ${this.life})`;
        ctx!.lineWidth = 2;
        ctx!.strokeText(this.text, this.x, this.y);
        ctx!.fillText(this.text, this.x, this.y);
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function handleInputStart(e: MouseEvent | Touch) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e as any).clientX - rect.left;
      mouse.y = (e as any).clientY - rect.top;
      mouse.clicked = true;
    }

    function spawnBall() {
      balls.push(new Ball());
    }

    function createExplosion(x: number, y: number, color: string) {
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, color));
      }
    }

    function spawnFloatingText(x: number, y: number, text: string) {
      floatingTexts.push(new FloatingText(x, y, text));
    }

    function gameOverFn(reason: string) {
      gameActive = false;
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("fetchHighScore", score.toString());
      }
      setFinalScore(score);
      setGameOverReason(reason);
      setGameState("gameover");

      document.body.classList.add("shake");
      setTimeout(() => document.body.classList.remove("shake"), 500);
    }

    function drawBackground() {
      backgroundClouds.forEach((cloud) => {
        cloud.update();
        cloud.draw();
      });

      ctx!.fillStyle = "#4ade80";
      ctx!.fillRect(0, height - 60, width, 60);

      ctx!.strokeStyle = "#22c55e";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      for (let i = 0; i < width; i += 20) {
        ctx!.moveTo(i, height - 60);
        ctx!.lineTo(i + 5, height - 75);
        ctx!.lineTo(i + 10, height - 60);
      }
      ctx!.stroke();
    }

    function gameLoop() {
      if (!gameActive) return;

      ctx!.clearRect(0, 0, width, height);

      drawBackground();

      obstacles.forEach((obs) => obs.draw());

      for (let i = balls.length - 1; i >= 0; i--) {
        let b = balls[i];
        b.update();
        b.draw();
        if (!b.active) balls.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
      }

      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let ft = floatingTexts[i];
        ft.update();
        ft.draw();
        if (ft.life <= 0) floatingTexts.splice(i, 1);
      }

      mouse.clicked = false;
      animationId = requestAnimationFrame(gameLoop);
    }

    // Store event listener references for cleanup
    const listeners = {
      resize: () => resize(),
      mousedown: (e: MouseEvent) => handleInputStart(e),
      touchstart: (e: TouchEvent) => {
        e.preventDefault();
        handleInputStart(e.touches[0]);
      },
      mouseup: () => (mouse.clicked = false),
      touchend: () => (mouse.clicked = false),
    };

    function init() {
      resize();
      window.addEventListener("resize", listeners.resize);

      for (let i = 0; i < 5; i++) backgroundClouds.push(new Cloud());

      canvas.addEventListener("mousedown", listeners.mousedown);
      canvas.addEventListener("touchstart", listeners.touchstart, {
        passive: false,
      });
      canvas.addEventListener("mouseup", listeners.mouseup);
      canvas.addEventListener("touchend", listeners.touchend);
    }

    gameRef.current = {
      startGame: () => {
        score = 0;
        difficultyMultiplier = 1;
        setScore(0);
        gameActive = true;
        balls = [];
        particles = [];
        obstacles = [];
        setGameState("playing");

        spawnBall();
        gameLoop();
      },
      cleanup: () => {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener("resize", listeners.resize);
        canvas.removeEventListener("mousedown", listeners.mousedown);
        canvas.removeEventListener("touchstart", listeners.touchstart);
        canvas.removeEventListener("mouseup", listeners.mouseup);
        canvas.removeEventListener("touchend", listeners.touchend);
      },
    };

    init();

    return () => {
      gameRef.current?.cleanup();
    };
  }, []);

  const handleStartGame = () => {
    gameRef.current?.startGame();
  };

  const handleResetGame = () => {
    gameRef.current?.startGame();
  };

  return (
    <Layout>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#87CEEB",
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block" }} />

        {gameState === "playing" && (
          <div
            style={{
              position: "fixed",
              left: 20,
              top: 20,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              padding: "20px",
              color: "white",
              fontFamily: "'Comic Sans MS', sans-serif",
              zIndex: 10,
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                marginBottom: "15px",
                textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
              }}
            >
              Score: <span style={{ fontWeight: "bold" }}>{score}</span>
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                opacity: 0.9,
                textShadow: "1px 1px 0px rgba(0,0,0,0.2)",
              }}
            >
              High Score: <span style={{ fontWeight: "bold" }}>{highScore}</span>
            </div>
          </div>
        )}

        {gameState === "start" && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "2rem",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              minWidth: "300px",
              border: "4px solid #4ade80",
              pointerEvents: "auto",
            }}
          >
            <h1
              style={{
                fontSize: "2.25rem",
                color: "#22c55e",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Fredoka', sans-serif",
              }}
            >
              FETCH!
            </h1>
            <p
              style={{
                color: "#4b5563",
                marginBottom: "1.5rem",
                fontFamily: "'Comic Sans MS', sans-serif",
              }}
            >
              Tap the ball before it leaves the screen or hits an obstacle!
            </p>
            <button
              onClick={handleStartGame}
              style={{
                background: "#4ade80",
                color: "white",
                padding: "15px 30px",
                borderRadius: "50px",
                fontSize: "1.5rem",
                cursor: "pointer",
                border: "none",
                transition: "transform 0.1s",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: "bold",
                boxShadow: "0 4px 0 #22c55e",
              }}
            >
              Play Fetch
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "2rem",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              minWidth: "300px",
              border: "4px solid #4ade80",
              pointerEvents: "auto",
            }}
          >
            <h1
              style={{
                fontSize: "2.25rem",
                color: "#ef4444",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Fredoka', sans-serif",
              }}
            >
              Oh no!
            </h1>
            <p
              style={{
                color: "#4b5563",
                marginBottom: "1rem",
                fontFamily: "'Comic Sans MS', sans-serif",
              }}
            >
              {gameOverReason}
            </p>
            <p
              style={{
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
                fontFamily: "'Comic Sans MS', sans-serif",
              }}
            >
              Score: <span>{finalScore}</span>
            </p>
            <button
              onClick={handleResetGame}
              style={{
                background: "#4ade80",
                color: "white",
                padding: "15px 30px",
                borderRadius: "50px",
                fontSize: "1.5rem",
                cursor: "pointer",
                border: "none",
                transition: "transform 0.1s",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: "bold",
                boxShadow: "0 4px 0 #22c55e",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-4px, 0, 0); }
            20%, 80% { transform: translate3d(8px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
            40%, 60% { transform: translate3d(8px, 0, 0); }
          }
          body.shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}</style>
      </div>
    </Layout>
  );
}
