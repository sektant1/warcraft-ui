import { useState } from "react";

import {
  GlueSmallButton,
  GlueScreenButton,
  GlueBorderedButton,
  GlueMenuButton,
  GlueCampaignButton,
  GlueDropdown,
  GlueListBox,
  useCurrentRace,
  setCurrentRace,
  CursorOverlay,
  HeroPortraitModel,
  ResourceCounter,
  WorkerUnitModel,
  TimeIndicatorModel,
  EscOptionButton,
  EscRadioButton,
  EscCheckbox,
  EscSlider,
  InputBox,
  StatBar,
  LoadingBar,
  MenuPanel,
  Tooltip,
  RACES,
  type Race,
} from "../lib/main";

import "./index.css";

const DIFFICULTIES = ["Easy", "Normal", "Hard", "Insane"] as const;
const MAP_LIST = [
  "Lost Temple",
  "Turtle Rock",
  "Gnoll Wood",
  "Plunder Isle",
  "Twisted Meadows",
  "Echo Isles",
  "Terenas Stand",
  "Centaur Grove",
] as const;

function Section({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        ...style,
      }}
    >
      <div
        style={{
          color: "#c8a44e",
          fontFamily: '"Friz Quadrata", serif',
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1,
          textShadow: "1px 1px 2px #000",
          borderBottom: "1px solid rgba(200,164,78,0.25)",
          paddingBottom: 4,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function App() {
  const race = useCurrentRace();

  const [tipsEnabled, setTipsEnabled] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState<string>("Normal");
  const [selectedMap, setSelectedMap] = useState<string>("Lost Temple");
  const [loadProgress, setLoadProgress] = useState(42);
  const [health, setHealth] = useState(75);
  const [mana, setMana] = useState(60);
  const [xp, setXp] = useState(35);

  return (
    <>
      <CursorOverlay />

      {/* Race selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "10px 16px",
        }}
      >
        {RACES.map((r: Race) => (
          <GlueSmallButton key={r} onClick={() => setCurrentRace(r)}>
            {r === "NightElf" ? "Night Elf" : r}
          </GlueSmallButton>
        ))}
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 240px 300px 280px",
          gap: "24px 32px",
          padding: "16px 32px 40px",
          maxWidth: 1200,
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {/* ── Column 1: Models ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ width: 300 }}>
            <HeroPortraitModel race={race} />
            <WorkerUnitModel race={race} side="left" />
          </div>
        </div>

        {/* ── Column 2: ESC Menu Controls ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Section title="Resources">
            <ResourceCounter />
          </Section>

          <Section title="Checkboxes">
            <EscCheckbox
              label="Show tips"
              checked={tipsEnabled}
              onChange={setTipsEnabled}
            />
            <EscCheckbox label="Disabled" checked disabled />
          </Section>

          <Section title="Radio Buttons">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {RACES.map((r: Race) => (
                <EscRadioButton
                  key={r}
                  label={r}
                  selected={race === r}
                  onSelect={() => setCurrentRace(r)}
                />
              ))}
            </div>
          </Section>

          <Section title="Sliders">
            <EscSlider
              label="Music"
              value={musicVolume}
              onChange={setMusicVolume}
            />
            <EscSlider label="SFX" value={sfxVolume} onChange={setSfxVolume} />
          </Section>

          <Section title="Input Box">
            <InputBox
              value={playerName}
              placeholder="Player name..."
              onChange={setPlayerName}
            />
          </Section>

          <Section title="Option Buttons">
            <EscOptionButton
              onClick={() =>
                setCurrentRace(RACES[Math.floor(Math.random() * RACES.length)])
              }
            >
              Random Race
            </EscOptionButton>
            <EscOptionButton disabled>Disabled</EscOptionButton>
          </Section>
        </div>

        {/* ── Column 3: Glue Buttons ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Section title="Screen Button">
            <GlueScreenButton onClick={() => alert("Click!")}>
              Single Player
            </GlueScreenButton>
            <GlueScreenButton disabled>Disabled</GlueScreenButton>
          </Section>

          <Section title="Bordered Button">
            <GlueBorderedButton onClick={() => alert("Click!")}>
              Create Game
            </GlueBorderedButton>
          </Section>

          <Section title="Menu Button">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <GlueMenuButton onClick={() => alert("OK")}>OK</GlueMenuButton>
              <GlueMenuButton variant="single" onClick={() => alert("Cancel")}>
                Cancel
              </GlueMenuButton>
            </div>
          </Section>

          <Section title="Campaign Button">
            <GlueCampaignButton onClick={() => alert("Campaign!")}>
              Human Campaign
            </GlueCampaignButton>
          </Section>

          <Section title="Dropdown">
            <GlueDropdown
              options={MAP_LIST}
              value={selectedMap as (typeof MAP_LIST)[number]}
              onChange={setSelectedMap}
            />
          </Section>

          <Section title="Bnet Edit Box">
            <GlueListBox
              items={DIFFICULTIES}
              value={difficulty as (typeof DIFFICULTIES)[number]}
              onChange={setDifficulty}
              height={120}
            />
          </Section>
        </div>

        {/* ── Column 4: Bars, Panels, Lists ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Section title="Stat Bars">
            <StatBar
              label="HP"
              type="health"
              fillPercent={health}
              maxValue={1200}
            />
            <StatBar label="MP" type="mana" fillPercent={mana} maxValue={400} />
            <StatBar type="xp" fillPercent={xp} hasBorder />
            <StatBar type="build" fillPercent={62} hasBorder />
            <div style={{ display: "flex", gap: 6 }}>
              <GlueSmallButton
                onClick={() => setHealth(Math.min(100, health + 10))}
              >
                +HP
              </GlueSmallButton>
              <GlueSmallButton
                onClick={() => setMana(Math.min(100, mana + 10))}
              >
                +MP
              </GlueSmallButton>
              <GlueSmallButton onClick={() => setXp(Math.min(100, xp + 10))}>
                +XP
              </GlueSmallButton>
            </div>
          </Section>

          <Section title="Loading Bar">
            <LoadingBar progress={loadProgress} />
            <div style={{ display: "flex", gap: 6 }}>
              <GlueSmallButton
                onClick={() =>
                  setLoadProgress(Math.min(100, loadProgress + 15))
                }
              >
                +15%
              </GlueSmallButton>
              <GlueSmallButton onClick={() => setLoadProgress(0)}>
                Reset
              </GlueSmallButton>
            </div>
          </Section>

          <Section title="Menu Panel">
            <MenuPanel style={{ minHeight: 60, padding: 12 }}>
              <span
                style={{
                  color: "#fcd312",
                  fontFamily: '"Friz Quadrata", serif',
                  fontSize: 13,
                }}
              >
                Panel content goes here
              </span>
            </MenuPanel>
          </Section>

          <Section title="Tooltip">
            <Tooltip>
              <div>
                <strong style={{ color: "#fcd312" }}>Brilliance Aura</strong>
              </div>
              <div style={{ color: "#00c000", fontSize: 11 }}>
                Passive ability
              </div>
              <div style={{ marginTop: 4, color: "#ccc", fontSize: 12 }}>
                Increases nearby allied units&apos; mana regeneration by 0.75
                per second.
              </div>
            </Tooltip>
          </Section>

          <Section title="List Box + Scrollbar">
            <div style={{ display: "flex", gap: 0, height: 140 }}>
              <div style={{ flex: 1 }}>
                <GlueListBox
                  items={MAP_LIST}
                  value={selectedMap as (typeof MAP_LIST)[number]}
                  onChange={setSelectedMap}
                  height={140}
                />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

export default App;
