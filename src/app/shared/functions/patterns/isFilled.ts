import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";

export const isFilled = (patterns: IPatternParsed[]) => patterns
  .filter(pattern =>
    pattern.pattern
      .filter(q => q >= 0).length > 0).length > 0
