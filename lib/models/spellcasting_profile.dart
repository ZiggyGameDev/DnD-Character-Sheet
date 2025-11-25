import 'class_level.dart';

typedef SpellId = String;

typedef SpellSlots = Map<int, int>; // level -> remaining slots

typedef PreparedSpells = Map<int, List<SpellId>>;

typedef KnownSpells = Map<int, List<SpellId>>;

typedef PactSlots = Map<int, int>; // level -> slots

typedef RecoveryRule = String; // e.g., "short", "long", "feature"

class SpellcastingProfile {
  final KnownSpells known;
  final PreparedSpells prepared;
  final SpellSlots slots;
  final PactSlots pactSlots;
  final RecoveryRule recoveryRule;

  const SpellcastingProfile({
    this.known = const {},
    this.prepared = const {},
    this.slots = const {},
    this.pactSlots = const {},
    this.recoveryRule = 'long',
  });

  SpellcastingProfile spendSlot(int level) {
    if (!slots.containsKey(level)) return this;
    final remaining = slots[level]!.clamp(0, 99) - 1;
    return SpellcastingProfile(
      known: known,
      prepared: prepared,
      pactSlots: pactSlots,
      recoveryRule: recoveryRule,
      slots: {
        ...slots,
        level: remaining < 0 ? 0 : remaining,
      },
    );
  }
}
