import React, { useState } from 'react';
import { rollExpression } from '../utils/dice.js';

export default function DiceRoller({ proficiency, abilities }) {
  const [expression, setExpression] = useState('2d20kh1 + CHA + PB');
  const [history, setHistory] = useState([]);

  const roll = () => {
    const result = rollExpression(expression, { proficiency, abilities });
    setHistory((prev) => [result, ...prev.slice(0, 4)]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Dice Roller</h3>
        <p className="muted">Supports NdM, +/-, keep/drop (kh/kl/dh/dl), PB, ability mods, adv/dis keywords</p>
      </div>
      <div className="form-row">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. 2d20kh1 + 5 + CHA"
        />
        <button className="pill" onClick={roll}>
          Roll
        </button>
      </div>
      <div className="history">
        {history.map((entry, idx) => (
          <div key={idx} className="history-row">
            <div className="history-header">
              <strong>{entry.total}</strong>
              <span className="muted">{entry.expression}</span>
            </div>
            <div className="muted small">{entry.breakdown.join(' • ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
