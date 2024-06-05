import { ITest } from "./ITest";
import { IBlankParsed } from "../Blanks/IBlankParsed";
import { IBlankWrongParsed } from "../Blanks/IBlankWrongParsed";

export interface ITestAllInfo extends ITest {
  blanks: IBlankParsed[]
  wrongBlanks: IBlankWrongParsed[]
}
