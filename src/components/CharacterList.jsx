import React, { useState } from 'react';
import { formatModifier } from '../utils/calculations.js';

function classSummary(classes) {
  return classes.map((cls) => `${cls.level} ${cls.name}${cls.subclass ? ` (${cls.subclass})` : ''}`).join(' / ');
}

export default function CharacterList({ characters, activeId, onSelect, onAdd }) {
  const [newName, setNewName] = useState('New Hero');

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Characters</h3>
          <p className="muted">Unlimited roster with quick switching</p>
        </div>
        <button className="pill ghost" onClick={() => onSelect(activeId)}>
          Refresh
        </button>
      </div>
      <div className="character-list-grid">
        {characters.map((char) => (
          <button
            key={char.id}
            className={`character-card ${char.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(char.id)}
          >
            <div className="chip-row">
              {char.tags && char.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="chip ghost">
                  {tag}
                </span>
              ))}
            </div>
            <h4>{char.name}</h4>
            <p className="muted small">{classSummary(char.classes)}</p>
            <div className="muted tiny">Level {char.level} • PB {formatModifier(char.proficiency)}</div>
          </button>
        ))}
      </div>
      <div className="form-row">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Character name" />
        <button
          className="pill"
          onClick={() => {
            if (!newName.trim()) return;
            onAdd(newName.trim());
            setNewName('');
          }}
        >
          Add Character
        </button>
      </div>
    </div>
  );
}
