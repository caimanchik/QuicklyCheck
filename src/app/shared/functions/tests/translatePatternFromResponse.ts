import { IPatternResponse } from "../../interfaces/Tests/Patterns/IPatternResponse";
import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";

export function translatePatternFromResponse(pattern: IPatternResponse): IPatternParsed {
  const elements = pattern.pattern.split(',');

  return {
    ...pattern,
    pattern: elements
      .map(e => parseInt(e === '' ? '0' : e))
      .concat(Array<number>(40 - elements.length).fill(-1))
  }
}
