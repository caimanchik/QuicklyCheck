import { IBlankValid } from "../Tests/Blanks/IBlankValid";

export interface IBlankView {
  blank: IBlankValid,
  arrows: {
    prev: boolean,
    next: boolean
  },
  showDetail: boolean,
  isLogged: boolean
}
