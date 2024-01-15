import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";

export function getEmptyPattern(test: number, num: number): IPatternParsed {
  return {
    test,
    num,
    pattern: Array<number>(40).fill(-1)
  }
}
