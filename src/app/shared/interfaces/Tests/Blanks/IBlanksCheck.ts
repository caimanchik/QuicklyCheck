import { IBlankRequest } from "./IBlankRequest";
import { IBlankInvalidRequest } from "./IBlankInvalidRequest";

export interface IBlanksCheck {
  validBlanks: IBlankRequest[]
  invalidBlanks: IBlankInvalidRequest[]
}
