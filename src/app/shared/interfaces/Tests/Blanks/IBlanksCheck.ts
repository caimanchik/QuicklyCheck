import { IBlankValid } from "./IBlankValid";
import { IBlankInvalid } from "./IBlankInvalid";

export interface IBlanksCheck {
  blanks: IBlankValid[]
  invalidBlanks: IBlankInvalid[]
  withoutPattern: IBlankValid[]
}
