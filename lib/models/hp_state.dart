import 'class_level.dart';

typedef HitDicePool = Map<HitDie, int>;

typedef DeathSaveCounter = int;

class HPState {
  final int maxHp;
  final int currentHp;
  final int tempHp;
  final HitDicePool hitDice;
  final DeathSaveCounter deathSaveSuccesses;
  final DeathSaveCounter deathSaveFailures;

  const HPState({
    required this.maxHp,
    required this.currentHp,
    this.tempHp = 0,
    this.hitDice = const {},
    this.deathSaveSuccesses = 0,
    this.deathSaveFailures = 0,
  });

  HPState copyWith({
    int? maxHp,
    int? currentHp,
    int? tempHp,
    HitDicePool? hitDice,
    DeathSaveCounter? deathSaveSuccesses,
    DeathSaveCounter? deathSaveFailures,
  }) {
    return HPState(
      maxHp: maxHp ?? this.maxHp,
      currentHp: currentHp ?? this.currentHp,
      tempHp: tempHp ?? this.tempHp,
      hitDice: hitDice ?? this.hitDice,
      deathSaveSuccesses: deathSaveSuccesses ?? this.deathSaveSuccesses,
      deathSaveFailures: deathSaveFailures ?? this.deathSaveFailures,
    );
  }
}
