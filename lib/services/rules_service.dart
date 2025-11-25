import '../models/ability_scores.dart';
import '../models/class_level.dart';

class RulesService {
  int abilityMod(int score) => ((score - 10) / 2).floor();

  int proficiencyBonus(int totalLevels) {
    const table = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
    if (totalLevels < 1) return 2;
    return table[(totalLevels - 1).clamp(0, 19)];
  }

  int effectiveCasterLevel(List<ClassLevel> classes) {
    int total = 0;
    for (final cls in classes) {
      switch (cls.spellcastingProgression) {
        case SpellcastingProgression.full:
          total += cls.level;
          break;
        case SpellcastingProgression.half:
          total += (cls.level / 2).floor();
          break;
        case SpellcastingProgression.third:
          total += (cls.level / 3).floor();
          break;
        case SpellcastingProgression.pactOnly:
          break; // handled separately
        case SpellcastingProgression.none:
          break;
      }
    }
    return total;
  }
}
