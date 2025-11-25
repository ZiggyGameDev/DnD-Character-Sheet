import React, { useMemo, useState } from 'react';
import HeroHeader from './components/HeroHeader.jsx';
import StatGrid from './components/StatGrid.jsx';
import SavingSkills from './components/SavingSkills.jsx';
import HPPanel from './components/HPPanel.jsx';
import ConditionPanel from './components/ConditionPanel.jsx';
import SpellbookPanel from './components/SpellbookPanel.jsx';
import InitiativePanel from './components/InitiativePanel.jsx';
import DiceRoller from './components/DiceRoller.jsx';
import NotesPanel from './components/NotesPanel.jsx';
import RestPanel from './components/RestPanel.jsx';
import CharacterList from './components/CharacterList.jsx';
import IdentityCard from './components/IdentityCard.jsx';
import CombatStats from './components/CombatStats.jsx';
import QuickRolls from './components/QuickRolls.jsx';
import FeatureChecklist from './components/FeatureChecklist.jsx';
import { demoCharacter } from './data/demoCharacter.js';
import { abilityMod } from './utils/calculations.js';
import { buildSpellcastingState } from './utils/spellcasting.js';
import PassivesPanel from './components/PassivesPanel.jsx';

const Section = ({ id, title, children, subtitle }) => (
  <section id={id} className="section">
    <div className="section-header">
      <h2>{title}</h2>
      {subtitle ? <p className="muted">{subtitle}</p> : null}
    </div>
    <div className="section-body">{children}</div>
  </section>
);

function createBlankCharacter(name, proficiency = 2) {
  const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  return {
    id,
    name,
    race: 'Human',
    subrace: '',
    background: 'Folk Hero',
    alignment: 'Neutral Good',
    level: 1,
    experience: 0,
    proficiency,
    armorClass: 12,
    initiativeBonus: 2,
    speed: { walk: 30 },
    senses: ['Passive Perception 12'],
    tags: ['New'],
    classes: [{ name: 'Fighter', level: 1, subclass: '', hitDie: 'd10', spellcasting: 'none' }],
    abilities: {
      STR: { score: 15 },
      DEX: { score: 14 },
      CON: { score: 14 },
      INT: { score: 10 },
      WIS: { score: 10 },
      CHA: { score: 10 },
    },
    savingThrows: {
      STR: { proficient: true },
      DEX: { proficient: false },
      CON: { proficient: true },
      INT: { proficient: false },
      WIS: { proficient: false },
      CHA: { proficient: false },
    },
    skills: [
      { name: 'Athletics', ability: 'STR', proficient: true },
      { name: 'Perception', ability: 'WIS', proficient: true },
      { name: 'Survival', ability: 'WIS', proficient: false },
    ],
    passives: {
      perception: 10 + abilityMod(10) + proficiency,
      investigation: 10,
      insight: 10,
      custom: [],
    },
    hp: {
      max: 12,
      current: 12,
      temp: 0,
      hitDice: [{ die: 'd10', total: 1, remaining: 1 }],
      deathSaves: { success: 0, fail: 0 },
    },
    conditions: { exhaustion: 0, list: { prone: { label: 'Prone', active: false } } },
    actions: [{ name: 'Longsword', type: 'Weapon', expression: '1d20 + STR + PB', damage: '1d8 + STR', note: 'Versatile' }],
    spellcasting: {
      casterType: 'martial',
      slots: { 1: 0 },
      maxSlots: { 1: 0 },
      pactSlots: { level: 1, total: 0, remaining: 0 },
      preparedSpells: { 0: [] },
      knownSpells: { ritual: [], concentration: [], known: [] },
    },
    restResources: [{ name: 'Second Wind', remaining: 1, total: 1, refresh: 'Short Rest' }],
    initiativeTracker: { entries: [], activeId: null },
    notes: {
      personal: '',
      quests: '',
      tags: ['New'],
      traits: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: '',
    },
  };
}

