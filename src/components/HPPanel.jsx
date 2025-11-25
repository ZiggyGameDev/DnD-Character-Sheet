import React from 'react';

export default function HPPanel({ hp, onUpdate }) {
  const adjust = (delta) => {
    const next = Math.min(hp.max, Math.max(0, hp.current + delta));
    onUpdate({ ...hp, current: next });
  };

  const adjustTemp = (delta) => onUpdate({ ...hp, temp: Math.max(0, hp.temp + delta) });

  const updateDeathSave = (key, delta) => {
    const next = Math.min(3, Math.max(0, hp.deathSaves[key] + delta));
    onUpdate({ ...hp, deathSaves: { ...hp.deathSaves, [key]: next } });
  };

  const spendHitDie = (index) => {
    const die = hp.hitDice[index];
    if (!die || die.remaining <= 0) return;
    const updated = hp.hitDice.map((d, i) => (i === index ? { ...d, remaining: d.remaining - 1 } : d));
    onUpdate({ ...hp, hitDice: updated });
  };

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Hit Points</h3>
          <p className="muted">Damage/heal, temp HP, hit dice, and death saves</p>
        </div>
        <div className="hp-total">{hp.current + hp.temp} / {hp.max}</div>
      </div>
      <div className="hp-controls">
        <div>
          <p className="muted small">Damage / Heal</p>
          <div className="button-row">
            {[-10, -5, -1, +1, +5, +10].map((delta) => (
              <button key={delta} className="pill" onClick={() => adjust(delta)}>
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="muted small">Temporary HP</p>
          <div className="button-row">
            {[-5, -1, +1, +5].map((delta) => (
              <button key={delta} className="pill" onClick={() => adjustTemp(delta)}>
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
          <p className="muted small">Current Temp HP: {hp.temp}</p>
        </div>
      </div>
      <div className="hit-dice">
        {hp.hitDice.map((die, idx) => (
          <button key={`${die.die}-${idx}`} className="chip selectable" onClick={() => spendHitDie(idx)}>
            {die.remaining}/{die.total} {die.die} Hit Dice
          </button>
        ))}
      </div>
      <div className="death-saves">
        <div>
          <p className="muted small">Death Saves - Success</p>
          <div className="button-row compact">
            <button className="pill ghost" onClick={() => updateDeathSave('success', -1)}>-</button>
            <div className="chip ghost">{hp.deathSaves.success}</div>
            <button className="pill ghost" onClick={() => updateDeathSave('success', +1)}>+</button>
          </div>
        </div>
        <div>
          <p className="muted small">Death Saves - Failure</p>
          <div className="button-row compact">
            <button className="pill ghost" onClick={() => updateDeathSave('fail', -1)}>-</button>
            <div className="chip ghost">{hp.deathSaves.fail}</div>
            <button className="pill ghost" onClick={() => updateDeathSave('fail', +1)}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
