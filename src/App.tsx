import HeroPortraitModel from "./components/HeroPortraitModel/HeroPortraitModel";
import "./App.css";
import GlueSmallButton from "./components/GlueSmallButton/GlueSmallButton";
import WorkerUnitModel from "./components/WorkerUnitModel/WorkerUnitModel";
import { useCurrentRace, setCurrentRace } from "./state/race";

setCurrentRace("Orc");

function App() {
  return (
    <>
      <div style={{ width: 225 }}>
        <HeroPortraitModel race={useCurrentRace()} />
      </div>
      <section id="center">
        <div style={{ padding: 40 }}>
          <GlueSmallButton onClick={() => setCurrentRace("Human")}>
            Human
          </GlueSmallButton>
          <GlueSmallButton onClick={() => setCurrentRace("Orc")}>
            Orc
          </GlueSmallButton>
          <GlueSmallButton onClick={() => setCurrentRace("NightElf")}>
            Night Elf
          </GlueSmallButton>
          <GlueSmallButton onClick={() => setCurrentRace("Undead")}>
            Undead
          </GlueSmallButton>
        </div>
        <WorkerUnitModel race={useCurrentRace()} side="left" />
      </section>
    </>
  );
}

export default App;
