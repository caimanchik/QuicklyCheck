import { IBlankView } from "./IBlankView";
import { IBlankValid } from "../Tests/Blanks/IBlankValid";

export interface IBlankValidView extends Omit<IBlankView, 'blank'> {
  blank: IBlankValid
}
