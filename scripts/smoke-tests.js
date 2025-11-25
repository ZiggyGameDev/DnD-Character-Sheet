import { abilityMod, abilityTotal, formatModifier } from '../src/utils/calculations.js';
import { rollExpression, sanitizeExpression } from '../src/utils/dice.js';
import { effectiveCasterLevel, slotTableForLevel, buildSpellcastingState } from '../src/utils/spellcasting.js';
import { demoCharacter } from '../src/data/demoCharacter.js';

const originalRandom = Math.random;
Math.random = () => 0.42; // deterministic for smoke output

function testCalculations() {
  const mod = abilityMod(18);
  const negativeMod = abilityMod(7);
  const expertiseTotal = abilityTotal(14, 3, true, true, 1);
  const proficientTotal = abilityTotal(16, 4, true, false, 0);
  const formatted = formatModifier(-2);
  return { mod, negativeMod, expertiseTotal, proficientTotal, formatted };
}

function testDice() {
  const sanitized = sanitizeExpression('1d20+5 adv 1d20-3 dis');
  const attack = rollExpression('1d20 + PB + STR', {
    proficiency: 3,
    abilities: { STR: { score: 16 } },
  });
  const keepHigh = rollExpression('2d20kh1 + 5');
  const dropLow = rollExpression('4d6dl1');
  return {
    sanitized,
    attack: { total: attack.total, breakdown: attack.breakdown },
    keepHigh: { total: keepHigh.total, rolls: keepHigh.breakdown },
    dropLow: { total: dropLow.total, rolls: dropLow.breakdown },
  };
}

function testSpellcasting() {
  const casterLevel = effectiveCasterLevel(demoCharacter.classes);
  const table = slotTableForLevel(casterLevel);
  const state = buildSpellcastingState(demoCharacter);
  const capCheck = buildSpellcastingState({
    ...demoCharacter,
    spellcasting: {
      ...demoCharacter.spellcasting,
      slots: { 1: 99, 2: 99 },
    },
  });
  return {
    casterLevel,
    slots: state.slots,
    pact: state.pactSlots,
    tableLevels: Object.keys(table).length,
    clampedSlots: capCheck.slots,
  };
}

console.log('calculations', testCalculations());
console.log('dice', testDice());
console.log('spellcasting', testSpellcasting());

Math.random = originalRandom;
