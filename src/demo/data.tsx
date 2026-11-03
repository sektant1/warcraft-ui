import { BlpIcon, type Race, type TableColumn, type TableRowDef } from "../../lib/main";
import type { CommandSlot } from "../components/CommandCard/CommandCard";

/* ── Command card ─────────────────────────────────────────────────────────── */

const MOVE: CommandSlot = {
  hotkey: "Q",
  label: "Move",
  iconPath: "buttons/command/BTNMove.blp",
  state: "ready",
  tooltip: { name: "Move", description: "Gives the order to move to a location." },
};
const STOP: CommandSlot = {
  hotkey: "W",
  label: "Stop",
  iconPath: "buttons/command/BTNStop.blp",
  state: "ready",
  tooltip: { name: "Stop", description: "Stops the current action." },
};
const HOLD: CommandSlot = {
  hotkey: "E",
  label: "Hold Position",
  iconPath: "buttons/command/BTNHoldPosition.blp",
  state: "ready",
  tooltip: {
    name: "Hold Position",
    description: "The unit will hold position and not chase after enemies.",
  },
};
const ATTACK: CommandSlot = {
  hotkey: "R",
  label: "Attack",
  iconPath: "buttons/command/BTNAttack.blp",
  state: "ready",
  tooltip: {
    name: "Attack",
    description: "Attack a target unit or attack-move to a location.",
  },
};
const PATROL: CommandSlot = {
  hotkey: "A",
  label: "Patrol",
  iconPath: "buttons/command/BTNPatrol.blp",
  state: "ready",
  tooltip: {
    name: "Patrol",
    description: "Patrols between two points, engaging enemies along the way.",
  },
};
const EMPTY: CommandSlot = { state: "empty" };
const LEARN: CommandSlot = {
  hotkey: "F",
  label: "Learn Skill",
  iconPath: "buttons/command/BTNSkillz.blp",
  state: "levelup",
  tooltip: {
    name: "Hero Abilities",
    description: "Spend a skill point to learn or upgrade an ability.",
  },
};

/** Top two rows are identical for every hero. */
const HERO_BASE_SLOTS = [MOVE, STOP, HOLD, ATTACK, PATROL, EMPTY, EMPTY, LEARN];

const HOTKEYS = ["Z", "X", "C", "V"] as const;

interface Ability {
  name: string;
  icon: string;
  state: CommandSlot["state"];
  type: string;
  description: string;
  manaCost?: number;
  cooldown?: number;
}

function heroCard(abilities: [Ability, Ability, Ability, Ability]): CommandSlot[] {
  return [
    ...HERO_BASE_SLOTS,
    ...abilities.map(
      (a, i): CommandSlot => ({
        hotkey: HOTKEYS[i],
        label: a.name,
        iconPath: `buttons/command/${a.icon}.blp`,
        state: a.state,
        tooltip: {
          name: a.name,
          type: a.type,
          description: a.description,
          manaCost: a.manaCost,
          cooldown: a.cooldown,
        },
      }),
    ),
  ];
}

