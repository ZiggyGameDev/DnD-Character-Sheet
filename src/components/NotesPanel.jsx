import React from 'react';

export default function NotesPanel({ notes, onUpdate }) {
  const updateField = (field, value) => onUpdate({ ...notes, [field]: value });

  return (
    <div className="card">
      <div className="card-header">
        <h3>Notes & Tags</h3>
        <p className="muted">Freeform notes plus personality blocks</p>
      </div>
      <label className="muted small">Personal notes</label>
      <textarea value={notes.personal} onChange={(e) => updateField('personal', e.target.value)} />
      <label className="muted small">Active quests</label>
      <textarea value={notes.quests} onChange={(e) => updateField('quests', e.target.value)} />
      <label className="muted small">Traits</label>
      <textarea value={notes.traits} onChange={(e) => updateField('traits', e.target.value)} />
      <label className="muted small">Ideals</label>
      <textarea value={notes.ideals} onChange={(e) => updateField('ideals', e.target.value)} />
      <label className="muted small">Bonds</label>
      <textarea value={notes.bonds} onChange={(e) => updateField('bonds', e.target.value)} />
      <label className="muted small">Flaws</label>
      <textarea value={notes.flaws} onChange={(e) => updateField('flaws', e.target.value)} />
      <label className="muted small">Backstory</label>
      <textarea value={notes.backstory} onChange={(e) => updateField('backstory', e.target.value)} />
      <label className="muted small">Tags</label>
      <input value={notes.tags.join(', ')} onChange={(e) => updateField('tags', e.target.value.split(',').map((t) => t.trim()))} />
      <div className="chip-grid">
        {notes.tags.map((tag) => (
          <span key={tag} className="chip ghost">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
