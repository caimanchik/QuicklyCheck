import { ITest } from "./ITest";
import { IBlankInvalidParsed } from "../Blanks/IBlankInvalidParsed";
import { IClass } from "../../Classes/IClass";
import { IBlankValid } from "../Blanks/IBlankValid";

export interface ITestAllInfo extends Omit<ITest, 'grade'> {
  grade: IClass
  blanks: IBlankValid[]
  invalidBlanks: IBlankInvalidParsed[]
}
