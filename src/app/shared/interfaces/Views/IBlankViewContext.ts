import { IBlankView } from "./IBlankView";

export interface IBlankViewContext {
  blank: IBlankView,
  arrows: {
    prev: boolean,
    next: boolean
  },
  showDetail: boolean,
  isLogged: boolean
}
