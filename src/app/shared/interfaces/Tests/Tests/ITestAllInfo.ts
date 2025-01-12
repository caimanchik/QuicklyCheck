import { ITest } from "./ITest";
import { IBlankInvalid } from "../Blanks/IBlankInvalid";
import { IClass } from "../../Classes/IClass";
import { IBlankValid } from "../Blanks/IBlankValid";

export interface ITestAllInfo extends Omit<ITest, 'grade'> {
  grade: IClass
  blanks: IBlankValid[]
  invalidBlanks: IBlankInvalid[]
}
