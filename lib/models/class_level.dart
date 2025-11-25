enum SpellcastingProgression { full, half, third, pactOnly, none }

typedef ClassId = String;
typedef SubclassId = String;

typedef HitDie = int;

class ClassLevel {
  final ClassId classId;
  final SubclassId? subclassId;
  final int level;
  final HitDie hitDie;
  final SpellcastingProgression spellcastingProgression;
  final int hitDiceRemaining;

  const ClassLevel({
    required this.classId,
    required this.level,
    required this.hitDie,
    this.subclassId,
    this.spellcastingProgression = SpellcastingProgression.none,
    this.hitDiceRemaining = 0,
  });
}
