import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";

export default function GameBlockBlast() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Game Code
    const GRID_SIZE = 8;

    const THEMES = [
      {
        name: "Default",
        background: "linear-gradient(135deg, #2ecc71, #9b59b6)",
        slotColor: "#1f2536",
        slotShadow: "rgba(0,0,0,0.3)",
        gridBg: "rgba(0,0,0,0.2)",
        palette: [
          "#FF3366",
          "#FFCC00",
          "#33CC99",
          "#3399FF",
          "#9933CC",
          "#FF9933",
          "#00CCFF",
          "#FF66B2",
        ],
      },
      {
        name: "Winter",
        background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
        slotColor: "rgba(255,255,255,0.4)",
        slotShadow: "rgba(0,0,0,0.1)",
        gridBg: "rgba(255,255,255,0.25)",
        palette: ["#00d2ff", "#3a7bd5", "#ffffff", "#89f7fe", "#66a6ff", "#e2ebf0", "#a1c4fd"],
      },
      {
        name: "Sunset",
        background: "linear-gradient(135deg, #ff9a9e, #fecfef)",
        slotColor: "rgba(255,255,255,0.3)",
        slotShadow: "rgba(0,0,0,0.1)",
        gridBg: "rgba(0,0,0,0.1)",
        palette: ["#ff9966", "#ff5e62", "#ff9a9e", "#fbc2eb", "#a18cd1", "#fad0c4"],
      },
      {
        name: "Neon",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        slotColor: "#000000",
        slotShadow: "#0ff",
        gridBg: "rgba(255,255,255,0.05)",
        palette: ["#FF00FF", "#00FFFF", "#00FF00", "#FFFF00", "#FF0000", "#7B00FF"],
      },
    ];

    const SHAPES = [
      { mask: [[1]] },
      { mask: [[1, 1]] },
      { mask: [[1], [1]] },
      { mask: [[1, 1, 1]] },
      { mask: [[1], [1], [1]] },
      { mask: [[1, 1, 1, 1]] },
      { mask: [[1], [1], [1], [1]] },
      { mask: [[1, 1], [1, 1]] },
      { mask: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
      { mask: [[1, 0], [1, 0], [1, 1]] },
      { mask: [[0, 1], [0, 1], [1, 1]] },
      { mask: [[1, 1, 1], [1, 0, 0]] },
      { mask: [[1, 1, 1], [0, 0, 1]] },
      { mask: [[1, 1], [1, 0]] },
      { mask: [[1, 1, 1], [0, 1, 0]] },
      { mask: [[0, 1, 0], [1, 1, 1]] },
      { mask: [[1, 0], [1, 1], [1, 0]] },
      { mask: [[0, 1], [1, 1], [0, 1]] },
      { mask: [[1, 1, 0], [0, 1, 1]] },
      { mask: [[0, 1, 1], [1, 1, 0]] },
      { mask: [[1, 0], [0, 1]] },
      { mask: [[0, 1], [1, 0]] },
    ];

    class Particle {
      x: number;
      y: number;
      color: string;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      gravity: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.decay = Math.random() * 0.04 + 0.02;
        this.size = Math.random() * 12 + 4;
        this.gravity = 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.size *= 0.94;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.fill();
        ctx.restore();
      }
    }

    class Game {
      container: HTMLElement;
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      scoreElement: HTMLElement;
      bestElement: HTMLElement;
      finalScoreElement: HTMLElement;
      modal: HTMLElement;
      comboElement: HTMLElement;
      themeBtn: HTMLElement;
      appFrame: HTMLElement;
      grid: (string | null)[][];
      hand: any[];
      score: number;
      highScore: number;
      currentThemeIndex: number;
      theme: any;
      dragState: any;
      particles: Particle[];
      comboCount: number;
      lastMoveTime: number;
      metrics: any;
      animationId: number | null = null;
      resizeObserver: ResizeObserver | null = null;
      handleThemeBtnListener: (() => void) | null = null;
      handleMouseDownListener: ((e: MouseEvent) => void) | null = null;
      handleTouchStartListener: ((e: TouchEvent) => void) | null = null;
      handleMouseMoveListener: ((e: MouseEvent) => void) | null = null;
      handleTouchMoveListener: ((e: TouchEvent) => void) | null = null;
      handleMouseUpListener: (() => void) | null = null;
      handleTouchEndListener: (() => void) | null = null;

      constructor(
        container: HTMLElement,
        canvas: HTMLCanvasElement,
        scoreElement: HTMLElement,
        bestElement: HTMLElement,
        finalScoreElement: HTMLElement,
        modal: HTMLElement,
        comboElement: HTMLElement,
        themeBtn: HTMLElement,
        appFrame: HTMLElement
      ) {
        this.container = container;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: true })!;
        this.scoreElement = scoreElement;
        this.bestElement = bestElement;
        this.finalScoreElement = finalScoreElement;
        this.modal = modal;
        this.comboElement = comboElement;
        this.themeBtn = themeBtn;
        this.appFrame = appFrame;

        this.grid = Array(GRID_SIZE)
          .fill()
          .map(() => Array(GRID_SIZE).fill(null));
        this.hand = [null, null, null];
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem("blockBlastHigh") || "0");

        this.currentThemeIndex = 0;
        this.theme = THEMES[0];

        this.dragState = {
          active: false,
          shapeIndex: -1,
          offsetX: 0,
          offsetY: 0,
          currentX: 0,
          currentY: 0,
        };

        this.particles = [];
        this.comboCount = 0;
        this.lastMoveTime = 0;

        this.metrics = {
          cellSize: 0,
          boardX: 0,
          boardY: 0,
          handY: 0,
        };

        this.init();
      }

      init() {
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);
        this.resize();

        this.themeBtn.addEventListener("click", () => this.cycleTheme());
        this.applyTheme();

        this.handleMouseDownListener = (e) => this.handleStart(e.clientX, e.clientY);
        this.handleTouchStartListener = (e) =>
          this.handleStart(e.touches[0].clientX, e.touches[0].clientY);
        this.handleMouseMoveListener = (e) => this.handleMove(e.clientX, e.clientY);
        this.handleTouchMoveListener = (e) =>
          this.handleMove(e.touches[0].clientX, e.touches[0].clientY);
        this.handleMouseUpListener = () => this.handleEnd();
        this.handleTouchEndListener = () => this.handleEnd();

        this.canvas.addEventListener("mousedown", this.handleMouseDownListener);
        this.canvas.addEventListener("touchstart", this.handleTouchStartListener, {
          passive: false,
        });

        window.addEventListener("mousemove", this.handleMouseMoveListener);
        window.addEventListener("touchmove", this.handleTouchMoveListener, {
          passive: false,
        });

        window.addEventListener("mouseup", this.handleMouseUpListener);
        window.addEventListener("touchend", this.handleTouchEndListener);

        this.updateScore(0);
        this.spawnShapes();
        this.loop();
      }

      cycleTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % THEMES.length;
        this.theme = THEMES[this.currentThemeIndex];
        this.applyTheme();
      }

      applyTheme() {
        this.appFrame.style.background = this.theme.background;

        if (this.theme.name === "Winter" || this.theme.name === "Sunset") {
          document.querySelectorAll(".score-label").forEach((el) => {
            (el as HTMLElement).style.color = "#333";
          });
          (document.getElementById("score-val") as HTMLElement).style.color = "#2c3e50";
          (this.themeBtn as HTMLElement).style.color = "#333";
          (this.themeBtn as HTMLElement).style.borderColor = "#333";
        } else {
          document.querySelectorAll(".score-label").forEach((el) => {
            (el as HTMLElement).style.color = "#fff";
          });
          (document.getElementById("score-val") as HTMLElement).style.color = "#fff";
          (this.themeBtn as HTMLElement).style.color = "#fff";
          (this.themeBtn as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
        }
      }

      getRandomThemeColor() {
        return this.theme.palette[Math.floor(Math.random() * this.theme.palette.length)];
      }

      resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;

        const w = this.canvas.width;
        const h = this.canvas.height;

        const availableWidth = w * 0.9;
        const availableHeightForBoard = h * 0.65;

        const maxBoardSize = Math.min(availableWidth, availableHeightForBoard);

        this.metrics.cellSize = Math.floor(maxBoardSize / GRID_SIZE);
        const boardPixelSize = this.metrics.cellSize * GRID_SIZE;

        this.metrics.boardX = (w - boardPixelSize) / 2;
        this.metrics.boardY = (availableHeightForBoard - boardPixelSize) / 2 + 10;
        const remainingH = h - (this.metrics.boardY + boardPixelSize);
        this.metrics.handY = this.metrics.boardY + boardPixelSize + remainingH * 0.3;
      }

      spawnShapes() {
        for (let i = 0; i < 3; i++) {
          const template = SHAPES[Math.floor(Math.random() * SHAPES.length)];
          const color = this.getRandomThemeColor();
          this.hand[i] = {
            mask: template.mask,
            color: color,
            x: 0,
            y: 0,
            scale: 0.9,
            targetScale: 0.9,
          };
        }

        if (this.checkGameOver()) {
          setTimeout(() => this.triggerGameOver(), 500);
        }
      }

      checkGameOver() {
        if (this.hand.every((s) => s === null)) return false;

        for (let s of this.hand) {
          if (!s) continue;
          let canFit = false;
          for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
              if (this.canPlace(s.mask, r, c)) {
                canFit = true;
                break;
              }
            }
            if (canFit) break;
          }
          if (canFit) return false;
        }
        return true;
      }

      triggerGameOver() {
        this.modal.classList.add("active");
        this.finalScoreElement.innerText = this.score.toString();
      }

      restart() {
        this.grid = Array(GRID_SIZE)
          .fill()
          .map(() => Array(GRID_SIZE).fill(null));
        this.hand = [null, null, null];
        this.score = 0;
        this.updateScore(0);
        this.comboCount = 0;
        this.modal.classList.remove("active");
        this.spawnShapes();
      }

      updateScore(points: number) {
        if (points === 0 && this.score === 0) {
          this.scoreElement.innerText = "0";
        } else {
          this.score += points;
          this.scoreElement.innerText = this.score.toString();
        }

        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem("blockBlastHigh", this.highScore.toString());
        }
        this.bestElement.innerHTML = `<i class="fas fa-crown"></i> ${this.highScore}`;
      }

      handleStart(cx: number, cy: number) {
        if (this.modal.classList.contains("active")) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = cx - rect.left;
        const y = cy - rect.top;

        const spacing = this.canvas.width / 3.5;
        const centerScreen = this.canvas.width / 2;

        for (let i = 0; i < 3; i++) {
          if (!this.hand[i]) continue;

          const shape = this.hand[i];
          const pxWidth = shape.mask[0].length * this.metrics.cellSize * shape.scale;
          const pxHeight = shape.mask.length * this.metrics.cellSize * shape.scale;

          const centerX = centerScreen + (i - 1) * spacing;
          const centerY = this.metrics.handY + this.metrics.cellSize;

          if (
            Math.abs(x - centerX) < pxWidth / 2 + 40 &&
            Math.abs(y - centerY) < pxHeight / 2 + 40
          ) {
            const targetW = shape.mask[0].length * this.metrics.cellSize;
            const targetH = shape.mask.length * this.metrics.cellSize;

            this.dragState = {
              active: true,
              shapeIndex: i,
              offsetX: targetW / 2,
              offsetY: targetH / 2,
              currentX: x,
              currentY: y,
            };
            shape.targetScale = 1.0;
            return;
          }
        }
      }

      handleMove(cx: number, cy: number) {
        if (!this.dragState.active) return;
        const rect = this.canvas.getBoundingClientRect();
        this.dragState.currentX = cx - rect.left;
        this.dragState.currentY = cy - rect.top;
      }

      handleEnd() {
        if (!this.dragState.active) return;

        const shape = this.hand[this.dragState.shapeIndex];
        const { r, c } = this.getGridPos(
          this.dragState.currentX - this.dragState.offsetX,
          this.dragState.currentY - this.dragState.offsetY,
          shape.mask
        );

        if (r !== null && this.canPlace(shape.mask, r, c)) {
          this.placeShape(shape, r, c);
          this.hand[this.dragState.shapeIndex] = null;

          if (this.hand.every((s) => s === null)) {
            setTimeout(() => this.spawnShapes(), 200);
          } else if (this.checkGameOver()) {
            this.triggerGameOver();
          }
        } else {
          shape.targetScale = 0.9;
        }

        this.dragState.active = false;
        this.dragState.shapeIndex = -1;
      }

      getGridPos(tlx: number, tly: number, mask: number[][]) {
        const c = Math.round((tlx - this.metrics.boardX) / this.metrics.cellSize);
        const r = Math.round((tly - this.metrics.boardY) / this.metrics.cellSize);
        return { r, c };
      }

      canPlace(mask: number[][], r: number, c: number) {
        if (
          r < 0 ||
          c < 0 ||
          r + mask.length > GRID_SIZE ||
          c + mask[0].length > GRID_SIZE
        )
          return false;
        for (let i = 0; i < mask.length; i++) {
          for (let j = 0; j < mask[0].length; j++) {
            if (mask[i][j] === 1 && this.grid[r + i][c + j] !== null) return false;
          }
        }
        return true;
      }

      placeShape(shape: any, r: number, c: number) {
        let placed = 0;
        for (let i = 0; i < shape.mask.length; i++) {
          for (let j = 0; j < shape.mask[0].length; j++) {
            if (shape.mask[i][j] === 1) {
              this.grid[r + i][c + j] = shape.color;
              placed++;
              for (let k = 0; k < 3; k++) {
                this.particles.push(
                  new Particle(
                    this.metrics.boardX + (c + j) * this.metrics.cellSize + this.metrics.cellSize / 2,
                    this.metrics.boardY + (r + i) * this.metrics.cellSize + this.metrics.cellSize / 2,
                    "rgba(255,255,255,0.5)"
                  )
                );
              }
            }
          }
        }
        this.updateScore(placed);
        this.checkLines();
      }

      checkLines() {
        const rows = [];
        const cols = [];

        for (let r = 0; r < GRID_SIZE; r++) {
          if (this.grid[r].every((x) => x !== null)) rows.push(r);
        }
        for (let c = 0; c < GRID_SIZE; c++) {
          let full = true;
          for (let r = 0; r < GRID_SIZE; r++) {
            if (this.grid[r][c] === null) full = false;
          }
          if (full) cols.push(c);
        }

        if (rows.length > 0 || cols.length > 0) {
          const cellsToClear = new Set();

          rows.forEach((r) => {
            for (let c = 0; c < GRID_SIZE; c++) {
              cellsToClear.add(`${r},${c}`);
              this.spawnExplosion(r, c, this.grid[r][c]!);
            }
          });
          cols.forEach((c) => {
            for (let r = 0; r < GRID_SIZE; r++) {
              cellsToClear.add(`${r},${c}`);
              if (!rows.includes(r))
                this.spawnExplosion(r, c, this.grid[r][c]!);
            }
          });

          cellsToClear.forEach((key) => {
            const [r, c] = (key as string).split(",").map(Number);
            this.grid[r][c] = null;
          });

          const lines = rows.length + cols.length;
          let points = lines * 10 + cellsToClear.size;

          const now = Date.now();
          if (now - this.lastMoveTime < 4000 && this.comboCount > 0) {
            this.comboCount++;
            points += this.comboCount * 15;

            this.comboElement.innerText = `COMBO x${this.comboCount}`;
            this.comboElement.classList.remove("combo-active");
            void this.comboElement.offsetWidth;
            this.comboElement.classList.add("combo-active");
          } else {
            this.comboCount = 1;
          }
          this.lastMoveTime = now;

          this.updateScore(points);
          this.createFloatingText(points);
        }
      }

      spawnExplosion(r: number, c: number, color: string) {
        const cx =
          this.metrics.boardX +
          c * this.metrics.cellSize +
          this.metrics.cellSize / 2;
        const cy =
          this.metrics.boardY +
          r * this.metrics.cellSize +
          this.metrics.cellSize / 2;
        for (let i = 0; i < 6; i++) {
          this.particles.push(new Particle(cx, cy, color));
        }
      }

      createFloatingText(score: number) {
        const el = document.createElement("div");
        el.className = "floater";
        el.innerText = `+${score}`;
        el.style.left = `50%`;
        el.style.top = `40%`;
        el.style.transform = `translate(-50%, -50%)`;
        this.container.appendChild(el);
        setTimeout(() => el.remove(), 800);
      }

      loop() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.loop());
      }

      update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          this.particles[i].update();
          if (this.particles[i].life <= 0) this.particles.splice(i, 1);
        }

        this.hand.forEach((s) => {
          if (s) {
            s.scale += (s.targetScale - s.scale) * 0.25;
          }
        });
      }

      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.theme.gridBg;
        this.roundRect(
          this.metrics.boardX - 8,
          this.metrics.boardY - 8,
          this.metrics.cellSize * GRID_SIZE + 16,
          this.metrics.cellSize * GRID_SIZE + 16,
          16
        );
        this.ctx.fill();

        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            const x = this.metrics.boardX + c * this.metrics.cellSize;
            const y = this.metrics.boardY + r * this.metrics.cellSize;
            this.drawEmptySlot(x, y, this.metrics.cellSize);

            if (this.grid[r][c]) {
              this.drawGemBlock(x, y, this.metrics.cellSize, this.grid[r][c]!);
            }
          }
        }

        if (this.dragState.active) {
          const shape = this.hand[this.dragState.shapeIndex];
          const { r, c } = this.getGridPos(
            this.dragState.currentX - this.dragState.offsetX,
            this.dragState.currentY - this.dragState.offsetY,
            shape.mask
          );

          if (r !== null && this.canPlace(shape.mask, r, c)) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
            for (let i = 0; i < shape.mask.length; i++) {
              for (let j = 0; j < shape.mask[0].length; j++) {
                if (shape.mask[i][j]) {
                  const x = this.metrics.boardX + (c + j) * this.metrics.cellSize;
                  const y = this.metrics.boardY + (r + i) * this.metrics.cellSize;
                  this.ctx.fillStyle = shape.color;
                  this.ctx.fillRect(x + 2, y + 2, this.metrics.cellSize - 4, this.metrics.cellSize - 4);
                }
              }
            }
            this.ctx.restore();
          }
        }

        const spacing = this.canvas.width / 3.5;
        const centerScreen = this.canvas.width / 2;

        this.hand.forEach((shape, index) => {
          if (!shape) return;

          let drawX, drawY;
          if (this.dragState.active && this.dragState.shapeIndex === index) {
            drawX = this.dragState.currentX - this.dragState.offsetX;
            drawY = this.dragState.currentY - this.dragState.offsetY;

            this.ctx.save();
            this.ctx.filter = "blur(8px)";
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.drawShapeShapeOnly(shape, drawX + 10, drawY + 20);
            this.ctx.restore();
          } else {
            const w = shape.mask[0].length * this.metrics.cellSize * shape.scale;
            const h = shape.mask.length * this.metrics.cellSize * shape.scale;

            const centerX = centerScreen + (index - 1) * spacing;
            drawX = centerX - w / 2;
            drawY = this.metrics.handY + this.metrics.cellSize - h / 2;
          }

          this.drawShape(shape, drawX, drawY);
        });

        this.particles.forEach((p) => p.draw(this.ctx));
      }

      drawEmptySlot(x: number, y: number, size: number) {
        if (size <= 6) return;
        const gap = 3;
        const s = size - gap * 2;
        const gx = x + gap;
        const gy = y + gap;
        const r = 6;

        this.ctx.fillStyle = this.theme.slotColor;
        this.ctx.beginPath();
        this.roundRect(gx, gy, s, s, r);
        this.ctx.fill();

        this.ctx.strokeStyle = this.theme.slotShadow;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.roundRect(gx + 1, gy + 1, s - 2, s - 2, r);
        this.ctx.stroke();
      }

      drawGemBlock(x: number, y: number, size: number, color: string) {
        if (size <= 2) return;
        const gap = 1;
        const s = size - gap * 2;
        const gx = x + gap;
        const gy = y + gap;
        const r = 6;

        const grad = this.ctx.createLinearGradient(gx, gy, gx, gy + s);
        grad.addColorStop(0, color);
        grad.addColorStop(1, this.adjustColor(color, -20));

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.roundRect(gx, gy, s, s, r);
        this.ctx.fill();

        this.ctx.fillStyle = "rgba(255,255,255,0.4)";
        this.ctx.beginPath();
        this.ctx.ellipse(gx + s / 2, gy + s * 0.2, s * 0.3, s * 0.15, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.beginPath();
        this.roundRect(gx, gy + s - 4, s, 4, r);
        this.ctx.fill();

        this.ctx.fillStyle = "rgba(255,255,255,0.7)";
        this.ctx.beginPath();
        this.ctx.arc(gx + 6, gy + 6, 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = "rgba(0,0,0,0.1)";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }

      drawShape(shape: any, x: number, y: number) {
        const cellSize = this.metrics.cellSize * shape.scale;
        for (let i = 0; i < shape.mask.length; i++) {
          for (let j = 0; j < shape.mask[0].length; j++) {
            if (shape.mask[i][j]) {
              this.drawGemBlock(x + j * cellSize, y + i * cellSize, cellSize, shape.color);
            }
          }
        }
      }

      drawShapeShapeOnly(shape: any, x: number, y: number) {
        const cellSize = this.metrics.cellSize * shape.scale;
        this.ctx.beginPath();
        for (let i = 0; i < shape.mask.length; i++) {
          for (let j = 0; j < shape.mask[0].length; j++) {
            if (shape.mask[i][j]) {
              this.ctx.rect(x + j * cellSize, y + i * cellSize, cellSize - 2, cellSize - 2);
            }
          }
        }
        this.ctx.fill();
      }

      adjustColor(color: string, amount: number) {
        return (
          "#" +
          color
            .replace(/^#/, "")
            .replace(/../g, (color) =>
              (
                "0" +
                Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
              ).substr(-2)
            )
        );
      }

      roundRect(x: number, y: number, w: number, h: number, r: number) {
        if ((this.ctx as any).roundRect) {
          (this.ctx as any).roundRect(x, y, w, h, r);
        } else {
          this.ctx.beginPath();
          this.ctx.rect(x, y, w, h);
        }
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }

        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }

        if (this.handleMouseDownListener) {
          this.canvas.removeEventListener("mousedown", this.handleMouseDownListener);
        }
        if (this.handleTouchStartListener) {
          this.canvas.removeEventListener("touchstart", this.handleTouchStartListener);
        }
        if (this.handleMouseMoveListener) {
          window.removeEventListener("mousemove", this.handleMouseMoveListener);
        }
        if (this.handleTouchMoveListener) {
          window.removeEventListener("touchmove", this.handleTouchMoveListener);
        }
        if (this.handleMouseUpListener) {
          window.removeEventListener("mouseup", this.handleMouseUpListener);
        }
        if (this.handleTouchEndListener) {
          window.removeEventListener("touchend", this.handleTouchEndListener);
        }
      }
    }

    // Initialize game with DOM elements
    const gameContainer = containerRef.current.querySelector("#game-container") as HTMLDivElement;
    const canvas = containerRef.current.querySelector("#gameCanvas") as HTMLCanvasElement;
    const scoreElement = containerRef.current.querySelector("#score-val") as HTMLElement;
    const bestElement = containerRef.current.querySelector("#best-val") as HTMLElement;
    const finalScoreElement = containerRef.current.querySelector("#final-score") as HTMLElement;
    const modal = containerRef.current.querySelector("#game-over-modal") as HTMLElement;
    const comboElement = containerRef.current.querySelector("#combo-display") as HTMLElement;
    const themeBtn = containerRef.current.querySelector("#theme-btn") as HTMLElement;
    const appFrame = containerRef.current.querySelector("#app-frame") as HTMLElement;

    const game = new Game(
      gameContainer,
      canvas,
      scoreElement,
      bestElement,
      finalScoreElement,
      modal,
      comboElement,
      themeBtn,
      appFrame
    );

    gameInstanceRef.current = game;

    return () => {
      game.destroy();
    };
  }, []);

  return (
    <Layout>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        <style>{`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');

          #app-frame {
            width: 100vmin;
            height: 100vmin;
            max-width: 800px;
            max-height: 800px;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
            overflow: hidden;
            transition: background 0.5s ease;
            margin: 20px auto;
          }

          #ui-header {
            height: 15%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 25px;
            box-sizing: border-box;
            background: rgba(0,0,0,0.1);
            z-index: 10;
          }

          .score-box {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            min-width: 80px;
          }

          .score-label {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.8);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }

          .score-value {
            font-size: 2.2rem;
            font-weight: 700;
            color: #fff;
            text-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-variant-numeric: tabular-nums;
          }

          .theme-btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.4);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            transition: transform 0.1s, background 0.2s;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
          
          .theme-btn:active {
            transform: scale(0.9);
          }
          
          .theme-btn:hover {
            background: rgba(255,255,255,0.3);
          }

          .trophy-box {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            min-width: 80px;
          }

          .best-score {
            font-size: 1.2rem;
            color: #ffd700;
            display: flex;
            align-items: center;
            gap: 5px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          #game-container {
            flex: 1;
            position: relative;
            width: 100%;
            overflow: hidden;
          }

          canvas {
            display: block;
            width: 100%;
            height: 100%;
          }

          .modal {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }

          .modal.active {
            opacity: 1;
            pointer-events: auto;
          }

          .modal-content {
            background: linear-gradient(135deg, #2b3247, #1e2233);
            padding: 40px;
            border-radius: 25px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            width: 80%;
            max-width: 320px;
          }

          .modal.active .modal-content {
            transform: scale(1);
          }

          .modal h2 {
            font-size: 2.2rem;
            margin: 0 0 10px 0;
            background: linear-gradient(to right, #ffd700, #ffaa00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .btn-primary {
            background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
            border: none;
            padding: 15px 50px;
            border-radius: 50px;
            font-family: 'Fredoka', sans-serif;
            font-size: 1.4rem;
            font-weight: 700;
            color: white;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(0, 242, 254, 0.4), inset 0 2px 0 rgba(255,255,255,0.4);
            transition: all 0.1s;
            margin-top: 20px;
            text-transform: uppercase;
          }

          .btn-primary:active {
            transform: scale(0.95);
          }

          .floater {
            position: absolute;
            font-weight: 800;
            font-size: 2rem;
            color: #fff;
            pointer-events: none;
            animation: floatUp 0.8s ease-out forwards;
            text-shadow: 0 4px 8px rgba(0,0,0,0.5);
            z-index: 50;
            font-family: 'Comic Sans MS', sans-serif;
          }

          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { transform: translateY(-10px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-60px) scale(1); opacity: 0; }
          }

          .combo-text {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 3.5rem;
            font-weight: 900;
            background: linear-gradient(to bottom, #fff 40%, #ffd700 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 4px 0 rgba(0,0,0,0.3));
            pointer-events: none;
            z-index: 60;
            white-space: nowrap;
          }

          .combo-active {
            animation: comboPop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          @keyframes comboPop {
            0% { transform: translate(-50%, -50%) scale(0) rotate(-15deg); opacity: 0; }
            20% { transform: translate(-50%, -50%) scale(1.2) rotate(5deg); opacity: 1; }
            40% { transform: translate(-50%, -50%) scale(1.0) rotate(-5deg); }
            100% { transform: translate(-50%, -50%) scale(1.0) rotate(0deg); opacity: 0; }
          }
        `}</style>

        <div id="app-frame">
          <div id="ui-header">
            <div className="score-box">
              <div className="score-label">Score</div>
              <div id="score-val" className="score-value">
                0
              </div>
            </div>

            <button className="theme-btn" id="theme-btn" title="Switch Theme">
              <i className="fas fa-palette"></i>
            </button>

            <div className="trophy-box">
              <div className="score-label">Best</div>
              <div id="best-val" className="best-score">
                <i className="fas fa-crown"></i> 0
              </div>
            </div>
          </div>

          <div id="game-container">
            <div id="combo-display" className="combo-text">
              COMBO!
            </div>
            <canvas id="gameCanvas"></canvas>
          </div>

          <div id="game-over-modal" className="modal">
            <div className="modal-content">
              <h2>No Moves!</h2>
              <p style={{ color: "#8b9bb4", fontSize: "1.1rem", marginBottom: "25px" }}>
                Don't give up! Can you beat your best?
              </p>
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#aaa" }}>FINAL SCORE</div>
                <div id="final-score" style={{ fontSize: "2.5rem", fontWeight: "700", color: "white" }}>
                  0
                </div>
              </div>
              <button
                className="btn-primary"
                onClick={() => gameInstanceRef.current?.restart()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