export default function App() {
  const [characters, setCharacters] = useState([demoCharacter]);
  const [activeId, setActiveId] = useState(demoCharacter.id);

  const character = useMemo(() => characters.find((c) => c.id === activeId) || characters[0], [characters, activeId]);
  const computedSpellcasting = useMemo(() => buildSpellcastingState(character), [character]);

  const updateCharacter = (updater) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (!character || c.id !== character.id) return c;
        if (typeof updater === 'function') return updater(c);
        return { ...c, ...updater };
      })
    );
  };

  const addCharacter = (name) => {
    const blank = createBlankCharacter(name);
    setCharacters((prev) => [...prev, blank]);
    setActiveId(blank.id);
  };

  if (!character) return null;

  const passiveScores = character.passives;

  const handleConditionToggle = (key) => {
    updateCharacter((c) => ({
      ...c,
      conditions: {
        ...c.conditions,
        list: {
          ...c.conditions.list,
          [key]: { ...c.conditions.list[key], active: !c.conditions.list[key]?.active },
        },
      },
    }));
  };

  const handleAddCondition = (label) => {
    const key = label.toLowerCase().replace(/\s+/g, '-');
    updateCharacter((c) => ({
      ...c,
      conditions: {
        ...c.conditions,
        list: { ...c.conditions.list, [key]: { label, active: true } },
      },
    }));
  };

  const handleHPUpdate = (hp) => updateCharacter((c) => ({ ...c, hp }));

  const handleSpellUpdate = (spellcasting) =>
    updateCharacter((c) => ({ ...c, spellcasting: buildSpellcastingState({ ...c, spellcasting }) }));

  const handleRestResources = (updater) => {
    updateCharacter((c) => ({
      ...c,
      restResources: typeof updater === 'function' ? updater(c.restResources) : updater,
    }));
  };

  const applyShortRest = () => {
    updateCharacter((c) => {
      const spellState = buildSpellcastingState(c);
      return {
        ...c,
        hp: { ...c.hp, temp: 0, deathSaves: { success: 0, fail: 0 } },
        spellcasting: {
          ...spellState,
          pactSlots: { ...spellState.pactSlots, remaining: spellState.pactSlots.total },
        },
        restResources: c.restResources.map((res) =>
          res.refresh === 'Short Rest' ? { ...res, remaining: res.total } : res
        ),
      };
    });
  };

  const applyLongRest = () => {
    updateCharacter((c) => {
      const spellState = buildSpellcastingState(c);
      return {
        ...c,
        hp: {
          ...c.hp,
          current: c.hp.max,
          temp: 0,
          deathSaves: { success: 0, fail: 0 },
          hitDice: c.hp.hitDice.map((die) => ({ ...die, remaining: die.total })),
        },
        spellcasting: {
          ...spellState,
          slots: { ...spellState.maxSlots },
          pactSlots: { ...spellState.pactSlots, remaining: spellState.pactSlots.total },
        },
        restResources: c.restResources.map((res) => ({ ...res, remaining: res.total })),
      };
    });
  };

  const updateNotes = (notes) => updateCharacter((c) => ({ ...c, notes }));
  const updatePassives = (passives) => updateCharacter((c) => ({ ...c, passives }));

  return (
    <div className="page">
      <HeroHeader character={character} passiveScores={passiveScores} />
      <main>
        <Section id="features" title="Feature Coverage" subtitle="Checklist from the architecture docs">
          <FeatureChecklist />
        </Section>

        <Section id="characters" title="Roster & Identity" subtitle="Switch heroes and keep core identity fields updated">
          <div className="grid two">
            <CharacterList
              characters={characters}
              activeId={character.id}
              onSelect={setActiveId}
              onAdd={addCharacter}
            />
            <IdentityCard character={character} onUpdate={(updated) => updateCharacter(updated)} />
          </div>
          <CombatStats character={character} />
        </Section>

        <Section
          id="stats"
          title="Abilities & Proficiencies"
          subtitle="Core math for rolls, saves, and passive scores"
        >
          <div className="grid two">
            <StatGrid abilities={character.abilities} speed={character.speed} senses={character.senses} />
            <SavingSkills
              saves={character.savingThrows}
              skills={character.skills}
              proficiency={character.proficiency}
              abilities={character.abilities}
            />
          </div>
          <PassivesPanel passives={character.passives} onChange={updatePassives} />
        </Section>

        <Section
          id="session"
          title="Session Control"
          subtitle="Table-optimized HP, conditions, quick rolls, and initiative in one place"
        >
          <div className="grid two">
            <HPPanel hp={character.hp} onUpdate={handleHPUpdate} />
            <ConditionPanel
              conditions={character.conditions}
              onToggle={handleConditionToggle}
              onExhaustionChange={(value) =>
                updateCharacter((c) => ({ ...c, conditions: { ...c.conditions, exhaustion: value } }))
              }
              onAdd={handleAddCondition}
            />
          </div>
          <div className="grid two">
            <QuickRolls character={character} />
            <InitiativePanel
              tracker={character.initiativeTracker}
              onChange={(next) => updateCharacter((c) => ({ ...c, initiativeTracker: next }))}
              proficiency={character.proficiency}
              dexMod={abilityMod(character.abilities.DEX.score)}
            />
          </div>
        </Section>

        <Section id="spells" title="Spells & Slots" subtitle="Prepared/known spells, multiclass slots, and rest shortcuts">
          <div className="grid two">
            <SpellbookPanel spellcasting={computedSpellcasting} onUpdateSlots={handleSpellUpdate} />
            <RestPanel
              spellcasting={computedSpellcasting}
              resources={character.restResources}
              onLongRest={applyLongRest}
              onShortRest={applyShortRest}
              onResourceChange={handleRestResources}
            />
          </div>
        </Section>

        <Section id="tools" title="Dice, Notes, & Journal" subtitle="Quick rolls and campaign context">
          <div className="grid two">
            <DiceRoller proficiency={character.proficiency} abilities={character.abilities} />
            <NotesPanel notes={character.notes} onUpdate={updateNotes} />
          </div>
        </Section>
      </main>
      <footer className="footer">
        <p className="muted">
          Built for GitHub Pages using React + Vite. All rules content assumed to live in the bundled XML dataset.
        </p>
      </footer>
    </div>
  );
}
