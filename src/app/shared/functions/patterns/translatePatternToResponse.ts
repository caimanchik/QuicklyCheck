import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";
import { IPatternResponse } from "../../interfaces/Tests/Patterns/IPatternResponse";

export function translatePatternToResponse(pattern: IPatternParsed): IPatternResponse {
  return {
    ...pattern,
    pattern: pattern.pattern.filter(e => e >= 0).join(',')
  }
}
