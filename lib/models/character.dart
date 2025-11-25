import 'ability_scores.dart';
import 'class_level.dart';
import 'condition_state.dart';
import 'hp_state.dart';
import 'rest_resource.dart';
import 'saving_throw.dart';
import 'skill.dart';
import 'spellcasting_profile.dart';

class Character {
  final String id;
  final String name;
  final String race;
  final String? subrace;
  final List<ClassLevel> classes;
  final AbilityScores abilities;
  final Map<AbilityType, SavingThrow> savingThrows;
  final Map<SkillId, Skill> skills;
  final HPState hp;
  final ConditionState conditions;
  final SpellcastingProfile spellcasting;
  final List<RestResource> resources;
  final List<String> tags;
  final String background;
  final String alignment;
  final int experience;
  final double speed;
  final Map<String, int> senses;
  final Map<String, int> passiveScores;
  final String notes;

  const Character({
    required this.id,
    required this.name,
    required this.race,
    this.subrace,
    required this.classes,
    required this.abilities,
    required this.savingThrows,
    required this.skills,
    required this.hp,
    required this.conditions,
    required this.spellcasting,
    this.resources = const [],
    this.tags = const [],
    this.background = '',
    this.alignment = '',
    this.experience = 0,
    this.speed = 30,
    this.senses = const {},
    this.passiveScores = const {},
    this.notes = '',
  });

  int get totalLevel => classes.fold<int>(0, (sum, cls) => sum + cls.level);
}
