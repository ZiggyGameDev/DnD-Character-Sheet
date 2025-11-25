import React from 'react';

export default function RestPanel({ spellcasting, resources, onLongRest, onShortRest, onResourceChange }) {
  const spendResource = (name, delta) => {
    onResourceChange((prev) =>
      prev.map((res) => (res.name === name ? { ...res, remaining: Math.max(0, Math.min(res.total, res.remaining + delta)) } : res))
    );
  };

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Rest & Resources</h3>
          <p className="muted">Reset slots and class features</p>
          <p className="muted small">Multiclass caster level: {spellcasting.casterLevel}</p>
        </div>
        <div className="button-row">
          <button className="pill" onClick={onShortRest}>
            Short Rest
          </button>
          <button className="pill" onClick={onLongRest}>
            Long Rest
          </button>
        </div>
      </div>
      <div className="slots compact">
        {Object.entries(spellcasting.slots).map(([level, remaining]) => (
          <span key={level} className="chip ghost">
            L{level}: {remaining}/{spellcasting.maxSlots[level]}
          </span>
        ))}
        <span className="chip ghost">
          Pact L{spellcasting.pactSlots.level}: {spellcasting.pactSlots.remaining}/{spellcasting.pactSlots.total}
        </span>
      </div>
      <div className="resources">
        {resources.map((res) => (
          <div key={res.name} className="resource-row">
            <div>
              <div className="resource-name">{res.name}</div>
              <div className="muted small">Refresh: {res.refresh}</div>
            </div>
            <div className="resource-count">
              <button className="pill ghost" onClick={() => spendResource(res.name, -1)}>-</button>
              <span className="chip ghost">{res.remaining} / {res.total}</span>
              <button className="pill ghost" onClick={() => spendResource(res.name, +1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
