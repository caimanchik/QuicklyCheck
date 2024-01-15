import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";
import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";
import { translateBlankFromRequest } from "./translateBlankFromRequest";
import { IBlankWithAuthor } from "../../interfaces/Tests/Blanks/IBlankWithAuthor";

export function translateBlanksFromRequest(blanks: IBlankWithAuthor[], patterns: IPatternParsed[]): IBlankParsed[] {
  // @ts-ignore
  return blanks.map(blank => translateBlankFromRequest(blank, patterns.find(e => e.num === blank.var)))
}