export const HERO_COMMAND_CARDS: Record<Race, CommandSlot[]> = {
  // Archmage
  Human: heroCard([
    {
      name: "Blizzard",
      icon: "BTNBlizzard",
      state: "ready",
      type: "Active ability",
      description:
        "Calls down waves of freezing ice shards that damage units in a target area.",
      manaCost: 75,
      cooldown: 6,
    },
    {
      name: "Summon Water Elemental",
      icon: "BTNSummonWaterElemental",
      state: "active",
      type: "Active ability",
      description:
        "Summons a Water Elemental to fight for the Archmage. The elemental lasts 60 seconds.",
      manaCost: 125,
      cooldown: 20,
    },
    {
      name: "Brilliance Aura",
      icon: "BTNBrilliance",
      state: "passive",
      type: "Passive ability",
      description:
        "Increases nearby friendly units' mana regeneration by 0.75 mana per second.",
    },
    {
      name: "Mass Teleport",
      icon: "BTNMassTeleport",
      state: "ready",
      type: "Ultimate ability",
      description:
        "Teleports 24 nearby units to a target friendly ground unit or structure.",
      manaCost: 100,
      cooldown: 20,
    },
  ]),
  // Blademaster
  Orc: heroCard([
    {
      name: "Wind Walk",
      icon: "BTNWindWalkOn",
      state: "active",
      type: "Active ability",
      description:
        "Allows the Blademaster to become invisible and move faster for a set amount of time. Deals bonus damage on first attack.",
      manaCost: 75,
      cooldown: 5,
    },
    {
      name: "Mirror Image",
      icon: "BTNMirrorImage",
      state: "ready",
      type: "Active ability",
      description:
        "Confuses the enemy by creating illusions of the Blademaster that deal no damage and take extra damage.",
      manaCost: 80,
      cooldown: 10,
    },
    {
      name: "Critical Strike",
      icon: "BTNCriticalStrike",
      state: "passive",
      type: "Passive ability",
      description:
        "Gives a 15% chance that the Blademaster will do 2x his normal damage on an attack.",
    },
    {
      name: "Bladestorm",
      icon: "BTNWhirlwind",
      state: "ready",
      type: "Ultimate ability",
      description:
        "Causes a whirlwind of destructive force around the Blademaster, rendering him immune to magic and dealing 110 damage per second to nearby enemy units.",
      manaCost: 200,
      cooldown: 180,
    },
  ]),
  // Demon Hunter
  NightElf: heroCard([
    {
      name: "Mana Burn",
      icon: "BTNManaBurn",
      state: "ready",
      type: "Active ability",
      description:
        "Sends a bolt of negative energy that burns up to 50 mana from the target unit. Burned mana is dealt as damage.",
      cooldown: 7,
    },
    {
      name: "Immolation",
      icon: "BTNImmolationOn",
      state: "active",
      type: "Toggle ability",
      description:
        "Engulfs the Demon Hunter in flames, dealing 10 damage per second to nearby enemy units. Drains mana while active.",
      manaCost: 35,
    },
    {
      name: "Evasion",
      icon: "BTNEvasion",
      state: "passive",
      type: "Passive ability",
      description: "Gives the Demon Hunter a 10% chance to evade an attack.",
    },
    {
      name: "Metamorphosis",
      icon: "BTNMetamorphosis",
      state: "ready",
      type: "Ultimate ability",
      description:
        "Transforms the Demon Hunter into a powerful ranged demon with 500 bonus hit points and a chaos ranged attack for 60 seconds.",
      manaCost: 150,
      cooldown: 120,
    },
  ]),
  // Death Knight
  Undead: heroCard([
    {
      name: "Death Coil",
      icon: "BTNDeathCoil",
      state: "ready",
      type: "Active ability",
      description:
        "A coil of death that can damage an enemy living unit for 100 damage or heal a friendly Undead unit for 200 hit points.",
      manaCost: 75,
      cooldown: 6,
    },
    {
      name: "Death Pact",
      icon: "BTNDeathPact",
      state: "ready",
      type: "Active ability",
      description:
        "Kills a target friendly Undead unit, converting 100% of its hit points into health for the Death Knight.",
      cooldown: 8,
    },
    {
      name: "Unholy Aura",
      icon: "BTNUnholyAura",
      state: "passive",
      type: "Passive ability",
      description:
        "Increases nearby friendly units' movement speed by 10% and life regeneration rate.",
    },
    {
      name: "Animate Dead",
      icon: "BTNAnimateDead",
      state: "active",
      type: "Ultimate ability",
      description:
        "Raises 6 dead units in an area to fight for the Death Knight for 120 seconds.",
      manaCost: 175,
      cooldown: 240,
    },
  ]),
};

/* ── Heroes ───────────────────────────────────────────────────────────────── */

interface Hero {
  id: string;
  race: Race;
  name: string;
  icon: string;
  blurb: string;
  hp: number;
  mp: number;
  attack: string;
}

