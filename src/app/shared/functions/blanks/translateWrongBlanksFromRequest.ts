import { IBlankInvalidRequest } from "../../interfaces/Tests/Blanks/IBlankInvalidRequest";
import { IBlankInvalidParsed } from "../../interfaces/Tests/Blanks/IBlankInvalidParsed";

export function translateWrongBlanksFromRequest(blanks: IBlankInvalidRequest[]): IBlankInvalidParsed[] {
  return blanks.map(blank => ({
    ...blank,
    createdAt: new Date(blank.createdAt)
  }))
}
