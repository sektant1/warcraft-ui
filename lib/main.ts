// Config
export { setAssetsBaseUrl } from "../src/utils/config";

// Context / Provider
export { WarcraftRenderer, useRenderer } from "../src/context/RendererContext";

// Types
export type { Race, RacePrefix, TextureEntry } from "../src/utils/types";

// State — race
export {
  RACES,
  RACE_PREFIXES,
  useCurrentRace,
  currentRace,
  setCurrentRace,
} from "../src/state/race";

// State — resources
export {
  useGoldCurrent,
  useLumberCurrent,
  useGoldTarget,
  useLumberTarget,
  setGoldTarget,
  setLumberTarget,
  goldCurrent,
  lumberCurrent,
  tickResources,
  animateCounters,
  handleCheatKey,
} from "../src/state/resources";

// Components — self-contained canvas
export { default as GlueSmallButton } from "../src/components/GlueSmallButton/GlueSmallButton";
export { default as GlueScreenButton } from "../src/components/GlueScreenButton/GlueScreenButton";
export { default as GlueBorderedButton } from "../src/components/GlueBorderedButton/GlueBorderedButton";
export { default as GlueMenuButton } from "../src/components/GlueMenuButton/GlueMenuButton";
export { default as GlueCampaignButton } from "../src/components/GlueCampaignButton/CampaignButton";
export { default as GlueDropdown } from "../src/components/GlueDropdown/GlueDropdown";
export { default as GlueScrollbar } from "../src/components/GlueScrollbar/GlueScrollbar";
export { default as BnetEditBox } from "../src/components/BnetEditBox/BnetEditBox";
export { default as EscEditBox } from "../src/components/EscEditBox/EscEditBox";
export { default as HeroPortraitModel } from "../src/components/HeroPortraitModel/HeroPortraitModel";
export { default as ItemModel } from "../src/components/ItemModel/ItemModel";
export { default as TopHudWebGL } from "../src/components/TopHudWebGL/TopHudWebGL";