/** Level-1 stats for each race's first hero. Single source for portrait, bars and table. */
export const HEROES: Record<Race, Hero> = {
  Human: {
    id: "archmage",
    race: "Human",
    name: "Archmage",
    icon: "buttons/command/BTNHeroArchMage.blp",
    blurb: "Master of the arcane arts. Excels at area denial and mana support.",
    hp: 625,
    mp: 300,
    attack: "23–29",
  },
  Orc: {
    id: "blademaster",
    race: "Orc",
    name: "Blademaster",
    icon: "buttons/command/BTNHeroBlademaster.blp",
    blurb: "Swift melee duelist with high burst damage and Wind Walk.",
    hp: 750,
    mp: 225,
    attack: "29–39",
  },
  NightElf: {
    id: "demonhunter",
    race: "NightElf",
    name: "Demon Hunter",
    icon: "buttons/command/BTNHeroDemonHunter.blp",
    blurb: "Agile anti-caster with Mana Burn and Metamorphosis ultimate.",
    hp: 700,
    mp: 270,
    attack: "26–36",
  },
  Undead: {
    id: "deathknight",
    race: "Undead",
    name: "Death Knight",
    icon: "buttons/command/BTNHeroDeathKnight.blp",
    blurb: "Durable sustain hero with Unholy Aura and Animate Dead ultimate.",
    hp: 775,
    mp: 225,
    attack: "32–38",
  },
};

const RACE_LABEL: Record<Race, string> = {
  Human: "Human",
  Orc: "Orc",
  NightElf: "Night Elf",
  Undead: "Undead",
};

const HERO_COST = { gold: 425, lumber: 100 };

export const HERO_TABLE_COLUMNS: TableColumn[] = [
  {
    key: "hero",
    header: "Hero",
    width: "28%",
    headerTooltip: { content: <span style={{ color: "#d8d0b8" }}>Race hero unit</span> },
  },
  {
    key: "gold",
    header: "Gold",
    align: "center",
    headerTooltip: { content: <span style={{ color: "#fcd312" }}>Gold cost to summon</span> },
  },
  {
    key: "lumber",
    header: "Lumber",
    align: "center",
    headerTooltip: { content: <span style={{ color: "#00c000" }}>Lumber cost to summon</span> },
  },
  { key: "hp", header: "HP", align: "right" },
  { key: "mp", header: "MP", align: "right" },
  { key: "attack", header: "Attack", align: "right" },
];

export function heroTableRows(highlightRace?: Race): TableRowDef[] {
  return Object.values(HEROES).map((h) => ({
    id: h.id,
    highlighted: h.race === highlightRace,
    cells: {
      hero: {
        iconPath: h.icon,
        iconSize: 22,
        value: h.name,
        tooltip: {
          icon: <BlpIcon path={h.icon} size={38} />,
          content: (
            <>
              <div>
                <strong style={{ color: "#fcd312" }}>{h.name}</strong>
              </div>
              <div style={{ color: "#809fff", fontSize: 11 }}>
                {RACE_LABEL[h.race]} Hero
              </div>
              <div style={{ marginTop: 4, color: "#ccc", fontSize: 12 }}>{h.blurb}</div>
            </>
          ),
        },
      },
      gold: { resourceIcon: "gold", value: HERO_COST.gold },
      lumber: { resourceIcon: "lumber", value: HERO_COST.lumber },
      hp: { value: h.hp },
      mp: { value: h.mp },
      attack: { value: h.attack },
    },
  }));
}

/* ── Misc ─────────────────────────────────────────────────────────────────── */

export const MAP_LIST = [
  "Lost Temple",
  "Turtle Rock",
  "Gnoll Wood",
  "Plunder Isle",
  "Twisted Meadows",
  "Echo Isles",
  "Terenas Stand",
  "Centaur Grove",
] as const;

export type MapName = (typeof MAP_LIST)[number];

export const REPO_URL = "https://github.com/sektant1/warcraft-ui";
