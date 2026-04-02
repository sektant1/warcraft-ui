import HeroPortraitModel from "./components/HeroPortraitModel/HeroPortraitModel";
import "./App.css";
import GlueSmallButton from "./components/GlueSmallButton/GlueSmallButton";

function App() {
  return (
    <>
      <div style={{ width: 225 }}>
        <HeroPortraitModel race="Human" />
      </div>
      <section id="center">
        <div style={{ padding: 40 }}>
          <GlueSmallButton onClick={() => console.log("clicked")}>
            Confirmar
          </GlueSmallButton>
        </div>
      </section>
    </>
  );
}

export default App;
