export const sortStrings = (a: string, b: string) => {
  if (a.toLowerCase() < b.toLowerCase())
    return -1;
  if (a.toLowerCase() > b.toLowerCase())
    return 1;

  return 0;
}
