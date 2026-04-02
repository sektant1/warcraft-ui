import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Renderer } from "../renderer/Renderer";
import type { Race } from "../utils/types";

const RendererContext = createContext<Renderer | null>(null);

export function useRenderer() {
  const ctx = useContext(RendererContext);
  if (!ctx)
    throw new Error("useRenderer must be used inside <WarcraftProvider>");
  return ctx;
}

interface Props {
  race: Race;
  children: React.ReactNode;
}

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
