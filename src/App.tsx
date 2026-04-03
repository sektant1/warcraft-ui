import { useEffect, useState } from "react";
import "./App.css";
import { useCurrentRace, setCurrentRace } from "./state/race";
import { tickResources, animateCounters } from "./state/resources";
import { WarcraftRenderer } from "./context/RendererContext";
import CursorOverlay from "./components/CursorOverlay/CursorOverlay";
import HeroPortraitModel from "./components/HeroPortraitModel/HeroPortraitModel";
import WorkerUnitModel from "./components/WorkerUnitModel/WorkerUnitModel";
import GlueSmallButton from "./components/GlueSmallButton/GlueSmallButton";
import ResourceCounter from "./components/ResourceCounter/ResourceCounter";
import BnetEditBox from "./components/BnetEditBox/BnetEditBox";
import EscEditBox from "./components/EscEditBox/EscEditBox";
import GlueListBox from "./components/GlueListBox/GlueListBox";
import EscCheckbox from "./components/EscCheckbox/EscCheckbox";
import EscRadioButton from "./components/EscRadioButton/EscRadioButton";
import EscSlider from "./components/EscSlider/EscSlider";
import EscOptionButton from "./components/EscOptionButton/EscOptionButton";

const RACES = ["Human", "Orc", "NightElf", "Undead"] as const;
const DIFFICULTY = ["Easy", "Normal", "Hard"] as const;

function App() {
  const race = useCurrentRace();

  const [bnetValue, setBnetValue] = useState("");
  const [escValue, setEscValue] = useState("");
  const [listSelected, setListSelected] = useState<string | null>(null);
  const [tipsEnabled, setTipsEnabled] = useState(false);
  const [difficulty, setDifficulty] =
    useState<(typeof DIFFICULTY)[number]>("Normal");
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const tick = setInterval(tickResources, 1000);
    let rafId: number;
    const loop = () => {
      animateCounters();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      clearInterval(tick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <CursorOverlay />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "8px 16px",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          {RACES.map((r) => (
            <GlueSmallButton key={r} onClick={() => setCurrentRace(r)}>
              {r === "NightElf" ? "Night Elf" : r}
            </GlueSmallButton>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          gap: 40,
          padding: "24px 40px",
          flexWrap: "wrap",
        }}
      >
        {/* Models */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 225 }}>
            <HeroPortraitModel race={race} />
          </div>
          <WorkerUnitModel race={race} side="left" />
        </div>

        {/* Controls panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 240,
          }}
        >
          <WarcraftRenderer race={race}>
            <ResourceCounter />
            <BnetEditBox
              value={bnetValue}
              placeholder="Search..."
              onChange={setBnetValue}
            />
            <EscEditBox
              value={escValue}
              placeholder="Player name..."
              onChange={setEscValue}
            />
            <GlueListBox
              items={[
                "Human",
                "Orc",
                "NightElf",
                "Undead",
                "Naga",
                "Demon",
                "Creep",
                "Critter",
              ]}
              value={listSelected}
              onChange={setListSelected}
              height={140}
            />
            <EscSlider label="Volume" value={volume} onChange={setVolume} />
            <EscCheckbox
              label="Show tips"
              checked={tipsEnabled}
              onChange={setTipsEnabled}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {DIFFICULTY.map((d) => (
                <EscRadioButton
                  key={d}
                  label={d}
                  selected={difficulty === d}
                  onSelect={() => setDifficulty(d)}
                />
              ))}
            </div>
            <EscOptionButton
              onClick={() =>
                alert(`Saved! Volume: ${Math.round(volume * 100)}%`)
              }
            >
              Apply
            </EscOptionButton>
          </WarcraftRenderer>
        </div>
      </div>
    </>
  );
}

export default App;
