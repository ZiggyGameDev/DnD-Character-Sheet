import React, { useState } from 'react';

let idCounter = 100;

export default function InitiativePanel({ tracker, onChange, proficiency, dexMod }) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const addEntry = () => {
    if (!name || value === '') return;
    const entry = { id: ++idCounter, name, value: Number(value) };
    const nextEntries = [...tracker.entries, entry];
    onChange({ entries: nextEntries, activeId: tracker.activeId || entry.id });
    setName('');
    setValue('');
  };

  const remove = (id) => {
    const remaining = tracker.entries.filter((e) => e.id !== id);
    const activeId = tracker.activeId === id ? remaining[0]?.id || null : tracker.activeId;
    onChange({ entries: remaining, activeId });
  };

  const roll = () => {
    const rollValue = d20() + dexMod + proficiency;
    const entry = { id: ++idCounter, name: `${name || 'New combatant'}`, value: rollValue };
    onChange({ entries: [...tracker.entries, entry], activeId: tracker.activeId || entry.id });
    setName('');
    setValue('');
  };

  const sorted = tracker.entries.slice().sort((a, b) => b.value - a.value);
  const activeId = tracker.activeId || sorted[0]?.id || null;

  const advance = () => {
    if (!sorted.length) return;
    const idx = sorted.findIndex((e) => e.id === activeId);
    const next = sorted[(idx + 1) % sorted.length];
    onChange({ entries: sorted, activeId: next?.id || activeId });
  };

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Initiative</h3>
          <p className="muted">Add allies or foes; rolls add DEX + proficiency</p>
        </div>
        <div className="button-row compact">
          <button className="pill ghost" onClick={advance}>
            Next Turn
          </button>
          <button className="pill ghost" onClick={() => onChange({ entries: [], activeId: null })}>
            Clear
          </button>
        </div>
      </div>
      <ul className="list compact">
        {sorted.map((entry) => (
          <li key={entry.id} className={`list-row ${entry.id === activeId ? 'active' : ''}`}>
            <span>{entry.name}</span>
            <span>
              {entry.value}
              <button className="icon" onClick={() => onChange({ ...tracker, activeId: entry.id })} title="Set active">
                •
              </button>
              <button className="icon" onClick={() => remove(entry.id)} title="Remove">
                ×
              </button>
            </span>
          </li>
        ))}
      </ul>
      <div className="form-row">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="button-row">
        <button className="pill" onClick={addEntry}>
          Add
        </button>
        <button className="pill" onClick={roll}>
          Roll (d20 + {dexMod} + {proficiency})
        </button>
      </div>
    </div>
  );
}

function d20() {
  return Math.floor(Math.random() * 20) + 1;
}
