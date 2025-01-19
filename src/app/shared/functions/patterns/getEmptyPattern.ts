import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";

export function getEmptyPattern(pkTest: number, num: number): IPatternParsed {
  return {
    quiz: pkTest,
    num,
    pattern: Array<number>(40).fill(-1)
  }
}
