export function isKeyOf<T>(obj: T, key: keyof T): key is keyof T {
  return key in obj;
}
