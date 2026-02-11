export function groupByMap<T, K>(
  items: T[],
  keySelector: (item: T) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>();

  for (const item of items) {
    const key = keySelector(item);

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)!.push(item);
  }

  return map;
}
