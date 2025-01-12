import { IBlankValid } from "./IBlankValid";
import { IBlankInvalid } from "./IBlankInvalid";

export interface IBlanksCheck {
  validBlanks: IBlankValid[]
  invalidBlanks: IBlankInvalid[]
}
