import { SLOT_TABLE } from '../data/slotProgression.js';

const PROGRESSION_WEIGHT = {
  full: 1,
  half: 0.5,
  third: 1 / 3,
  pact: 0,
  none: 0,
  martial: 0,
  multiclass: 1,
};

export function effectiveCasterLevel(classes = []) {
  return Math.max(
    0,
    Math.floor(
      classes.reduce((sum, cls) => sum + cls.level * (PROGRESSION_WEIGHT[cls.spellcasting] ?? 0), 0)
    )
  );
}

export function slotTableForLevel(casterLevel) {
  const key = Math.max(0, Math.min(20, casterLevel));
  return SLOT_TABLE[key];
}

export function buildSpellcastingState(character) {
  const current = character?.spellcasting || {};
  const casterLevel = effectiveCasterLevel(character?.classes || []);
  const maxSlots = slotTableForLevel(casterLevel) || current.maxSlots || {};
  const slots = Object.fromEntries(
    Object.entries(maxSlots).map(([level, max]) => [level, Math.min(max, current.slots?.[level] ?? max)])
  );

  return {
    ...current,
    casterLevel,
    maxSlots,
    slots,
    pactSlots: current.pactSlots || { level: 0, total: 0, remaining: 0 },
    preparedSpells: current.preparedSpells || { 0: [] },
    knownSpells: current.knownSpells || { ritual: [], concentration: [], known: [] },
  };
}
