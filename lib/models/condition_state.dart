enum Condition { blinded, charmed, deafened, frightened, grappled, incapacitated, invisible, paralyzed, petrified, poisoned, prone, restrained, stunned, unconscious, exhaustion }

class ConditionState {
  final int exhaustionLevel;
  final Set<Condition> activeConditions;

  const ConditionState({
    this.exhaustionLevel = 0,
    this.activeConditions = const {},
  });

  ConditionState copyWith({int? exhaustionLevel, Set<Condition>? activeConditions}) {
    return ConditionState(
      exhaustionLevel: exhaustionLevel ?? this.exhaustionLevel,
      activeConditions: activeConditions ?? this.activeConditions,
    );
  }
}
