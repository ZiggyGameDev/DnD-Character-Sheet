import React, { useState } from 'react';
import { abilityMod, abilityTotal, formatModifier } from '../utils/calculations.js';
import { rollExpression } from '../utils/dice.js';

export default function QuickRolls({ character }) {
  const [mode, setMode] = useState('normal');
  const [history, setHistory] = useState([]);

  const buildD20Expression = (mod) => {
    if (mode === 'adv') return `2d20kh1 + ${mod}`;
    if (mode === 'dis') return `2d20kl1 + ${mod}`;
    return `1d20 + ${mod}`;
  };

  const rollCheck = (label, mod, expressionOverride) => {
    const expr = expressionOverride || buildD20Expression(mod);
    const result = rollExpression(expr, { proficiency: character.proficiency, abilities: character.abilities });
    setHistory((prev) => [
      { label, expr, total: result.total, breakdown: result.breakdown },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Quick Rolls</h3>
          <p className="muted">Abilities, saves, skills, and actions with advantage/disadvantage</p>
        </div>
        <div className="button-row compact">
          <button className={`pill ghost ${mode === 'normal' ? 'active' : ''}`} onClick={() => setMode('normal')}>
            Normal
          </button>
          <button className={`pill ghost ${mode === 'adv' ? 'active' : ''}`} onClick={() => setMode('adv')}>
            Advantage
          </button>
          <button className={`pill ghost ${mode === 'dis' ? 'active' : ''}`} onClick={() => setMode('dis')}>
            Disadvantage
          </button>
        </div>
      </div>
      <div className="grid three compact">
        <div>
          <p className="muted small">Abilities</p>
          <div className="chip-column">
            {Object.entries(character.abilities).map(([abbr, ability]) => (
              <button
                key={abbr}
                className="chip selectable"
                onClick={() => rollCheck(`${abbr} check`, abilityMod(ability.score))}
              >
                {abbr} {formatModifier(abilityMod(ability.score))}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="muted small">Saving Throws</p>
          <div className="chip-column">
            {Object.entries(character.savingThrows).map(([abbr, save]) => {
              const total = abilityTotal(character.abilities[abbr].score, character.proficiency, save.proficient);
              return (
                <button
                  key={abbr}
                  className="chip selectable"
                  onClick={() => rollCheck(`${abbr} save`, total)}
                >
                  {abbr} {formatModifier(total)}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="muted small">Skills</p>
          <div className="chip-column">
            {character.skills.map((skill) => {
              const total = abilityTotal(
                character.abilities[skill.ability].score,
                character.proficiency,
                skill.proficient,
                skill.expertise
              );
              return (
                <button
                  key={skill.name}
                  className="chip selectable"
                  onClick={() => rollCheck(`${skill.name} (${skill.ability})`, total)}
                >
                  {skill.name} {formatModifier(total)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="actions">
        <p className="muted small">Attacks & Actions</p>
        <div className="chip-grid">
          {character.actions.map((action) => {
            const expr =
              action.type === 'Save DC'
                ? action.expression
                : action.expression.includes('d20')
                  ? action.expression
                  : buildD20Expression(action.expression);
            return (
              <button
                key={action.name}
                className="chip selectable"
                onClick={() => rollCheck(action.name, null, expr)}
                title={action.note}
              >
                {action.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="history">
        {history.map((row, idx) => (
          <div key={idx} className="history-row">
            <div className="history-header">
              <strong>{row.total}</strong>
              <span className="muted">{row.label}</span>
            </div>
            <div className="muted tiny">{row.expr}</div>
            <div className="muted small">{row.breakdown.join(' • ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
