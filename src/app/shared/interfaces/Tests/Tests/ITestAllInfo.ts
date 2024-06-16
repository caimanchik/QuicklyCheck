import { ITest } from "./ITest";
import { IBlankParsed } from "../Blanks/IBlankParsed";
import { IBlankInvalidParsed } from "../Blanks/IBlankInvalidParsed";

export interface ITestAllInfo extends ITest {
  blanks: IBlankParsed[]
  invalidBlanks: IBlankInvalidParsed[]
}
