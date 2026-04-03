import type { Race, TextureEntry } from "../utils/types";
import { RACE_PREFIXES, RACES } from "../state/race";
import type { TextureManager } from "./TextureManager";

export interface RaceTextures {
  topTile1: TextureEntry;
  topTile2: TextureEntry;
  topTile3: TextureEntry;
  topTile4: TextureEntry;
  timeSky: TextureEntry;
  timeFrame: TextureEntry;
  hudTile1: TextureEntry;
  hudTile2: TextureEntry;
  hudTile3: TextureEntry;
  hudTile4: TextureEntry;
  upperBtn: TextureEntry;
  gold: TextureEntry;
  lumber: TextureEntry;
  supply: TextureEntry;
  escBtnBg: TextureEntry;
  escBtnBorder: TextureEntry;
  escBtnHighlight: TextureEntry;
  escMenuBg: TextureEntry;
  escMenuBorder: TextureEntry;
  cbBg: TextureEntry;
  cbCheck: TextureEntry;
  cbDepressed: TextureEntry;
  rbBg: TextureEntry;
  rbDot: TextureEntry;
  sliderBg: TextureEntry;
  sliderBorder: TextureEntry;
  sliderKnob: TextureEntry;
  ebBg: TextureEntry;
  ebBorder: TextureEntry;
  tooltipBg: TextureEntry;
  healthFill: TextureEntry;
  manaFill: TextureEntry;
  xpFill: TextureEntry;
  xpBorder: TextureEntry;
  buildFill: TextureEntry;
  buildBorder: TextureEntry;
  loadBg: TextureEntry;
  loadFill: TextureEntry;
  loadBorder: TextureEntry;
  loadGlass: TextureEntry;
  glueBg: TextureEntry;
  glueBorder: TextureEntry;
  glueBgDown: TextureEntry;
  glueBorderDown: TextureEntry;
  glueBgDisabled: TextureEntry;
  glueBorderDisabled: TextureEntry;
  glueHighlight: TextureEntry;
  glueBorderedBorder: TextureEntry;
  glueBorderedBorderDown: TextureEntry;
  glueMenuFrame: TextureEntry;
  cursor: TextureEntry;
  // Tiled versions
  escBtnBgTiled: TextureEntry;
  escMenuBgTiled: TextureEntry;
  tooltipBgTiled: TextureEntry;
  glueBgTiled: TextureEntry;
  glueBgDownTiled: TextureEntry;
  glueBgDisabledTiled: TextureEntry;
  [key: string]: TextureEntry;
}

