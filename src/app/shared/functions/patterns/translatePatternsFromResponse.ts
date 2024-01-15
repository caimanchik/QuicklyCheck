import { IPatternResponse } from "../../interfaces/Tests/Patterns/IPatternResponse";
import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";
import { translatePatternFromResponse } from "./translatePatternFromResponse";
import { getEmptyPattern } from "./getEmptyPattern";

export function translatePatternsFromResponse(patterns: IPatternResponse[], pkTest: number): IPatternParsed[] {
  const result = Array<IPatternParsed>(8)

  for (let i = 0; i < 8; i++)
    result[i] = getEmptyPattern(pkTest, i + 1)

  patterns.forEach(pattern => result[pattern.num - 1] = translatePatternFromResponse(pattern))

  return result
}
