import 'proficiency_rank.dart';
import 'skill.dart';

typedef SavingThrowId = AbilityType;

typedef SavingThrowBonus = int;

class SavingThrow {
  final SavingThrowId ability;
  final ProficiencyRank proficiency;
  final SavingThrowBonus miscBonus;

  const SavingThrow({
    required this.ability,
    this.proficiency = ProficiencyRank.none,
    this.miscBonus = 0,
  });
}
