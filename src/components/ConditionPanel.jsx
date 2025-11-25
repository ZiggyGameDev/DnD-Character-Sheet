import React, { useState } from 'react';

export default function ConditionPanel({ conditions, onToggle, onExhaustionChange, onAdd }) {
  const entries = Object.entries(conditions.list);
  const [newCondition, setNewCondition] = useState('');

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Conditions</h3>
          <p className="muted">Exhaustion and tap-to-toggle conditions</p>
        </div>
        <div className="button-row compact">
          <button className="pill ghost" onClick={() => onExhaustionChange(Math.max(0, conditions.exhaustion - 1))}>-
          </button>
          <span className="chip">Exhaustion {conditions.exhaustion}</span>
          <button className="pill ghost" onClick={() => onExhaustionChange(Math.min(6, conditions.exhaustion + 1))}>+
          </button>
        </div>
      </div>
      <div className="chip-grid">
        {entries.map(([key, condition]) => (
          <button
            key={key}
            className={`chip selectable ${condition.active ? 'active' : ''}`}
            onClick={() => onToggle(key)}
          >
            {condition.label}
          </button>
        ))}
      </div>
      <div className="form-row">
        <input value={newCondition} onChange={(e) => setNewCondition(e.target.value)} placeholder="Custom condition" />
        <button
          className="pill"
          onClick={() => {
            if (!newCondition.trim()) return;
            onAdd(newCondition.trim());
            setNewCondition('');
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
