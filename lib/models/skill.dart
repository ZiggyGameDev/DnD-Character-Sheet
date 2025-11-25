import 'proficiency_rank.dart';

enum AbilityType { str, dex, con, int, wis, cha }

typedef Bonus = int;

typedef SkillId = String;

class Skill {
  final SkillId id;
  final String name;
  final AbilityType ability;
  final ProficiencyRank proficiency;
  final Bonus miscBonus;

  const Skill({
    required this.id,
    required this.name,
    required this.ability,
    this.proficiency = ProficiencyRank.none,
    this.miscBonus = 0,
  });
}
