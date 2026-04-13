/**
 * Scoped maze mini-game for Work detail "coming soon" state.
 * Ported from vanilla DOM; all queries run inside `root`.
 */

const BARRIER_CLASS = "workdetail-maze-barrier";
const DYNAMIC_ATTR = "data-maze-dynamic";

export function attachWorkDetailMazeGame(root: HTMLElement): () => void {
  const cont = root.querySelector<HTMLElement>("[data-maze-cont]");
  const maze = root.querySelector<HTMLElement>("[data-maze-board]");
  const thingie = root.querySelector<HTMLElement>("[data-maze-player]");
  const home = root.querySelector<HTMLElement>("[data-maze-home]");
  const emo = root.querySelector<HTMLElement>("[data-maze-emo]");
  const bu = root.querySelector<HTMLElement>("[data-maze-bu]");
  const bd = root.querySelector<HTMLElement>("[data-maze-bd]");
  const bl = root.querySelector<HTMLElement>("[data-maze-bl]");
  const br = root.querySelector<HTMLElement>("[data-maze-br]");

  if (!cont || !maze || !thingie || !home || !emo || !bu || !bd || !bl || !br) {
    return () => {};
  }

  const mbox = root.querySelector<HTMLElement>(".workdetail-maze-mbox");
  const boardWrap = root.querySelector<HTMLElement>(".workdetail-maze-board-wrap");
  const mqDesktopMaze = window.matchMedia("(min-width: 1024px)");

  const timerEl = root.querySelector<HTMLElement>("[data-maze-timer]");

  const step = 40;
  const size = 40;
  const bwidth = 2;
  /** Inner playfield (cells = mazeWidth/step × mazeHeight/step). Larger + unbiased DFS = harder runs. */
  const mazeHeight = 440;
  const mazeWidth = 680;
  const nogoX: number[] = [];
  const nogoX2: number[] = [];
  const nogoY: number[] = [];
  const nogoY2: number[] = [];

  let maxl = 0;
  let prevl = 0;

  let lastUD = 0;
  let lastLR = 0;
  const mThreshold = 15;
  let firstMove = true;
  let allowTilt = true;

  const sThreshold = 15;
  const scThreshold = 20;

  const dirs = ["u", "d", "l", "r"] as const;
  const modDir: Record<
    (typeof dirs)[number],
    { y: number; x: number; o: (typeof dirs)[number] }
  > = {
    u: { y: -1, x: 0, o: "d" },
    d: { y: 1, x: 0, o: "u" },
    l: { y: 0, x: -1, o: "r" },
    r: { y: 0, x: 1, o: "l" },
  };

  let my = mazeHeight / step;
  let mx = mazeWidth / step;
  const grid: { u: number; d: number; l: number; r: number; v: number }[][] = [];

  let levelCompletePending = false;
  let levelIndex = 1;
  let nextLevelTimer = 0;

  let spawnPlayerTopPx = step;
  let spawnHomeTopPx = step;
  let spawnHomeLeftPx = mazeWidth + step;

  const COUNTDOWN_SECONDS = 30;
  let roundTimerId: number | null = null;
  let roundSecondsLeft: number | null = null;

  function formatRoundTime(totalSec: number) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function updateTimerUi() {
    if (!timerEl) return;
    timerEl.textContent = roundSecondsLeft === null ? "—" : formatRoundTime(roundSecondsLeft);
  }

  function stopRoundTimer() {
    if (roundTimerId !== null) {
      window.clearInterval(roundTimerId);
      roundTimerId = null;
    }
  }

  function resetRoundTimerState() {
    stopRoundTimer();
    roundSecondsLeft = null;
    updateTimerUi();
  }

  /** Re-apply left entry / right exit from last genSides (fixes drift after timeout / rebuild). */
  function applySpawnLayout() {
    thingie.style.left = "0px";
    thingie.style.top = `${spawnPlayerTopPx}px`;
    thingie.style.removeProperty("transform");
    home.style.top = `${spawnHomeTopPx}px`;
    home.style.left = `${spawnHomeLeftPx}px`;
    emo.innerHTML = "🐱";
  }

  function clearDynamicBarriers() {
    maze.querySelectorAll(`[${DYNAMIC_ATTR}]`).forEach((node) => node.remove());
  }

  function appendBarrierHitboxes() {
    const barriers = maze.getElementsByClassName(BARRIER_CLASS);
    for (let b = 0; b < barriers.length; b++) {
      const el = barriers[b] as HTMLElement;
      nogoX.push(el.offsetLeft);
      nogoX2.push(el.offsetLeft + el.clientWidth);
      nogoY.push(el.offsetTop);
      nogoY2.push(el.offsetTop + el.clientHeight);
    }
  }

  function rebuildMazeLevel() {
    nogoX.length = 0;
    nogoX2.length = 0;
    nogoY.length = 0;
    nogoY2.length = 0;
    clearDynamicBarriers();
    grid.length = 0;
    my = mazeHeight / step;
    mx = mazeWidth / step;

    genSides();
    for (let i = 0; i < my; i++) {
      const sg: { u: number; d: number; l: number; r: number; v: number }[] = [];
      for (let a = 0; a < mx; a++) {
        sg.push({ u: 0, d: 0, l: 0, r: 0, v: 0 });
      }
      grid.push(sg);
    }
    const sx = Math.floor(Math.random() * mx);
    const sy = Math.floor(Math.random() * my);
    genMaze(sx, sy);
    drawMaze();
    appendBarrierHitboxes();

    maxl = 0;
    prevl = 0;
    home.innerHTML = '<div class="workdetail-maze-emo">🐭</div>';
    applySpawnLayout();
    firstMove = true;
    resetRoundTimerState();
  }

  /** Time ran out without finishing: same maze, cat back to start, timer cleared (next move starts a new 30s). */
  function resetPlayerAfterTimeout() {
    maxl = 0;
    prevl = 0;
    home.innerHTML = '<div class="workdetail-maze-emo">🐭</div>';
    applySpawnLayout();
    firstMove = true;
    resetRoundTimerState();
  }

  function startRoundTimerAfterFirstMove() {
    if (!timerEl || roundTimerId !== null) return;
    roundSecondsLeft = COUNTDOWN_SECONDS;
    updateTimerUi();
    roundTimerId = window.setInterval(() => {
      if (roundSecondsLeft === null) return;
      roundSecondsLeft -= 1;
      updateTimerUi();
      if (roundSecondsLeft <= 0) {
        stopRoundTimer();
        roundSecondsLeft = null;
        updateTimerUi();
        if (nextLevelTimer) {
          window.clearTimeout(nextLevelTimer);
          nextLevelTimer = 0;
        }
        levelCompletePending = false;
        resetPlayerAfterTimeout();
      }
    }, 1000);
  }

  function genSides() {
    const max = mazeHeight / step;
    const l1 = Math.floor(Math.random() * max) * step;
    const l2 = mazeHeight - step - l1;

    const lb1 = document.createElement("div");
    lb1.style.top = `${step}px`;
    lb1.style.left = `${step}px`;
    lb1.style.height = `${l1}px`;

    const lb2 = document.createElement("div");
    lb2.style.top = `${l1 + step * 2}px`;
    lb2.style.left = `${step}px`;
    lb2.style.height = `${l2}px`;

    const rb1 = document.createElement("div");
    rb1.style.top = `${step}px`;
    rb1.style.left = `${mazeWidth + step}px`;
    rb1.style.height = `${l2}px`;

    const rb2 = document.createElement("div");
    rb2.style.top = `${l2 + step * 2}px`;
    rb2.style.left = `${mazeWidth + step}px`;
    rb2.style.height = `${l1}px`;

    nogoX.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
    nogoX2.push(
      0 + bwidth,
      mazeWidth + 2 * step + bwidth,
      step,
      step,
      mazeWidth + 2 * step,
      mazeWidth + 2 * step
    );
    nogoY.push(l1 + step, l2 + step, l1 + step, l1 + 2 * step, l2 + step, l2 + 2 * step);
    nogoY2.push(
      l1 + 2 * step,
      l2 + 2 * step,
      l1 + step + bwidth,
      l1 + 2 * step + bwidth,
      l2 + step + bwidth,
      l2 + 2 * step + bwidth
    );

    spawnPlayerTopPx = l1 + step;
    spawnHomeTopPx = l2 + step;
    spawnHomeLeftPx = mazeWidth + step;
    thingie.style.top = `${spawnPlayerTopPx}px`;
    thingie.style.left = "0px";
    home.style.top = `${spawnHomeTopPx}px`;
    home.style.left = `${spawnHomeLeftPx}px`;

    const els = [lb1, lb2, rb1, rb2];
    for (let i = 0; i < els.length; i++) {
      confSideEl(els[i]);
      maze.appendChild(els[i]);
    }
  }

  function confSideEl(el: HTMLDivElement) {
    el.setAttribute("class", BARRIER_CLASS);
    el.setAttribute(DYNAMIC_ATTR, "true");
    el.style.width = `${bwidth}px`;
  }

  /** Full Fisher–Yates shuffle each cell → twistier mazes than biased partial-order DFS. */
  function shuffledDirs(): (typeof dirs)[number][] {
    const d = [...dirs];
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
  }

  function genMaze(cx: number, cy: number) {
    const d = shuffledDirs();
    for (let i = 0; i < d.length; i++) {
      const dir = d[i];
      const nx = cx + modDir[dir].x;
      const ny = cy + modDir[dir].y;
      grid[cy][cx].v = 1;

      if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid[ny][nx].v === 0) {
        grid[cy][cx][dir] = 1;
        grid[ny][nx][modDir[dir].o] = 1;
        genMaze(nx, ny);
      }
    }
  }

  function drawLines(x: number, y: number, l: number, r: number, u: number, d: number) {
    const top = (y + 1) * step;
    const left = (x + 1) * step;
    if (l === 0 && x > 0) {
      const el = document.createElement("div");
      el.style.left = `${left}px`;
      el.style.height = `${step}px`;
      el.style.top = `${top}px`;
      el.setAttribute("class", BARRIER_CLASS);
      el.setAttribute(DYNAMIC_ATTR, "true");
      el.style.width = `${bwidth}px`;
      maze.appendChild(el);
    }

    if (d === 0 && y < my - 1) {
      const el = document.createElement("div");
      el.style.left = `${left}px`;
      el.style.height = `${bwidth}px`;
      el.style.top = `${top + step}px`;
      el.setAttribute("class", BARRIER_CLASS);
      el.setAttribute(DYNAMIC_ATTR, "true");
      el.style.width = `${step + bwidth}px`;
      maze.appendChild(el);
    }
  }

  function drawMaze() {
    for (let x = 0; x < mx; x++) {
      for (let y = 0; y < my; y++) {
        const cell = grid[y][x];
        drawLines(x, y, cell.l, cell.r, cell.u, cell.d);
      }
    }
  }

  const MAZE_BTN_PRESS_BG = "#ffffff";

  function animKeys(key: HTMLElement) {
    const chevron = key.querySelector<HTMLElement>(".workdetail-maze-chevron");
    key.style.backgroundColor = MAZE_BTN_PRESS_BG;
    key.style.border = "2px #000 solid";
    if (chevron) chevron.style.color = "#000";

    if (key.dataset.mazeBu !== undefined) {
      key.style.transform = "translateY(-2px)";
    }
    if (key.dataset.mazeBd !== undefined) {
      key.style.transform = "translateY(2px)";
    }
    if (key.dataset.mazeBl !== undefined) {
      key.style.transform = "translateX(-2px)";
    }
    if (key.dataset.mazeBr !== undefined) {
      key.style.transform = "translateX(2px)";
    }

    window.setTimeout(() => {
      key.style.border = "2px #fff solid";
      key.style.transform = "translate(0,0)";
      key.style.backgroundColor = "";
      if (chevron) chevron.style.color = "";
    }, 150);
  }

  function updateEmo(lr: boolean) {
    if (lr) {
      if (thingie.offsetLeft < maxl) {
        emo.innerHTML = "😾";
      }
      if (thingie.offsetLeft < maxl - 2 * step) {
        emo.innerHTML = "😿";
      }
      if (thingie.offsetLeft < maxl - 4 * step) {
        emo.innerHTML = "😿";
      }
      if (thingie.offsetLeft < maxl - 6 * step) {
        emo.innerHTML = "🙀";
      }
      if (thingie.offsetLeft > prevl) {
        emo.innerHTML = "😼";
      }
      if (thingie.offsetLeft >= maxl) {
        if (thingie.offsetLeft > mazeWidth * 0.6) {
          emo.innerHTML = "😸";
        } else {
          emo.innerHTML = "😺";
        }
        maxl = thingie.offsetLeft;
      }
      if (thingie.offsetLeft === 0) {
        emo.innerHTML = "😿";
      }
      if (thingie.offsetLeft > mazeWidth - step && thingie.offsetTop === home.offsetTop) {
        emo.innerHTML = "😻";
        home.innerHTML = '<div class="workdetail-maze-emo">🐭</div>';
      }
      if (thingie.offsetLeft > mazeWidth) {
        resetRoundTimerState();
        emo.innerHTML = "";
        home.innerHTML = '<div class="workdetail-maze-emo">🥳</div>';
        if (!levelCompletePending) {
          levelCompletePending = true;
          nextLevelTimer = window.setTimeout(() => {
            nextLevelTimer = 0;
            levelIndex += 1;
            rebuildMazeLevel();
            levelCompletePending = false;
            const levelEl = root.querySelector("[data-maze-level]");
            if (levelEl) {
              levelEl.textContent = String(levelIndex);
            }
          }, 850);
        }
      }
      prevl = thingie.offsetLeft;
    } else {
      if (thingie.offsetLeft > mazeWidth - step && thingie.offsetTop === home.offsetTop) {
        emo.innerHTML = "😻";
      } else if (thingie.offsetLeft > mazeWidth - step && thingie.offsetTop !== home.offsetTop) {
        emo.innerHTML = "😾";
      }
    }
  }

  function checkXboundry(dir: string) {
    const x = thingie.offsetLeft;
    const y = thingie.offsetTop;
    const ok: number[] = [];
    const len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

    for (let i = 0; i < len; i++) {
      let check = 0;
      if (y < nogoY[i] || y > nogoY2[i] - size) {
        check = 1;
      }
      if (dir === "r") {
        if (x < nogoX[i] - size || x > nogoX2[i] - size) {
          check = 1;
        }
      }
      if (dir === "l") {
        if (x < nogoX[i] || x > nogoX2[i]) {
          check = 1;
        }
      }
      ok.push(check);
    }
    return ok.every((e) => e > 0);
  }

  function checkYboundry(dir: string) {
    const x = thingie.offsetLeft;
    const y = thingie.offsetTop;
    const ok: number[] = [];
    const len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

    for (let i = 0; i < len; i++) {
      let check = 0;
      if (x < nogoX[i] || x > nogoX2[i] - size) {
        check = 1;
      }
      if (dir === "u") {
        if (y < nogoY[i] || y > nogoY2[i]) {
          check = 1;
        }
      }
      if (dir === "d") {
        if (y < nogoY[i] - size || y > nogoY2[i] - size) {
          check = 1;
        }
      }
      ok.push(check);
    }
    return ok.every((e) => e > 0);
  }

  function up() {
    startRoundTimerAfterFirstMove();
    animKeys(bu);
    if (checkYboundry("u")) {
      thingie.style.top = `${thingie.offsetTop - step}px`;
      updateEmo(false);
    }
  }

  function down() {
    startRoundTimerAfterFirstMove();
    animKeys(bd);
    if (checkYboundry("d")) {
      thingie.style.top = `${thingie.offsetTop + step}px`;
      updateEmo(false);
    }
  }

  function left() {
    startRoundTimerAfterFirstMove();
    animKeys(bl);
    if (checkXboundry("l")) {
      thingie.style.left = `${thingie.offsetLeft - step}px`;
    }
    updateEmo(true);
  }

  function right() {
    startRoundTimerAfterFirstMove();
    animKeys(br);
    if (checkXboundry("r")) {
      thingie.style.left = `${thingie.offsetLeft + step}px`;
    }
    updateEmo(true);
  }

  function keys(e: KeyboardEvent) {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        up();
        break;
      case "ArrowDown":
      case "KeyS":
        down();
        break;
      case "ArrowLeft":
      case "KeyA":
        left();
        break;
      case "ArrowRight":
      case "KeyD":
        right();
        break;
      default:
        break;
    }
  }

  const onBu = () => {
    up();
    firstMove = true;
  };
  const onBd = () => {
    down();
    firstMove = true;
  };
  const onBl = () => {
    left();
    firstMove = true;
  };
  const onBr = () => {
    right();
    firstMove = true;
  };

  rebuildMazeLevel();

  /** Below 1024px, size from real .workdetail-maze-mbox — viewport CSS can’t match padded columns. */
  const syncMazeScaleToContainer = () => {
    if (!boardWrap || !mbox) return;
    if (mqDesktopMaze.matches) {
      boardWrap.style.removeProperty("--maze-outer-w");
      return;
    }
    const cw = mbox.clientWidth;
    const ch = mbox.clientHeight;
    if (cw < 40 || ch < 40) return;
    const inset = cw <= 420 ? 20 : 14;
    const maxFromWidth = (cw - inset) * 0.72;
    const maxFromHeight = ((ch - (cw <= 420 ? 32 : 20)) * 760) / 548;
    let outer = Math.min(760, maxFromWidth, maxFromHeight);
    outer = Math.floor(outer * 0.72);
    outer = Math.min(outer, Math.floor(cw * 0.68));
    boardWrap.style.setProperty("--maze-outer-w", `${Math.max(168, outer)}px`);
  };

  const onMazeLayoutViewportChange = () => {
    window.requestAnimationFrame(syncMazeScaleToContainer);
  };

  let mazeResizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined" && mbox && boardWrap) {
    mazeResizeObserver = new ResizeObserver(onMazeLayoutViewportChange);
    mazeResizeObserver.observe(mbox);
  }
  onMazeLayoutViewportChange();
  if (typeof mqDesktopMaze.addEventListener === "function") {
    mqDesktopMaze.addEventListener("change", onMazeLayoutViewportChange);
  } else {
    mqDesktopMaze.addListener(onMazeLayoutViewportChange);
  }
  window.addEventListener("orientationchange", onMazeLayoutViewportChange);

  document.addEventListener("keydown", keys);
  bu.addEventListener("click", onBu);
  bd.addEventListener("click", onBd);
  bl.addEventListener("click", onBl);
  br.addEventListener("click", onBr);

  function tiltTimer() {
    allowTilt = false;
    window.setTimeout(() => {
      allowTilt = true;
    }, 200);
  }

  function handleOrientation(e: DeviceOrientationEvent) {
    if (firstMove) {
      lastUD = e.beta ?? 0;
      lastLR = e.gamma ?? 0;
      firstMove = false;
    }
    if (allowTilt && e.beta != null && e.gamma != null) {
      if (e.beta < lastUD - mThreshold) {
        up();
        tiltTimer();
      }
      if (e.beta > lastUD + mThreshold) {
        down();
        tiltTimer();
      }
      if (e.gamma < lastLR - mThreshold) {
        left();
        tiltTimer();
      }
      if (e.gamma > lastLR + mThreshold) {
        right();
        tiltTimer();
      }
    }
  }

  window.addEventListener("deviceorientation", handleOrientation);

  const gp: (Gamepad | null)[] = [];
  const haveEvents = "ongamepadconnected" in window;
  let rafId = 0;

  let allowU = true;
  let allowD = true;
  let allowL = true;
  let allowR = true;
  let allowAU = true;
  let allowAD = true;
  let allowAL = true;
  let allowAR = true;

  function gpTimer(adir: string) {
    switch (adir) {
      case "u":
        allowU = false;
        break;
      case "d":
        allowD = false;
        break;
      case "l":
        allowL = false;
        break;
      case "r":
        allowR = false;
        break;
    }
    window.setTimeout(() => {
      allowU = true;
      allowD = true;
      allowL = true;
      allowR = true;
    }, 200);
  }

  function gpATimer(adir: string) {
    switch (adir) {
      case "u":
        allowAU = false;
        break;
      case "d":
        allowAD = false;
        break;
      case "l":
        allowAL = false;
        break;
      case "r":
        allowAR = false;
        break;
    }
    window.setTimeout(() => {
      allowAU = true;
      allowAD = true;
      allowAL = true;
      allowAR = true;
    }, 200);
  }

  function updateStatus() {
    if (!haveEvents) {
      scangamepads();
    }
    const pad = gp[0];
    if (pad) {
      for (let i = 0; i < pad.buttons.length; i++) {
        if (pad.buttons[12]?.pressed) {
          if (allowU) {
            up();
            gpTimer("u");
          }
        }
        if (pad.buttons[12]?.pressed === false) {
          allowU = true;
        }
        if (pad.buttons[13]?.pressed) {
          if (allowD) {
            down();
            gpTimer("d");
          }
        }
        if (pad.buttons[13]?.pressed === false) {
          allowD = true;
        }
        if (pad.buttons[14]?.pressed) {
          if (allowL) {
            left();
            gpTimer("l");
          }
        }
        if (pad.buttons[14]?.pressed === false) {
          allowL = true;
        }
        if (pad.buttons[15]?.pressed) {
          if (allowR) {
            right();
            gpTimer("r");
          }
        }
        if (pad.buttons[15]?.pressed === false) {
          allowR = true;
        }
      }

      for (let j = 0; j < pad.axes.length; j++) {
        if (pad.axes[1] < -0.8 || pad.axes[3] < -0.8) {
          if (allowAU) {
            up();
            gpATimer("u");
          }
        }
        if (pad.axes[1] > 0.8 || pad.axes[3] > 0.8) {
          if (allowAD) {
            down();
            gpATimer("d");
          }
        }
        if (pad.axes[0] < -0.8 || pad.axes[2] < -0.8) {
          if (allowAL) {
            left();
            gpATimer("l");
          }
        }
        if (pad.axes[0] > 0.8 || pad.axes[2] > 0.8) {
          if (allowAR) {
            right();
            gpATimer("r");
          }
        }
      }
    }

    rafId = window.requestAnimationFrame(updateStatus);
  }

  function scangamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
      const g = gamepads[i];
      if (g) {
        gp[g.index] = g;
      }
    }
  }

  function connectGamepad(e: GamepadEvent) {
    gp[0] = e.gamepad;
    rafId = window.requestAnimationFrame(updateStatus);
  }

  function disconnectGamepad() {
    gp.length = 0;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  window.addEventListener("gamepadconnected", connectGamepad);
  window.addEventListener("gamepaddisconnected", disconnectGamepad);

  let scanInterval = 0;
  if (!haveEvents) {
    scanInterval = window.setInterval(scangamepads, 500);
    rafId = window.requestAnimationFrame(updateStatus);
  }

  let lasttouchpY = 0;
  let lasttouchpX = 0;

  const onTouchStart = (e: TouchEvent) => {
    lasttouchpY = e.changedTouches[0].pageY;
    lasttouchpX = e.changedTouches[0].pageX;
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const diffY = e.changedTouches[0].pageY - lasttouchpY;
    const diffX = e.changedTouches[0].pageX - lasttouchpX;
    if (diffY > sThreshold) {
      down();
      lasttouchpY = e.changedTouches[0].pageY;
    } else if (diffY < -1 * sThreshold) {
      up();
      lasttouchpY = e.changedTouches[0].pageY;
    }
    if (diffX > sThreshold) {
      right();
      lasttouchpX = e.changedTouches[0].pageX;
    } else if (diffX < -1 * sThreshold) {
      left();
      lasttouchpX = e.changedTouches[0].pageX;
    }
  };

  cont.addEventListener("touchstart", onTouchStart);
  cont.addEventListener("touchmove", onTouchMove, { passive: false });

  let lastscrollpY = 0;
  let lastscrollpX = 0;

  const onWheel = (e: WheelEvent) => {
    lastscrollpY += e.deltaY;
    if (lastscrollpY > 0 && e.deltaY < 0) {
      lastscrollpY = 0;
    }
    if (lastscrollpY < 0 && e.deltaY > 0) {
      lastscrollpY = 0;
    }
    if (lastscrollpY > scThreshold) {
      up();
      lastscrollpY = 0;
    }
    if (lastscrollpY < -1 * scThreshold) {
      down();
      lastscrollpY = 0;
    }

    lastscrollpX += e.deltaX;
    if (lastscrollpX > 0 && e.deltaX < 0) {
      lastscrollpX = 0;
    }
    if (lastscrollpX < 0 && e.deltaX > 0) {
      lastscrollpX = 0;
    }
    if (lastscrollpX > scThreshold) {
      left();
      lastscrollpX = 0;
    }
    if (lastscrollpX < -1 * scThreshold) {
      right();
      lastscrollpX = 0;
    }
  };

  cont.addEventListener("wheel", onWheel);

  return () => {
    stopRoundTimer();
    if (nextLevelTimer) {
      window.clearTimeout(nextLevelTimer);
    }
    document.removeEventListener("keydown", keys);
    bu.removeEventListener("click", onBu);
    bd.removeEventListener("click", onBd);
    bl.removeEventListener("click", onBl);
    br.removeEventListener("click", onBr);
    window.removeEventListener("deviceorientation", handleOrientation);
    window.removeEventListener("gamepadconnected", connectGamepad);
    window.removeEventListener("gamepaddisconnected", disconnectGamepad);
    cont.removeEventListener("touchstart", onTouchStart);
    cont.removeEventListener("touchmove", onTouchMove);
    cont.removeEventListener("wheel", onWheel);
    if (scanInterval) {
      window.clearInterval(scanInterval);
    }
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    mazeResizeObserver?.disconnect();
    if (typeof mqDesktopMaze.removeEventListener === "function") {
      mqDesktopMaze.removeEventListener("change", onMazeLayoutViewportChange);
    } else {
      mqDesktopMaze.removeListener(onMazeLayoutViewportChange);
    }
    window.removeEventListener("orientationchange", onMazeLayoutViewportChange);
    boardWrap?.style.removeProperty("--maze-outer-w");
  };
}
