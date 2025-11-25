import React from 'react';

export default function HeroHeader({ character, passiveScores }) {
  const classSummary = character.classes
    .map((cls) => `${cls.name} ${cls.level}${cls.subclass ? ` (${cls.subclass})` : ''}`)
    .join(' / ');

  return (
    <header className="hero">
      <div>
        <p className="muted">D&D 5e Character</p>
        <h1>{character.name}</h1>
        <p className="muted">{`${character.race} • ${classSummary} • Level ${character.level}`}</p>
        <p className="muted">{`${character.background} • ${character.alignment}`}</p>
        <div className="chips">
          <span className="chip">Proficiency +{character.proficiency}</span>
          <span className="chip">XP {character.experience.toLocaleString()}</span>
          <span className="chip">Speed {character.speed.walk} ft</span>
          {character.senses.map((sense) => (
            <span key={sense} className="chip">
              {sense}
            </span>
          ))}
        </div>
      </div>
      <div className="hero-passives">
        <PassiveCard label="Passive Perception" value={passiveScores.perception} />
        <PassiveCard label="Passive Investigation" value={passiveScores.investigation} />
        <PassiveCard label="Passive Insight" value={passiveScores.insight} />
      </div>
    </header>
  );
}

function PassiveCard({ label, value }) {
  return (
    <div className="passive-card">
      <p className="muted">{label}</p>
      <div className="passive-value">{value}</div>
    </div>
  );
}
