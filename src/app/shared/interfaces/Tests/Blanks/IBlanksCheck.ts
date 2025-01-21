import { IBlankValid } from "./IBlankValid";
import { IBlankInvalid } from "./IBlankInvalid";
import { ITempBlankValid } from "./ITempBlankValid";

export interface IBlanksCheck {
  blanks: (IBlankValid | ITempBlankValid)[]
  invalidBlanks: IBlankInvalid[]
  withoutPattern: IBlankValid[]
}
