class AbilityScores {
  final int strength;
  final int dexterity;
  final int constitution;
  final int intelligence;
  final int wisdom;
  final int charisma;

  const AbilityScores({
    required this.strength,
    required this.dexterity,
    required this.constitution,
    required this.intelligence,
    required this.wisdom,
    required this.charisma,
  });

  int modifierFor(int score) => ((score - 10) / 2).floor();

  int get strMod => modifierFor(strength);
  int get dexMod => modifierFor(dexterity);
  int get conMod => modifierFor(constitution);
  int get intMod => modifierFor(intelligence);
  int get wisMod => modifierFor(wisdom);
  int get chaMod => modifierFor(charisma);
}
