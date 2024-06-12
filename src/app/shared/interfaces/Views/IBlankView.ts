import { IBlankParsed } from "../Tests/Blanks/IBlankParsed";

export interface IBlankView {
  blank: IBlankParsed,
  arrows: {
    prev: boolean,
    next: boolean
  },
  showDetail: boolean,
  isLogged: boolean
}
