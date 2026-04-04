import "@testing-library/jest-dom/vitest";

// Mock ResizeObserver for components that use canvas rendering
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// Mock canvas context for components that use canvas rendering
HTMLCanvasElement.prototype.getContext = (() => {
  const noop = () => {};
  const ctx = {
    clearRect: noop,
    fillRect: noop,
    drawImage: noop,
    createPattern: () => null,
    save: noop,
    restore: noop,
    beginPath: noop,
    rect: noop,
    clip: noop,
    setTransform: noop,
    canvas: { width: 0, height: 0 },
    fillStyle: "",
    globalCompositeOperation: "",
    globalAlpha: 1,
    filter: "",
    imageSmoothingEnabled: true,
  } as unknown as CanvasRenderingContext2D;
  return () => ctx;
})();

// Mock fetch for BLP loading
globalThis.fetch = (() =>
  Promise.resolve({
    ok: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  })) as unknown as typeof fetch;
