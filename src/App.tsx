import { useMemo, useState } from "react";

import {
  GlueScreenButton,
  GlueBorderedButton,
  GlueMenuButton,
  GlueCampaignButton,
  GlueDropdown,
  GlueListBox,
  CommandCard,
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
  SectionTitle,
  Heading,
  BlpIcon,
  Table,
  RACES,
  RACE_PREFIXES,
} from "../lib/main";

import {
  HEROES,
  HERO_COMMAND_CARDS,
  HERO_TABLE_COLUMNS,
  heroTableRows,
  MAP_LIST,
  type MapName,
} from "./demo/data";
import { useAnimatedBars } from "./demo/useAnimatedBars";
import { useToast } from "./demo/useToast";
import { Toast } from "./demo/Toast";
import DemoHeader from "./demo/DemoHeader";
import DemoFooter from "./demo/DemoFooter";

import "./demo/demo.css";

function App() {
  const race = useCurrentRace();
  const hero = HEROES[race];
  const toast = useToast();

  const [tipsEnabled, setTipsEnabled] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [playerName, setPlayerName] = useState("");
  const [selectedMap, setSelectedMap] = useState<MapName>("Lost Temple");
  const [animateBars, setAnimateBars] = useState(true);
  const { values: bars, setValue: setBar } = useAnimatedBars(animateBars);

  const hp = { current: (hero.hp * bars.hp) / 100, max: hero.hp };
  const mp = { current: (hero.mp * bars.mp) / 100, max: hero.mp };
  const tableRows = useMemo(() => heroTableRows(race), [race]);

  return (
    <div className="wc3-scene">
      <CursorOverlay />
      <DemoHeader race={race} onNotify={toast.show} />

      <main className="demo-grid">
        {/* ── Column 1: in-game HUD ── */}
        <div className="demo-col">
          <SectionTitle title={`Hero Portrait — ${hero.name}`}>
            <div className="demo-hero-wrap">
              <HeroPortraitModel race={race} hp={hp} mp={mp} />
            </div>
          </SectionTitle>

          <SectionTitle title="Resources">
            <ResourceCounter />
          </SectionTitle>

          <SectionTitle title="Command Card">
            <CommandCard slots={HERO_COMMAND_CARDS[race]} />
          </SectionTitle>

          <SectionTitle title="Worker Unit">
            <div className="demo-worker-wrap">
              <WorkerUnitModel race={race} side="left" />
            </div>
          </SectionTitle>
        </div>

        {/* ── Column 2: glue (menu) controls ── */}
        <div className="demo-col">
          <SectionTitle title="Screen Button">
            <GlueScreenButton onClick={() => toast.show("Single Player")}>
              Single Player
            </GlueScreenButton>
            <GlueScreenButton disabled>Disabled</GlueScreenButton>
          </SectionTitle>

          <SectionTitle title="Bordered Button">
            <GlueBorderedButton onClick={() => toast.show("Create Game")}>
              Create Game
            </GlueBorderedButton>
          </SectionTitle>

          <SectionTitle title="Option Buttons" className="demo-center">
            <EscOptionButton
              onClick={() => {
                const next = RACES[Math.floor(Math.random() * RACES.length)];
                setCurrentRace(next);
                toast.show(`Race: ${RACE_PREFIXES[next].display}`);
              }}
            >
              Random Race
            </EscOptionButton>
            <EscOptionButton disabled>Disabled</EscOptionButton>
          </SectionTitle>

          <SectionTitle title="Menu Button" className="demo-center">
            <div className="demo-btn-stack">
              <GlueMenuButton onClick={() => toast.show("OK")}>OK</GlueMenuButton>
              <GlueMenuButton variant="single" onClick={() => toast.show("Cancel")}>
                Cancel
              </GlueMenuButton>
            </div>
          </SectionTitle>

          <SectionTitle title="Campaign Button">
            <GlueCampaignButton onClick={() => toast.show("Human Campaign")}>
              Human Campaign
            </GlueCampaignButton>
          </SectionTitle>

          <SectionTitle title="Sliders">
            <EscSlider label="Music" value={musicVolume} onChange={setMusicVolume} />
            <EscSlider label="SFX" value={sfxVolume} onChange={setSfxVolume} />
          </SectionTitle>

          <SectionTitle title="Input Box">
            <InputBox value={playerName} placeholder="Player name..." onChange={setPlayerName} />
          </SectionTitle>

          <SectionTitle title="Dropdown">
            <GlueDropdown options={MAP_LIST} value={selectedMap} onChange={setSelectedMap} />
          </SectionTitle>

          <SectionTitle title="List Box + Scrollbar">
            <GlueListBox
              items={MAP_LIST}
              value={selectedMap}
              onChange={setSelectedMap}
              height={140}
            />
          </SectionTitle>
        </div>

        {/* ── Column 3: typography, bars, panels ── */}
        <div className="demo-col">
          <SectionTitle title="Headings">
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2} icon={<BlpIcon path="resources/ResourceGold.blp" size={20} />}>
              Heading 2
            </Heading>
            <Heading level={3} icon={<BlpIcon path="resources/ResourceLumber.blp" size={16} />}>
              Heading 3
            </Heading>
            <Heading level={4}>Heading 4</Heading>
          </SectionTitle>

          <SectionTitle title="Stat Bars">
            <StatBar label="HP" type="health" fillPercent={bars.hp} maxValue={hero.hp} />
            <StatBar label="MP" type="mana" fillPercent={bars.mp} maxValue={hero.mp} />
            <StatBar type="xp" fillPercent={bars.xp} />
            <StatBar type="build" fillPercent={bars.build} />
            <div className="demo-bar-controls">
              <EscCheckbox label="Animate bars" checked={animateBars} onChange={setAnimateBars} />
              {!animateBars && (
                <>
                  <EscSlider label="HP" value={bars.hp / 100} onChange={(v) => setBar("hp", v * 100)} />
                  <EscSlider label="MP" value={bars.mp / 100} onChange={(v) => setBar("mp", v * 100)} />
                  <EscSlider label="XP" value={bars.xp / 100} onChange={(v) => setBar("xp", v * 100)} />
                </>
              )}
            </div>
          </SectionTitle>

          <SectionTitle title="Loading Bar">
            <LoadingBar progress={bars.load} />
          </SectionTitle>

          <SectionTitle title="Menu Panel">
            <MenuPanel style={{ minHeight: 60, padding: 12 }}>
              <span className="demo-panel-text">Panel content goes here</span>
            </MenuPanel>
          </SectionTitle>

          <SectionTitle title="Checkboxes">
            <EscCheckbox label="Show tips" checked={tipsEnabled} onChange={setTipsEnabled} />
            <EscCheckbox label="Disabled" checked disabled />
          </SectionTitle>

          <SectionTitle title="Radio Buttons">
            <div className="demo-radio-group" role="radiogroup" aria-label="Race">
              {RACES.map((r) => (
                <EscRadioButton
                  key={r}
                  label={RACE_PREFIXES[r].display}
                  selected={race === r}
                  onSelect={() => setCurrentRace(r)}
                />
              ))}
            </div>
          </SectionTitle>

          <SectionTitle title="Tooltip">
            <Tooltip icon={<BlpIcon path="buttons/command/BTNBrilliance.blp" size={38} />}>
              <div>
                <strong style={{ color: "#fcd312" }}>Brilliance Aura</strong>
              </div>
              <div style={{ color: "#00c000", fontSize: 11 }}>Passive ability</div>
              <div style={{ marginTop: 4, color: "#ccc", fontSize: 12 }}>
                Increases nearby allied units&apos; mana regeneration by 0.75 per second.
              </div>
            </Tooltip>
            <Tooltip>
              <div>
                <strong style={{ color: "#fcd312" }}>Without icon</strong>
              </div>
              <div style={{ marginTop: 4, color: "#ccc", fontSize: 12 }}>
                Tooltips still work without an icon.
              </div>
            </Tooltip>
          </SectionTitle>
        </div>

        {/* ── Full width ── */}
        <div className="demo-wide">
          <SectionTitle title="Table">
            <div className="demo-table-wrap">
              <Table columns={HERO_TABLE_COLUMNS} rows={tableRows} showRowNumbers />
            </div>
          </SectionTitle>
        </div>
      </main>

      <DemoFooter />
      <Toast message={toast.message} id={toast.id} />
    </div>
  );
}

export default App;
