import { useState } from "react";

import {
  GlueSmallButton,
  GlueScreenButton,
  GlueBorderedButton,
  GlueMenuButton,
  GlueCampaignButton,
  GlueDropdown,
  GlueListBox,
  CommandCard,
  BLADEMASTER_SLOTS,
  useCurrentRace,
  setCurrentRace,
  CursorOverlay,
  HeroPortraitModel,
  ResourceCounter,
  WorkerUnitModel,
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
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="demo-section">
      <div className="demo-section-title">{title}</div>
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
    <div className="wc3-scene">
      <CursorOverlay />

      {/* Race selector */}
      <header className="demo-race-bar">
        {RACES.map((r: Race) => (
          <GlueSmallButton key={r} onClick={() => setCurrentRace(r)}>
            {r === "NightElf" ? "Night Elf" : r}
          </GlueSmallButton>
        ))}
      </header>

      {/* Main content */}
      <main className="demo-grid">
        {/* ── Column 1: 3D Models ── */}
        <div className="demo-col demo-col--models">
          <Section title="Hero Portrait">
            <div className="demo-hero-wrap">
              <HeroPortraitModel race={race} />
            </div>
          </Section>
          <Section title="Worker Unit">
            <div className="demo-worker-wrap">
              <WorkerUnitModel race={race} side="left" />
            </div>
          </Section>
        </div>

        {/* ── Column 2: ESC Menu Controls ── */}
        <div className="demo-col">
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
            <div className="demo-radio-group">
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
        <div className="demo-col">
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
            <div className="demo-btn-stack">
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

        {/* ── Column 4: CommandCard, Bars, Panels ── */}
        <div className="demo-col">
          <Section title="Command Card">
            <CommandCard slots={BLADEMASTER_SLOTS} />
          </Section>

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
            <div className="demo-btn-row">
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
            <div className="demo-btn-row">
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
              <span className="demo-panel-text">
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
            <GlueListBox
              items={MAP_LIST}
              value={selectedMap as (typeof MAP_LIST)[number]}
              onChange={setSelectedMap}
              height={140}
            />
          </Section>
        </div>
      </main>
    </div>
  );
}

export default App;
