import { useEffect } from "react";
import { useCurrentRace } from "../../state/race";
import { loadBlpDataUrl, loadDataUrlImage } from "../../utils/glueButton";
import type { Race } from "../../utils/types";

const cursorFrameDataUrlCache = new Map<Race, Promise<string>>();

async function loadRaceCursorFrameDataUrl(race: Race): Promise<string> {
  const cached = cursorFrameDataUrlCache.get(race);
  if (cached) return cached;

  const promise = (async () => {
    const atlasDataUrl = await loadBlpDataUrl(`cursor/${race}Cursor.blp`);
    const atlas = await loadDataUrlImage(atlasDataUrl);
    const columns = 8;
    const rows = 4;
    const frameW = Math.max(1, Math.floor(atlas.width / columns));
    const frameH = Math.max(1, Math.floor(atlas.height / rows));
    const canvas = document.createElement("canvas");
    canvas.width = frameW;
    canvas.height = frameH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return atlasDataUrl;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, frameW, frameH);
    ctx.drawImage(atlas, 0, 0, frameW, frameH, 0, 0, frameW, frameH);
    return canvas.toDataURL("image/png");
  })();

  cursorFrameDataUrlCache.set(race, promise);
  // Don't cache failures forever — allow a retry on the next race change.
  promise.catch(() => cursorFrameDataUrlCache.delete(race));
  return promise;
}

interface Props {
  race?: Race;
}

/**
 * Applies the race's WC3 cursor to the whole page through the
 * `--wc3-game-cursor` CSS variable. Renders nothing itself.
 */
export default function CursorOverlay({ race: raceProp }: Props = {}) {
  const globalRace = useCurrentRace();
  const race = raceProp ?? globalRace;

  useEffect(() => {
    let cancelled = false;
    const root = document.documentElement;
    root.setAttribute("data-wc3-cursor", "");

    void loadRaceCursorFrameDataUrl(race)
      .then((cursorFrameUrl) => {
        if (cancelled) return;
        root.style.setProperty(
          "--wc3-game-cursor",
          `url("${cursorFrameUrl}") 2 2, auto`,
        );
      })
      .catch((err) => {
        console.error(err);
        root.style.setProperty("--wc3-game-cursor", "auto");
      });

    return () => {
      cancelled = true;
      root.removeAttribute("data-wc3-cursor");
      root.style.removeProperty("--wc3-game-cursor");
    };
  }, [race]);

  return null;
}
