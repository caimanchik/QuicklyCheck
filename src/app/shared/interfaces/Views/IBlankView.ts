import { IBlankValid } from "../Tests/Blanks/IBlankValid";
import { IBlankInvalid } from "../Tests/Blanks/IBlankInvalid";

export interface IBlankView {
  blank: IBlankValid | IBlankInvalid,
  arrows: {
    prev: boolean,
    next: boolean
  },
  showDetail: boolean,
  isLogged: boolean
}
