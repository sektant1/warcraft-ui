import { Renderer } from "./Renderer";
import { currentRace } from "../state/race";

let instance: Renderer | null = null;
let canvas: HTMLCanvasElement | null = null;
let mountCount = 0;
let lastLoadedRace = "";

function ensureRenderer(): Renderer {
  if (instance) return instance;

  instance = new Renderer();
  canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "0",
  });
  document.body.appendChild(canvas);
  instance.init(canvas);

  // Load initial race
  const race = currentRace();
  instance.loadRace(race);
  lastLoadedRace = race;

  // Start render loop with race-check
  const origStart = instance.start.bind(instance);
  origStart();

  // Poll for race changes each frame
  const checkRace = () => {
    if (!instance) return;
    const r = currentRace();
    if (r !== lastLoadedRace) {
      instance.loadRace(r);
      lastLoadedRace = r;
    }
  };
  const origRenderFrame = (instance as any).renderFrame.bind(instance);
  const patchedRender = () => {
    checkRace();
    origRenderFrame();
  };
  (instance as any).renderFrame = patchedRender;

  return instance;
}

export function acquireRenderer(): Renderer {
  mountCount++;
  return ensureRenderer();
}

export function releaseRenderer(): void {
  mountCount--;
  if (mountCount <= 0) {
    mountCount = 0;
    if (instance) {
      instance.destroy();
      instance = null;
    }
    if (canvas) {
      canvas.remove();
      canvas = null;
    }
    lastLoadedRace = "";
  }
}
