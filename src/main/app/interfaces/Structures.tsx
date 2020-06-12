export type Dictionary<TKey extends number | string, TValue> = {
  [key in TKey]: TValue
};