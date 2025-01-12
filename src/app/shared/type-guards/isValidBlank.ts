import { IBlankValid } from "../interfaces/Tests/Blanks/IBlankValid";
import { IBlankInvalid } from "../interfaces/Tests/Blanks/IBlankInvalid";

export function isValidBlank(blank: IBlankValid | IBlankInvalid): blank is IBlankValid {
  return (blank as IBlankValid).blankScore !== undefined
}
