class RollResult {
  final List<int> rolls;
  final int modifier;
  final int total;
  final String breakdown;

  const RollResult({
    required this.rolls,
    required this.modifier,
    required this.total,
    required this.breakdown,
  });
}

typedef DiceExpression = String;

typedef RandomInt = int Function(int maxExclusive);

class DiceRoller {
  final RandomInt random;

  const DiceRoller({required this.random});

  RollResult roll(DiceExpression expression, {int modifier = 0}) {
    final trimmed = expression.replaceAll(' ', '');
    final parts = trimmed.split('+');
    int sum = 0;
    final rolled = <int>[];
    for (final part in parts) {
      if (part.contains('d')) {
        final segments = part.split('d');
        final count = int.parse(segments.first);
        final die = int.parse(segments.last);
        for (var i = 0; i < count; i++) {
          final value = random(die) + 1;
          rolled.add(value);
          sum += value;
        }
      } else {
        sum += int.parse(part);
      }
    }
    final total = sum + modifier;
    final breakdown = '${rolled.join(', ')}${modifier != 0 ? ' + $modifier' : ''}';
    return RollResult(
      rolls: rolled,
      modifier: modifier,
      total: total,
      breakdown: breakdown,
    );
  }
}
