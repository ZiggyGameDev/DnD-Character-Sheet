import React from 'react';
import { abilityMod, formatModifier } from '../utils/calculations.js';

function SpeedRow({ speed }) {
  const entries = Object.entries(speed).filter(([, value]) => value);
  if (!entries.length) return <span>No movement</span>;
  return <span>{entries.map(([k, v]) => `${k} ${v} ft`).join(' • ')}</span>;
}

export default function CombatStats({ character }) {
  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Combat Snapshot</h3>
          <p className="muted">AC, initiative, passives, speed, senses</p>
        </div>
        <div className="chip">PB {formatModifier(character.proficiency)}</div>
      </div>
      <div className="grid three compact">
        <div>
          <p className="muted small">Armor Class</p>
          <div className="headline">{character.armorClass}</div>
        </div>
        <div>
          <p className="muted small">Initiative</p>
          <div className="headline">{formatModifier(character.initiativeBonus)}</div>
          <div className="muted tiny">(DEX {formatModifier(abilityMod(character.abilities.DEX.score))} + misc)</div>
        </div>
        <div>
          <p className="muted small">Speed</p>
          <div className="headline">
            <SpeedRow speed={character.speed} />
          </div>
          <div className="muted tiny">Senses: {character.senses.join(' • ')}</div>
        </div>
      </div>
      <div className="passives">
        <div className="chip ghost">Passive Perception {character.passives.perception}</div>
        <div className="chip ghost">Passive Investigation {character.passives.investigation}</div>
        <div className="chip ghost">Passive Insight {character.passives.insight}</div>
        {character.passives.custom?.map((p) => (
          <div key={p.label} className="chip ghost">{`${p.label} ${p.value}`}</div>
        ))}
      </div>
    </div>
  );
}
