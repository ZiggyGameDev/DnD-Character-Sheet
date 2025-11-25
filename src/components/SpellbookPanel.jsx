import React, { useMemo, useState } from 'react';

export default function SpellbookPanel({ spellcasting, onUpdateSlots }) {
  const [search, setSearch] = useState('');
  const [showPrepared, setShowPrepared] = useState(true);
  const [showKnown, setShowKnown] = useState(true);
  const [showRituals, setShowRituals] = useState(false);
  const [showConcentration, setShowConcentration] = useState(false);

  const spendSlot = (level) => {
    const remaining = spellcasting.slots[level] ?? 0;
    if (remaining <= 0) return;
    onUpdateSlots({ ...spellcasting, slots: { ...spellcasting.slots, [level]: remaining - 1 } });
  };

  const restoreSlot = (level) => {
    const max = spellcasting.maxSlots[level] ?? 0;
    const next = Math.min(max, (spellcasting.slots[level] ?? 0) + 1);
    onUpdateSlots({ ...spellcasting, slots: { ...spellcasting.slots, [level]: next } });
  };

  const spendPact = () => {
    if (spellcasting.pactSlots.remaining <= 0) return;
    onUpdateSlots({
      ...spellcasting,
      pactSlots: { ...spellcasting.pactSlots, remaining: spellcasting.pactSlots.remaining - 1 },
    });
  };

  const matchesFilters = (spell) => {
    const text = `${spell.name} ${spell.tags?.join(' ') || ''} ${spell.notes || ''}`.toLowerCase();
    const passesSearch = !search || text.includes(search.toLowerCase());
    const passesRitual = !showRituals || spell.tags?.includes('Ritual');
    const passesConcentration = !showConcentration || spell.tags?.includes('Concentration');
    return passesSearch && passesRitual && passesConcentration;
  };

  const preparedLevels = useMemo(
    () =>
      Object.entries(spellcasting.preparedSpells || {}).map(([level, spells]) => ({
        level,
        spells: spells.filter(matchesFilters),
      })),
    [spellcasting, search, showRituals, showConcentration]
  );

  const knownList = useMemo(() => {
    const combined = [
      ...(spellcasting.knownSpells?.known || []),
      ...(spellcasting.knownSpells?.ritual || []),
    ];
    return combined.filter(matchesFilters);
  }, [spellcasting, search, showRituals, showConcentration]);

  const concentrationList = spellcasting.knownSpells?.concentration || [];
  const slotEntries = Object.entries(spellcasting.slots || {}).filter(([level]) => {
    const max = spellcasting.maxSlots?.[level] ?? 0;
    return max > 0 || (spellcasting.slots?.[level] ?? 0) > 0;
  });

  return (
    <div className="card">
      <div className="card-header between">
        <div>
          <h3>Spellbook</h3>
          <p className="muted">Slots, pact magic, prepared/known breakdown</p>
        </div>
        <div className="muted small">Caster level (PHB multiclass): {spellcasting.casterLevel}</div>
      </div>
      <div className="slots">
        {slotEntries.map(([level, remaining]) => (
          <div key={level} className="slot-chip">
            <button
              className={`pill ${remaining > 0 ? '' : 'ghost'}`}
              onClick={() => spendSlot(level)}
              title={`Max ${spellcasting.maxSlots[level]}`}
            >
              L{level} Slots: {remaining}/{spellcasting.maxSlots[level]}
            </button>
            <button className="pill ghost" onClick={() => restoreSlot(level)} title="Restore one">
              +
            </button>
          </div>
        ))}
        <button className={`pill ${spellcasting.pactSlots.remaining ? '' : 'ghost'}`} onClick={spendPact}>
          Pact Slots (L{spellcasting.pactSlots.level}): {spellcasting.pactSlots.remaining}/{spellcasting.pactSlots.total}
        </button>
      </div>
      <div className="filter-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter spells by name or tag"
        />
        <div className="button-row compact">
          <label className="pill ghost">
            <input type="checkbox" checked={showPrepared} onChange={(e) => setShowPrepared(e.target.checked)} /> Prepared
          </label>
          <label className="pill ghost">
            <input type="checkbox" checked={showKnown} onChange={(e) => setShowKnown(e.target.checked)} /> Known
          </label>
          <label className="pill ghost">
            <input type="checkbox" checked={showRituals} onChange={(e) => setShowRituals(e.target.checked)} /> Rituals only
          </label>
          <label className="pill ghost">
            <input
              type="checkbox"
              checked={showConcentration}
              onChange={(e) => setShowConcentration(e.target.checked)}
            />
            Concentration only
          </label>
        </div>
      </div>
      {showPrepared ? (
        <div className="spells">
          {preparedLevels.map(({ level, spells }) => (
            <div key={level} className="spell-level">
              <div className="spell-level-header">
                <h4>{level === '0' ? 'Cantrips' : `Level ${level}`}</h4>
                <span className="muted small">{spells.length} prepared</span>
              </div>
              <div className="spell-grid">
                {spells.map((spell) => (
                  <div key={spell.name} className="spell-card">
                    <div className="spell-title">{spell.name}</div>
                    <div className="spell-tags">
                      {spell.tags?.map((tag) => (
                        <span key={tag} className="chip ghost">
                          {tag}
                        </span>
                      ))}
                      {spell.ritual ? <span className="chip ghost">Ritual</span> : null}
                      {spell.castingTime ? <span className="chip ghost">{spell.castingTime}</span> : null}
                    </div>
                    <p className="muted small">{spell.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {showKnown ? (
        <div className="known-spells">
          <div className="spell-level-header">
            <h4>Known / Ritual Spells</h4>
            <span className="muted small">{knownList.length} listed</span>
          </div>
          <div className="spell-grid">
            {knownList.map((spell) => (
              <div key={spell.name} className="spell-card">
                <div className="spell-title">{spell.name}</div>
                <div className="spell-tags">
                  {spell.tags?.map((tag) => (
                    <span key={tag} className="chip ghost">{tag}</span>
                  ))}
                  {spell.level != null ? <span className="chip ghost">Level {spell.level}</span> : null}
                </div>
                <p className="muted small">{spell.notes}</p>
              </div>
            ))}
          </div>
          <div className="muted small">
            Concentration spells: {concentrationList.length ? concentrationList.join(', ') : 'None'}
          </div>
        </div>
      ) : null}
    </div>
  );
}
