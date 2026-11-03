import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CommandCard, StatBar, LoadingBar, Table, setAssetsBaseUrl } from "../../lib/main";
import type { CommandSlot, TableColumn, TableRowDef } from "../../lib/main";
import { resolveAssetPath } from "../utils/config";
import { healthColor } from "../utils/healthColor";
import { loadFirstBlpCanvas } from "../utils/blpLoader";

describe("resolveAssetPath", () => {
  afterEach(() => setAssetsBaseUrl("/"));

  it("joins base and path with exactly one slash", () => {
    setAssetsBaseUrl("https://cdn.example.com/wc3/");
    expect(resolveAssetPath("bars/x.blp")).toBe("https://cdn.example.com/wc3/bars/x.blp");
    setAssetsBaseUrl("https://cdn.example.com/wc3");
    expect(resolveAssetPath("bars/x.blp")).toBe("https://cdn.example.com/wc3/bars/x.blp");
  });

  it("normalises ./ and leading / in asset paths", () => {
    setAssetsBaseUrl("/warcraft-ui/");
    expect(resolveAssetPath("./models/a.mdx")).toBe("/warcraft-ui/models/a.mdx");
    expect(resolveAssetPath("/models/a.mdx")).toBe("/warcraft-ui/models/a.mdx");
  });

  it("leaves absolute URLs untouched", () => {
    setAssetsBaseUrl("/base/");
    expect(resolveAssetPath("https://x.test/a.blp")).toBe("https://x.test/a.blp");
    expect(resolveAssetPath("data:image/png;base64,AA")).toBe("data:image/png;base64,AA");
  });
});

describe("healthColor", () => {
  it("is red when empty, green when full", () => {
    expect(healthColor(0)).toBe("#dc2a16");
    expect(healthColor(100)).toBe("#43d53d");
  });

  it("clamps out-of-range and non-finite input", () => {
    expect(healthColor(-50)).toBe(healthColor(0));
    expect(healthColor(500)).toBe(healthColor(100));
    expect(healthColor(Number.NaN)).toBe(healthColor(0));
  });
});

describe("loadFirstBlpCanvas", () => {
  it("rejects when every candidate fails", async () => {
    // setup.ts mocks fetch with ok: false
    await expect(loadFirstBlpCanvas(["a.blp", "b.blp"])).rejects.toThrow();
  });
});

describe("StatBar / LoadingBar", () => {
  it("exposes progress to assistive tech and clamps the value", () => {
    render(<StatBar label="HP" type="health" fillPercent={150} maxValue={600} />);
    const bar = screen.getByRole("progressbar", { name: "HP" });
    expect(bar).toHaveAttribute("aria-valuenow", "600");
    // toHaveTextContent normalises the non-breaking spaces to plain ones
    expect(bar).toHaveTextContent("600 / 600");
  });

  it("shows a percentage for build bars", () => {
    render(<StatBar type="build" fillPercent={42.25} />);
    expect(screen.getByRole("progressbar")).toHaveTextContent("42.3%");
  });

  it("loading bar clamps and floors its label", () => {
    render(<LoadingBar progress={-5} />);
    expect(screen.getByRole("progressbar")).toHaveTextContent("0%");
  });
});

describe("CommandCard tooltip", () => {
  const slots: CommandSlot[] = [
    {
      hotkey: "Q",
      label: "Blizzard",
      state: "ready",
      tooltip: { name: "Blizzard", description: "Ice shards.", manaCost: 0 },
    },
  ];

  it("shows on hover and hides on leave", () => {
    render(<CommandCard slots={slots} />);
    const btn = screen.getByRole("button", { name: "Blizzard (Q)" });
    fireEvent.mouseEnter(btn);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Ice shards.");
    fireEvent.mouseLeave(btn);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on keyboard focus", () => {
    render(<CommandCard slots={slots} />);
    act(() => screen.getByRole("button", { name: "Blizzard (Q)" }).focus());
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("renders a zero mana cost instead of a stray 0", () => {
    render(<CommandCard slots={slots} />);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Blizzard (Q)" }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Mana: 0");
  });
});

describe("Table tooltips", () => {
  it("portals header tooltips to <body> so overflow can't clip them", () => {
    const columns: TableColumn[] = [
      { key: "gold", header: "Gold", headerTooltip: { content: "Gold cost" } },
    ];
    const rows: TableRowDef[] = [{ id: "a", cells: { gold: { value: 1 } } }];
    // jsdom has no layout; stub rects so positioning runs
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 100, y: 100, width: 50, height: 20 }),
    );
    const { container } = render(<Table columns={columns} rows={rows} />);
    fireEvent.mouseEnter(screen.getByRole("columnheader", { name: "Gold" }));
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("Gold cost");
    expect(container.contains(tip)).toBe(false);
    expect(document.body.contains(tip)).toBe(true);
    vi.restoreAllMocks();
  });
});
