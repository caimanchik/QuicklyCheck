import { ITest } from "./ITest";
import { IBlankParsed } from "../Blanks/IBlankParsed";

export interface ITestAllInfo extends ITest {
  blanks: IBlankParsed[]
}
