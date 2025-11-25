import React from 'react';
import { abilityTotal, formatModifier } from '../utils/calculations.js';

const abilityLookup = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma',
};

export default function SavingSkills({ saves, skills, proficiency, abilities }) {
  const saveEntries = Object.entries(saves);
  return (
    <div className="card">
      <div className="card-header">
        <h3>Saves & Skills</h3>
        <p className="muted">Proficiency auto-applied for proficient checks</p>
      </div>
      <div className="grid two">
        <div>
          <p className="muted small">Saving Throws</p>
          <ul className="list">
            {saveEntries.map(([abbr, value]) => (
              <li key={abbr} className="list-row">
                <span>
                  {abilityLookup[abbr]} {value.proficient ? '•' : ''}
                </span>
                <span>{formatModifier(abilityTotal(abilities[abbr].score, proficiency, value.proficient))}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="muted small">Skills</p>
          <ul className="list">
            {skills.map((skill) => {
              const total = abilityTotal(
                abilities[skill.ability].score,
                proficiency,
                skill.proficient,
                skill.expertise
              );
              return (
                <li key={skill.name} className="list-row">
                  <span>
                    {skill.name}
                    <span className="muted"> ({skill.ability})</span>
                    {skill.expertise ? ' ••' : skill.proficient ? ' •' : ''}
                  </span>
                  <span>{formatModifier(total)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