export function raceTexturePaths(race: Race): Record<string, string> {
  const rp = RACE_PREFIXES[race];
  const c = `console/${race}/`;
  const esc = `buttons/esc/${rp.esc}/`;
  const escH = `buttons/esc/human/`;

  return {
    topTile1: c + rp.tile + "UITile01.png",
    topTile2: c + rp.tile + "UITile02.png",
    topTile3: c + rp.tile + "UITile03.png",
    topTile4: c + rp.tile + "UITile04.png",
    timeSky: c + rp.tile + "UITile-TimeIndicator.png",
    timeFrame: c + rp.tile + "UITile-TimeIndicatorFrame.png",
    hudTile1: c + rp.tile + "UITile01.png",
    hudTile2: c + rp.tile + "UITile02.png",
    hudTile3: c + rp.tile + "UITile03.png",
    hudTile4: c + rp.tile + "UITile04.png",
    upperBtn: `console-buttons/${rp.lower}-console-buttonstates2.blp`,
    gold: "resources/ResourceGold.blp",
    lumber: "resources/ResourceLumber.blp",
    supply: `resources/Resource${race}.blp`,
    escBtnBg:
      race === "Human"
        ? escH + "human-options-menu-background.blp"
        : esc + rp.esc + "-options-button-background.blp",
    escBtnBorder: escH + "human-options-button-border-up.blp",
    escBtnHighlight: esc + rp.esc + "-options-button-highlight.blp",
    escMenuBg: esc + rp.esc + "-options-menu-background.blp",
    escMenuBorder: esc + rp.esc + "-options-menu-border.blp",
    cbBg: "buttons/checkbox/checkbox-background.blp",
    cbCheck: "buttons/checkbox/checkbox-check.blp",
    cbDepressed:
      race === "Human"
        ? "buttons/checkbox/checkbox-depressed.blp"
        : `buttons/checkbox/${rp.esc}-checkbox-depressed.blp`,
    rbBg: "buttons/radio/radiobutton-background.blp",
    rbDot: "buttons/radio/radiobutton-button.blp",
    sliderBg: "buttons/slider/slider-background.blp",
    sliderBorder: "buttons/slider/slider-border.blp",
    sliderKnob:
      race === "Human"
        ? "buttons/slider/slider-knob.blp"
        : `buttons/slider/${rp.esc}-slider-knob.blp`,
    ebBg: "borders/esc/editbox-background.blp",
    ebBorder: "borders/esc/editbox-border.blp",
    tooltipBg: "tooltips/human-tooltip-background.blp",
    healthFill: `bars/${rp.lower}-healthbar-fill.blp`,
    manaFill: `bars/${rp.lower}-manabar-fill.blp`,
    xpFill: `bars/${rp.lower}-bigbar-fill.blp`,
    xpBorder: `bars/${rp.lower}-xpbar-border.blp`,
    buildFill: `bars/${rp.lower}-buildprogressbar-fill.blp`,
    buildBorder: `bars/${rp.lower}-buildprogressbar-border.blp`,
    loadBg: "loading/Loading-BarBackground.blp",
    loadFill: "loading/Loading-BarFill.blp",
    loadBorder: "loading/Loading-BarBorder.blp",
    loadGlass: "loading/Loading-BarGlass.blp",
    glueBg: "buttons/glue/GlueScreen-Button1-BackdropBackground.blp",
    glueBorder: "buttons/glue/GlueScreen-Button1-BackdropBorder.blp",
    glueBgDown: "buttons/glue/GlueScreen-Button1-BackdropBackground-Down.blp",
    glueBorderDown: "buttons/glue/GlueScreen-Button1-BackdropBorder-Down.blp",
    glueBgDisabled:
      "buttons/glue/GlueScreen-Button1-BackdropBackground-Disabled.blp",
    glueBorderDisabled:
      "buttons/glue/GlueScreen-Button1-BackdropBorder-Disabled.blp",
    glueHighlight: "buttons/glue/bnet-button01-highlight-mouse.blp",
    glueBorderedBorder:
      "buttons/glue/GlueScreen-Button1-BorderedBackdropBorder.blp",
    glueBorderedBorderDown:
      "buttons/glue/GlueScreen-Button1-BorderedBackdropBorder-Down.blp",
    glueMenuFrame: "buttons/glue/GlueScreen-Button1-Border.blp",
    cursor: `cursor/${race}Cursor.blp`,
  };
}

export function loadRaceTextures(
  race: Race,
  texManager: TextureManager,
): RaceTextures {
  const paths = raceTexturePaths(race);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tex: any = {};
  for (const [key, path] of Object.entries(paths)) {
    tex[key] = texManager.load(path);
  }
  tex.escBtnBgTiled = texManager.loadRepeat(paths.escBtnBg);
  tex.escMenuBgTiled = texManager.loadRepeat(paths.escMenuBg);
  tex.tooltipBgTiled = texManager.loadRepeat(paths.tooltipBg);
  tex.glueBgTiled = texManager.loadRepeat(paths.glueBg);
  tex.glueBgDownTiled = texManager.loadRepeat(paths.glueBgDown);
  tex.glueBgDisabledTiled = texManager.loadRepeat(paths.glueBgDisabled);
  return tex as RaceTextures;
}

export function preloadAllRaces(texManager: TextureManager) {
  RACES.forEach((r) => {
    const paths = raceTexturePaths(r);
    Object.values(paths).forEach((p) => texManager.load(p));
  });
}
