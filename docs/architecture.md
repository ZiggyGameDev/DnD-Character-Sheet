---
layout: default
title: Architecture & UX Plan
nav_order: 2
---

# D&D 5e Character Management App Design (Flutter)

A GitHub Pages–ready plan detailing goals, architecture, UX flows, and core rules logic for a Flutter-based D&D 5e character manager.

## Table of contents
1. [Clarify goals and assumptions](#1-clarify-goals-and-assumptions)
2. [Proposed architecture and data models](#2-proposed-architecture-and-data-models)
3. [Key screens and UX flows](#3-key-screens-and-ux-flows)
4. [Rules logic and pseudocode](#4-rules-logic-and-pseudocode)
5. [How it fits together](#5-how-it-fits-together)

## 1) Clarify goals and assumptions
- **Purpose**: Provide a fast, session-friendly character manager that handles complex 5e builds (multiclass, homebrew) with zero dependence on external services.
- **Platforms**: Single Flutter codebase targeting iOS and Android; offline-first with all rules baked into one XML file.
- **Content source**: Entire 5e corpus (races, classes, spells, items, rules) lives in a single packaged XML file parsed on first launch and cached locally.
- **User expectations**: Instant interactions during combat, clear roll breakdowns, and simple condition toggles; supports unlimited characters, each with optional homebrew tweaks.
- **Out of scope**: No import/export pipelines, online accounts, or marketplace mechanics.

## 2) Proposed architecture and data models
### Architectural style
- **Layered + feature modules**: Core layers (Data, Domain, Presentation) with feature bundles (Character, Combat, Spells, Session, Dice) to keep logic isolated.
- **State management**: Provider/ChangeNotifier for lightweight observable state; repository pattern between data and domain; service classes for rules math (proficiency, slot progression, dice parsing).
- **Persistence**: Local SQLite via `sqflite` (characters, user prefs) plus a cached parsed tree of the XML ruleset in shared preferences or a local database table.
- **Navigation**: Shell with bottom tabs (Characters, Session, Spellbook, Inventory/Equipment, Settings) and nested stacks for detail flows.

### Packages and layers
- **Data layer**: XML loader, DAOs for characters and encounters, mappers between XML models and domain models.
- **Domain layer**: Pure Dart models (immutable), services for rules (multiclass spell slots, rest handling, proficiency), dice expression engine.
- **Presentation layer**: Widgets and view models per feature; session-first layouts with prominent HP/conditions.

### Core data models (domain)
- `Character`: identity, background, alignment, level, list of `ClassLevel`, ability scores, proficiencies, skills, saves, senses, speeds, HP state, conditions, notes, spellcasting profile, equipment summary, tags.
- `ClassLevel`: classId, subclassId, level, hitDie, spellcastingProgression (full/half/third/none), features, hitDiceRemaining.
- `AbilityScores`: STR/DEX/CON/INT/WIS/CHA with derived modifiers.
- `Skill` and `SavingThrow`: base ability, proficiency rank (none/proficient/expertise), misc bonuses.
- `HPState`: maxHp, currentHp, tempHp, deathSaves (success/failure counts), per-class hit dice.
- `ConditionState`: exhaustionLevel, activeConditions (set of condition enums), concentrationSlot.
- `SpellcastingProfile`: known/prepared spells, per-level slot tracking, pact slots, recovery rules, ritual casting.
- `RestResource`: name, max, current, resetsOn (short/long/custom).
- `Encounter`: list of combatants with initiative, status, and quick references to attacks/spells.

### Data ingestion from XML
- Parse the shipped XML into domain models on first boot, storing hashes to avoid reparsing when unchanged.
- Provide lookup services (e.g., `RulesIndex`) keyed by IDs for classes, features, spells, and items.
- Map XML-defined progression tables (proficiency bonus, spell slots, class features) into `ProgressionTables` used by rules services.

## 3) Key screens and UX flows
### Characters tab
- **Character list**: Cards with portrait, level/class summary, tags; quick access to Session View.
- **Character builder/editor**: Multistep flow (Identity → Abilities → Class Levels → Proficiencies → Equipment → Spells → Notes); inline validation; homebrew overrides for bonuses and custom passives.

### Session View (per character)
- **HP + Conditions rail**: Large +/- buttons for damage/heal, temp HP button, death save tracker; exhaustion meter; condition chips with one-tap toggles and visual badges.
- **Roll bar**: Buttons for ability checks, saves, skills, initiative; advantage/disadvantage toggles; roll breakdown drawer with d20, modifiers, and total.
- **Spell & slot strip**: Slot counters per level with spend/restore gestures; prepared/known spell shortcuts with concentration/ritual indicators.
- **Actions pane**: Weapon attacks, cantrips, special abilities, and custom actions with quick rolls.

### Spellbook tab
- **Spell list by level**: Filter by prepared/known/ritual/concentration; detail sheets with damage, save DC, components, and scaling.
- **Slot management**: Long/short rest buttons; pact magic and multiclass slots shown side by side.

### Combat/Initiative tool
- **Encounter list**: Simple add/remove combatants (character or ad-hoc NPC); auto-sort by initiative; turn highlight and condition summaries.
- **Roll shortcuts**: One-tap initiative roll using character stats; quick damage rollers attached to combatants.

### Dice roller
- **Expression pad**: Supports `XdY+Z`, `kh/kl`, `dh/dl`, advantage/disadvantage keywords, multiple damage components (e.g., `2d8 + 1d6 + STR`).
- **History**: Last N rolls with expansion for breakdown.

### Notes and tags
- **Structured notes**: Personality traits/ideals/bonds/flaws, backstory, allies, organizations.
- **Tags**: Freeform labels to group characters; color-coded chips in list and session header.

## 4) Rules logic and pseudocode
### Ability modifiers and proficiency
```dart
int abilityMod(int score) => ((score - 10) / 2).floor();
int proficiencyBonus(int totalLevels) {
  // Level 1..20 progression
  const table = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];
  return table[(totalLevels - 1).clamp(0, 19)];
}
```

### Multiclass spell slot progression (PHB rules)
```dart
int spellcasterLevel(List<ClassLevel> classes) {
  int total = 0;
  for (final cls in classes) {
    switch (cls.spellcastingProgression) {
      case Progression.full: total += cls.level; break;
      case Progression.half: total += (cls.level / 2).floor(); break;
      case Progression.third: total += (cls.level / 3).floor(); break;
      case Progression.pactOnly: break; // Warlock slots handled separately
      case Progression.none: break;
    }
  }
  return total;
}

SpellSlots slotTableFor(int effectiveCasterLevel) {
  // Look up precomputed table derived from XML progression
  return rulesIndex.slotTables[effectiveCasterLevel];
}
```

### Short/long rest handling
```dart
void applyShortRest(Character c) {
  for (final hd in c.hp.hitDice) {
    hd.remaining = hd.max; // if class grants full on short rest (e.g., features)
  }
  c.resources
    .where((r) => r.resetsOn == ResetType.short)
    .forEach((r) => r.current = r.max);
}

void applyLongRest(Character c) {
  c.hp.currentHp = c.hp.maxHp;
  c.hp.tempHp = 0;
  c.hp.deathSaves.reset();
  c.resources.forEach((r) => r.current = r.max);
  c.spellcasting.resetAllSlots();
}
```

### Dice expression evaluation
- Tokenize expressions: numbers, dice (`d`), keep/drop (`kh/kl/dh/dl`), operators, attributes (e.g., `STR`).
- Apply modifiers for advantage/disadvantage by expanding to `2d20kh1` or `2d20kl1` before roll.
- Evaluate left-to-right respecting parentheses; aggregate multiple components.

```dart
RollResult roll(String expr, Character c) {
  final tokens = DiceLexer(expr, abilityLookup: c.abilities).tokens;
  final ast = DiceParser(tokens).parse();
  return DiceEvaluator(random: rng).evaluate(ast);
}
```

### Conditions and passive scores
- Each condition applies modifiers to checks/attacks/saves as described in XML rules; session view reads the active set and annotates rolls.
- Passive perception/insight/investigation derived as `10 + abilityMod + proficiency + misc` with custom passive entries allowed.

## 5) How it fits together
- The **XML rules index** feeds domain models and lookup services so features, spells, and progressions stay in sync with the shipped ruleset.
- **Repositories** load/save characters and encounters locally, while **services** (rules, dice, rest) compute derived state in pure Dart.
- **State controllers** (ChangeNotifiers) expose ready-to-render view models to Flutter widgets, enabling responsive Session, Spellbook, and Builder flows.
- The **Session View** emphasizes rapid HP edits, roll shortcuts, and condition visibility; the **Spellbook** and **Combat tools** reuse the same models and services to stay consistent.
- Modular feature folders keep complexity manageable and ready for expansion (e.g., homebrew data, new conditions) without touching unrelated flows.
