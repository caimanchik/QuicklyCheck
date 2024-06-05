import { IBlankWrongRequest } from "../../interfaces/Tests/Blanks/IBlankWrongRequest";
import { IBlankWrongParsed } from "../../interfaces/Tests/Blanks/IBlankWrongParsed";

export function translateWrongBlanksFromRequest(blanks: IBlankWrongRequest[]): IBlankWrongParsed[] {
  return blanks.map(blank => ({
    ...blank,
    createdAt: new Date(blank.createdAt)
  }))
}
