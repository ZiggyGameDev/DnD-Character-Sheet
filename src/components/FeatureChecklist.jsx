import React from 'react';

const FEATURES = [
  'Unlimited characters with core sheet fields',
  'Ability scores with derived modifiers',
  'Saving throws, skills, and passive scores',
  'Combat snapshot (AC, initiative, speed, senses)',
  'HP + temp HP, hit dice, and death saves',
  'Exhaustion and common condition toggles',
  'Session view: quick rolls and initiative',
  'Spell slots (pact + multiclass) and prepared/known spells',
  'Rest management for slots and class resources',
  'Dice roller with adv/dis and kh/kl',
  'Notes: freeform, quests, and personality blocks',
  'Tags and custom passives to organize characters',
];

export default function FeatureChecklist() {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Feature Checklist</h3>
        <p className="muted">All items from the design docs implemented in the demo</p>
      </div>
      <div className="checklist">
        {FEATURES.map((feat) => (
          <div key={feat} className="check-item">
            <span className="check-icon">✓</span>
            <span>{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
