import { describe, it, expect } from "vitest";
import * as lib from "../../lib/main";

describe("Library exports", () => {
  it("exports all expected components", () => {
    const expectedComponents = [
      "GlueSmallButton",
      "GlueScreenButton",
      "GlueBorderedButton",
      "GlueMenuButton",
      "GlueCampaignButton",
      "GlueDropdown",
      "GlueScrollbar",
      "GlueListBox",
      "EscCheckbox",
      "EscRadioButton",
      "EscSlider",
      "InputBox",
      "EscOptionButton",
      "BnetEditBox",
      "HeroPortraitModel",
      "ItemModel",
      "WorkerUnitModel",
      "TimeIndicatorModel",
      "TopHudWebGL",
      "BottomHud",
      "ResourceCounter",
      "CursorOverlay",
      "CommandCard",
      "StatBar",
      "LoadingBar",
      "MenuPanel",
      "Tooltip",
      "HeroGallery",
      "SectionTitle",
      "Heading",
      "BlpIcon",
    ];

    for (const name of expectedComponents) {
      expect(lib).toHaveProperty(name);
      expect(typeof (lib as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("exports race state utilities", () => {
    expect(lib).toHaveProperty("RACES");
    expect(lib).toHaveProperty("RACE_PREFIXES");
    expect(lib).toHaveProperty("useCurrentRace");
    expect(lib).toHaveProperty("setCurrentRace");
    expect(typeof lib.setCurrentRace).toBe("function");
  });

  it("exports setAssetsBaseUrl config", () => {
    expect(lib).toHaveProperty("setAssetsBaseUrl");
    expect(typeof lib.setAssetsBaseUrl).toBe("function");
  });

  it("exports createEmptySlots helper", () => {
    expect(typeof lib.createEmptySlots).toBe("function");
    const slots = lib.createEmptySlots();
    expect(slots).toHaveLength(12);
    expect(slots.every((s) => s.state === "empty")).toBe(true);
  });

  it("createEmptySlots accepts custom count", () => {
    const slots = lib.createEmptySlots(6);
    expect(slots).toHaveLength(6);
  });

  it("does NOT export site-specific modules", () => {
    expect(lib).not.toHaveProperty("AuthModal");
    expect(lib).not.toHaveProperty("AuthButton");
    expect(lib).not.toHaveProperty("SiteHeader");
    expect(lib).not.toHaveProperty("useAuth");
    expect(lib).not.toHaveProperty("usePage");
  });

  it("does NOT export deprecated renderer", () => {
    expect(lib).not.toHaveProperty("WarcraftRenderer");
    expect(lib).not.toHaveProperty("useRenderer");
  });

  it("does NOT export demo-specific data", () => {
    expect(lib).not.toHaveProperty("BLADEMASTER_SLOTS");
  });
});
