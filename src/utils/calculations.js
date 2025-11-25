export function abilityMod(score = 10) {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function abilityTotal(score, proficiency, proficient = false, expertise = false, misc = 0) {
  const mod = abilityMod(score);
  const prof = expertise ? proficiency * 2 : proficient ? proficiency : 0;
  return mod + prof + misc;
}
