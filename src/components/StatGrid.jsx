import React from 'react';
import { abilityMod, formatModifier } from '../utils/calculations.js';

export default function StatGrid({ abilities, speed, senses }) {
  const abilityEntries = Object.entries(abilities);
  return (
    <div className="card">
      <div className="card-header">
        <h3>Ability Scores</h3>
        <p className="muted">Tap any score for the modifier reference</p>
      </div>
      <div className="abilities">
        {abilityEntries.map(([key, value]) => (
          <div key={key} className="ability">
            <p className="muted">{key}</p>
            <div className="ability-score">{value.score}</div>
            <div className="ability-mod">{formatModifier(abilityMod(value.score))}</div>
          </div>
        ))}
      </div>
      <div className="muted small">Speed {speed.walk} ft • {senses.join(' • ')}</div>
    </div>
  );
}
