import React, { useState } from 'react';

function classSummary(classes) {
  return classes.map((cls) => `${cls.level} ${cls.name}${cls.subclass ? ` (${cls.subclass})` : ''}`).join(' / ');
}

export default function IdentityCard({ character, onUpdate }) {
  const [newTag, setNewTag] = useState('');
  const updateField = (key, value) => onUpdate({ ...character, [key]: value });
  const addTag = () => {
    if (!newTag.trim()) return;
    const nextTags = [...(character.tags || []), newTag.trim()];
    onUpdate({ ...character, tags: nextTags });
    setNewTag('');
  };
  const removeTag = (tag) => onUpdate({ ...character, tags: (character.tags || []).filter((t) => t !== tag) });

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Identity</h3>
          <p className="muted">Core sheet fields</p>
        </div>
        <div className="chip ghost">Level {character.level}</div>
      </div>
      <div className="grid two">
        <label className="field">
          <span className="muted small">Name</span>
          <input value={character.name} onChange={(e) => updateField('name', e.target.value)} />
        </label>
        <label className="field">
          <span className="muted small">Race / Subrace</span>
          <input value={`${character.race}${character.subrace ? ` (${character.subrace})` : ''}`} readOnly />
        </label>
        <label className="field">
          <span className="muted small">Background</span>
          <input value={character.background} onChange={(e) => updateField('background', e.target.value)} />
        </label>
        <label className="field">
          <span className="muted small">Alignment</span>
          <input value={character.alignment} onChange={(e) => updateField('alignment', e.target.value)} />
        </label>
        <label className="field">
          <span className="muted small">Experience</span>
          <input
            type="number"
            value={character.experience}
            onChange={(e) => updateField('experience', Number(e.target.value))}
          />
        </label>
        <div>
          <p className="muted small">Classes & Subclasses</p>
          <div className="muted">{classSummary(character.classes)}</div>
        </div>
      </div>
      <div className="chip-row">
        {character.tags?.map((tag) => (
          <button key={tag} className="chip selectable" onClick={() => removeTag(tag)} title="Remove tag">
            {tag}
          </button>
        ))}
      </div>
      <div className="form-row">
        <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" />
        <button className="pill" onClick={addTag}>
          Add Tag
        </button>
      </div>
    </div>
  );
}
