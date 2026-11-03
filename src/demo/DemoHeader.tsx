import { EscOptionButton, RACES, RACE_PREFIXES, setCurrentRace, type Race } from "../../lib/main";
import { REPO_URL } from "./data";

const INSTALL_CMD = "npm install @sektant1/warcraft-ui";

interface Props {
  race: Race;
  onNotify: (message: string) => void;
}

export default function DemoHeader({ race, onNotify }: Props) {
  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      onNotify("Install command copied");
    } catch {
      onNotify("Copy failed — select the command manually");
    }
  };

  return (
    <header className="demo-header">
      <h1 className="demo-site-logo">
        <img src="./site-logo.png" alt="Warcraft III UI Component Library" />
      </h1>
      <p className="demo-tagline">
        React components rendered from original Warcraft III textures and
        models — canvas, WebGL, race-aware.
      </p>

      <div className="demo-install">
        <code>{INSTALL_CMD}</code>
        <button type="button" className="demo-link-btn" onClick={copyInstall}>
          Copy
        </button>
        <a className="demo-link-btn" href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>

      <nav className="demo-race-bar" aria-label="Race">
        {RACES.map((r) => (
          <div
            key={r}
            className={`demo-race-opt${r === race ? " is-active" : ""}`}
            aria-current={r === race ? "true" : undefined}
          >
            <EscOptionButton onClick={() => setCurrentRace(r)}>
              {RACE_PREFIXES[r].display}
            </EscOptionButton>
          </div>
        ))}
      </nav>
    </header>
  );
}
