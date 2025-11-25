enum ResetType { short, long, custom }

class RestResource {
  final String name;
  final int max;
  final int current;
  final ResetType resetsOn;

  const RestResource({
    required this.name,
    required this.max,
    required this.current,
    required this.resetsOn,
  });

  RestResource restore() => RestResource(
        name: name,
        max: max,
        current: max,
        resetsOn: resetsOn,
      );
}
