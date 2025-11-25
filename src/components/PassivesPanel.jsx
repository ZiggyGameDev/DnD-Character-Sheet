import React, { useState } from 'react';

export default function PassivesPanel({ passives, onChange }) {
  const [label, setLabel] = useState('Passive Stealth');
  const [value, setValue] = useState('10');

  const updateBase = (key, val) => onChange({ ...passives, [key]: Number(val) || 0 });

  const addCustom = () => {
    if (!label.trim() || value === '') return;
    const next = [...(passives.custom || []), { label: label.trim(), value: Number(value) || 0 }];
    onChange({ ...passives, custom: next });
    setLabel('');
    setValue('');
  };

  const removeCustom = (target) => onChange({ ...passives, custom: (passives.custom || []).filter((p) => p.label !== target) });

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Passive Scores</h3>
          <p className="muted">Perception, Investigation, Insight, plus custom passives</p>
        </div>
      </div>
      <div className="grid three compact">
        {['perception', 'investigation', 'insight'].map((key) => (
          <label key={key} className="field">
            <span className="muted small">{`Passive ${key[0].toUpperCase()}${key.slice(1)}`}</span>
            <input type="number" value={passives[key]} onChange={(e) => updateBase(key, e.target.value)} />
          </label>
        ))}
      </div>
      <div className="passives custom-list">
        {(passives.custom || []).map((p) => (
          <div key={p.label} className="chip ghost selectable" onClick={() => removeCustom(p.label)} title="Remove">
            {p.label}: {p.value}
          </div>
        ))}
      </div>
      <div className="form-row">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Passive label" />
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Score" />
        <button className="pill" onClick={addCustom}>
          Add Passive
        </button>
      </div>
    </div>
  );
}
