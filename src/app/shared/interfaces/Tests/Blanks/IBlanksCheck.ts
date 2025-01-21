import { IBlankValid } from "./IBlankValid";
import { IBlankInvalid } from "./IBlankInvalid";
import { IBlankWithoutPattern } from "./IBlankWithoutPattern";

export interface IBlanksCheck {
  blanks: IBlankValid[]
  invalidBlanks: IBlankInvalid[]
  withoutPattern: IBlankWithoutPattern[]
}
