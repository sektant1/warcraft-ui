import { useState } from "react";

import {
  GlueSmallButton,
  useCurrentRace,
  setCurrentRace,
  CursorOverlay,
  HeroPortraitModel,
  ResourceCounter,
  WarcraftRenderer,
  WorkerUnitModel,
  EscOptionButton,
  EscRadioButton,
  EscCheckbox,
  RACES,
  type Race,
} from "../lib/main";

import "./index.css";

function App() {
  const race = useCurrentRace();

  const [tipsEnabled, setTipsEnabled] = useState(false);

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
          {RACES.map((race: Race) => (
            <GlueSmallButton key={race} onClick={() => setCurrentRace(race)}>
              {race === "NightElf" ? "Night Elf" : race}
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

        <WarcraftRenderer race={race}>
          {/* Controls panel — no WarcraftRenderer wrapper needed */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              width: 240,
            }}
          >
            <ResourceCounter />
            <EscCheckbox
              label="Show tips"
              checked={tipsEnabled}
              onChange={setTipsEnabled}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {RACES.map((r: Race) => (
                <EscRadioButton
                  key={r}
                  label={r}
                  selected={race === r}
                  onSelect={() => setCurrentRace(r)}
                />
              ))}
            </div>
            <EscOptionButton
              onClick={() =>
                setCurrentRace(RACES[Math.floor(Math.random() * RACES.length)])
              }
            >
              Pick Random Race
            </EscOptionButton>
          </div>
        </WarcraftRenderer>
      </div>
    </>
  );
}

export default App;
