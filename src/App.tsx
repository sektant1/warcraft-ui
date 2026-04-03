import { useState } from "react";

import {
  GlueSmallButton,
  GlueScreenButton,
  GlueBorderedButton,
  GlueMenuButton,
  GlueCampaignButton,
  GlueDropdown,
  GlueScrollbar,
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
  EscEditBox,
  BnetEditBox,
  StatBar,
  LoadingBar,
  MenuPanel,
  Tooltip,
  RACES,
  type Race,
} from "@sektant1/warcraft-ui";

import "@sektant1/warcraft-ui/style.css";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h3
        style={{
          color: "#fcd312",
          fontFamily: '"Friz Quadrata", serif',
          fontSize: 16,
          margin: 0,
          textShadow: "1px 1px 2px #000",
        }}
      >
        {title}
      </h3>
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
  const [chatMsg, setChatMsg] = useState("");
  const [difficulty, setDifficulty] = useState<string>("Normal");
  const [selectedMap, setSelectedMap] = useState<string>("Lost Temple");
  const [loadProgress, setLoadProgress] = useState(42);
  const [health, setHealth] = useState(75);
  const [mana, setMana] = useState(60);
  const [xp, setXp] = useState(35);
  const [listScroll, setListScroll] = useState(0);

  return (
    <>
      <CursorOverlay />

      {/* Race selector bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "8px 16px",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          {RACES.map((r: Race) => (
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
          alignItems: "flex-start",
        }}
      >
        {/* Column 1: Models */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div style={{ width: 225 }}>
            <HeroPortraitModel race={race} />
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <WorkerUnitModel race={race} side="left" />
            <TimeIndicatorModel race={race} />
          </div>
        </div>

        {/* Column 2: ESC Menu Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 260,
          }}
        >
          <Section title="Resources">
            <ResourceCounter />
          </Section>

          <Section title="ESC Checkboxes">
            <EscCheckbox
              label="Show tips"
              checked={tipsEnabled}
              onChange={setTipsEnabled}
            />
            <EscCheckbox label="Disabled option" checked disabled />
          </Section>

          <Section title="ESC Radio Buttons">
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
          </Section>

          <Section title="ESC Sliders">
            <EscSlider
              label="Music"
              value={musicVolume}
              onChange={setMusicVolume}
            />
            <EscSlider label="SFX" value={sfxVolume} onChange={setSfxVolume} />
          </Section>

          <Section title="ESC Edit Box">
            <EscEditBox
              value={playerName}
              placeholder="Player name..."
              onChange={setPlayerName}
            />
          </Section>

          <Section title="ESC Option Button">
            <EscOptionButton
              onClick={() =>
                setCurrentRace(RACES[Math.floor(Math.random() * RACES.length)])
              }
            >
              Pick Random Race
            </EscOptionButton>
            <EscOptionButton disabled>Disabled Button</EscOptionButton>
          </Section>
        </div>

        {/* Column 3: Glue Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 260,
          }}
        >
          <Section title="GlueScreenButton">
            <GlueScreenButton onClick={() => alert("Screen button clicked!")}>
              Single Player
            </GlueScreenButton>
            <GlueScreenButton disabled>Disabled</GlueScreenButton>
          </Section>

          <Section title="GlueBorderedButton">
            <GlueBorderedButton onClick={() => alert("Bordered!")}>
              Create Game
            </GlueBorderedButton>
          </Section>

          <Section title="GlueMenuButton">
            <GlueMenuButton onClick={() => alert("Menu!")}>
              OK
            </GlueMenuButton>
            <GlueMenuButton variant="single" onClick={() => alert("Single!")}>
              Cancel
            </GlueMenuButton>
          </Section>

          <Section title="GlueCampaignButton">
            <GlueCampaignButton onClick={() => alert("Campaign!")}>
              Human Campaign
            </GlueCampaignButton>
          </Section>

          <Section title="GlueDropdown">
            <GlueDropdown
              options={DIFFICULTIES}
              value={difficulty as (typeof DIFFICULTIES)[number]}
              onChange={setDifficulty}
              label={(v) => `Difficulty: ${v}`}
            />
          </Section>

          <Section title="BnetEditBox">
            <BnetEditBox
              value={chatMsg}
              placeholder="Type a message..."
              onChange={setChatMsg}
            />
          </Section>
        </div>

        {/* Column 4: Bars, Panels, Tooltips, ListBox */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 300,
          }}
        >
          <Section title="Stat Bars">
            <StatBar label="HP" type="health" fillPercent={health} maxValue={1200} />
            <StatBar label="MP" type="mana" fillPercent={mana} maxValue={400} />
            <StatBar type="xp" fillPercent={xp} hasBorder />
            <StatBar type="build" fillPercent={62} hasBorder />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <GlueSmallButton onClick={() => setHealth(Math.min(100, health + 10))}>
                +HP
              </GlueSmallButton>
              <GlueSmallButton onClick={() => setMana(Math.min(100, mana + 10))}>
                +MP
              </GlueSmallButton>
              <GlueSmallButton onClick={() => setXp(Math.min(100, xp + 10))}>
                +XP
              </GlueSmallButton>
            </div>
          </Section>

          <Section title="Loading Bar">
            <LoadingBar progress={loadProgress} />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <GlueSmallButton
                onClick={() => setLoadProgress(Math.min(100, loadProgress + 15))}
              >
                +15%
              </GlueSmallButton>
              <GlueSmallButton onClick={() => setLoadProgress(0)}>
                Reset
              </GlueSmallButton>
            </div>
          </Section>

          <Section title="Menu Panel">
            <MenuPanel style={{ minHeight: 80, padding: 16 }}>
              <span
                style={{
                  color: "#fcd312",
                  fontFamily: '"Friz Quadrata", serif',
                  fontSize: 14,
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
              <div style={{ color: "#00c000", fontSize: 12 }}>
                Passive ability
              </div>
              <div style={{ marginTop: 4, color: "#ccc" }}>
                Increases nearby allied units&apos; mana regeneration by 0.75
                per second.
              </div>
            </Tooltip>
          </Section>

          <Section title="GlueListBox">
            <GlueListBox
              items={MAP_LIST}
              value={selectedMap as (typeof MAP_LIST)[number]}
              onChange={setSelectedMap}
              height={160}
            />
          </Section>

          <Section title="GlueScrollbar">
            <div
              style={{
                display: "flex",
                gap: 8,
                height: 120,
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  flex: 1,
                  color: "#ccc",
                  fontSize: 12,
                  overflow: "hidden",
                }}
              >
                Scroll position: {Math.round(listScroll)}%
              </div>
              <GlueScrollbar
                value={listScroll}
                onChange={setListScroll}
              />
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

export default App;
