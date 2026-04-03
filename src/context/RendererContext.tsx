import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Renderer } from "../renderer/Renderer";
import { acquireRenderer, releaseRenderer } from "../renderer/singleton";
import type { Race } from "../utils/types";

const RendererContext = createContext<Renderer | null>(null);

/**
 * Get the renderer instance.
 * If inside a <WarcraftRenderer> provider, returns that instance.
 * Otherwise, acquires the shared singleton renderer automatically.
 */
export function useRenderer() {
  const ctx = useContext(RendererContext);
  const singletonRef = useRef<Renderer | null>(null);

  if (!ctx && !singletonRef.current) {
    singletonRef.current = acquireRenderer();
  }

  useEffect(() => {
    if (!ctx && singletonRef.current) {
      return () => {
        releaseRenderer();
        singletonRef.current = null;
      };
    }
  }, [ctx]);

  return ctx ?? singletonRef.current!;
}

interface Props {
  race: Race;
  children: React.ReactNode;
}

/**
 * Optional provider for explicit renderer control.
 * Components work without this wrapper via the singleton renderer.
 */
export function WarcraftRenderer({ race, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [renderer] = useState(() => new Renderer());

  useEffect(() => {
    renderer.init(canvasRef.current!);
    renderer.setViewportRef(() => viewportRef.current!);
    renderer.start();
    return () => renderer.destroy();
  }, [renderer]);

  useEffect(() => {
    renderer.loadRace(race);
  }, [race, renderer]);

  return (
    <RendererContext.Provider value={renderer}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div ref={viewportRef} style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </RendererContext.Provider>
  );
}
