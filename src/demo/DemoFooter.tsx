import { REPO_URL } from "./data";

export default function DemoFooter() {
  return (
    <footer className="demo-footer">
      <p>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          @sektant1/warcraft-ui
        </a>{" "}
        · Game assets are not included and must be
        extracted from your own copy of Warcraft III.
      </p>
      <p className="demo-footer__fine">
        Warcraft is a trademark of Blizzard Entertainment, Inc. This is an
        unofficial fan project and is not affiliated with or endorsed by
        Blizzard.
      </p>
    </footer>
  );
}
