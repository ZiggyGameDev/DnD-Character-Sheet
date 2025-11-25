import { abilityMod } from './calculations.js';

export function sanitizeExpression(raw) {
  return raw.replace(/adv/gi, '2d20kh1').replace(/dis/gi, '2d20kl1');
}

export function rollExpression(raw, context = {}) {
  const cleaned = sanitizeExpression(raw).replace(/\s+/g, '');
  const tokens = cleaned.match(/[+-]?[^+-]+/g) || [];
  let total = 0;
  const breakdown = [];

  tokens.forEach((token) => {
    const sign = token.startsWith('-') ? -1 : 1;
    const core = token.replace(/^[-+]/, '');

    const diceMatch = core.match(/^(\d*)d(\d+)([kd][hl]?)(\d+)?$/i) || core.match(/^(\d*)d(\d+)$/i);
    const abilityMatch = core.toUpperCase();

    if (diceMatch) {
      const [, qtyRaw, dieRaw, keepFlag, keepCountRaw] = diceMatch;
      const qty = Number(qtyRaw || 1);
      const die = Number(dieRaw);
      const rolls = Array.from({ length: qty }, () => Math.floor(Math.random() * die) + 1);
      let kept = rolls;
      if (keepFlag) {
        const mode = keepFlag.startsWith('d') ? 'drop' : 'keep';
        const count = Number(keepCountRaw || 1);
        const sorted = [...rolls].sort((a, b) => keepFlag.endsWith('l') ? a - b : b - a);
        if (mode === 'keep') {
          kept = sorted.slice(0, count);
        } else {
          kept = sorted.slice(count);
        }
      }
      const subtotal = kept.reduce((sum, n) => sum + n, 0) * sign;
      total += subtotal;
      breakdown.push(
        `${sign < 0 ? '-' : ''}${qty}d${die}${keepFlag || ''}${keepFlag ? keepCountRaw || 1 : ''} [${rolls.join(', ')}] → ${subtotal}`
      );
      return;
    }

    if (context.abilities && abilityMatch in context.abilities) {
      const mod = abilityMod(context.abilities[abilityMatch].score) * sign;
      total += mod;
      breakdown.push(`${abilityMatch} mod ${mod >= 0 ? '+' : ''}${mod}`);
      return;
    }

    if (abilityMatch === 'PB' && context.proficiency) {
      const mod = context.proficiency * sign;
      total += mod;
      breakdown.push(`PB ${mod >= 0 ? '+' : ''}${mod}`);
      return;
    }

    const numeric = Number(core);
    if (!Number.isNaN(numeric)) {
      const value = numeric * sign;
      total += value;
      breakdown.push(`${value >= 0 ? '+' : ''}${value}`);
    }
  });

  return { total, breakdown, expression: raw };
}
