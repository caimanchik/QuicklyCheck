import { IBlankInvalidRequest } from "../../interfaces/Tests/Blanks/IBlankInvalidRequest";
import { IBlankInvalidParsed } from "../../interfaces/Tests/Blanks/IBlankInvalidParsed";

export function translateInvalidBlanksFromRequest(blanks: IBlankInvalidRequest[]): IBlankInvalidParsed[] {
  return blanks.map(blank => ({
    ...blank,
    created_at: new Date(blank.created_at)
  }))
}
