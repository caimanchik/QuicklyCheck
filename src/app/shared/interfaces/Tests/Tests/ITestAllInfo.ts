import { ITest } from "./ITest";
import { IBlankInvalid } from "../Blanks/IBlankInvalid";
import { IClass } from "../../Classes/IClass";
import { IBlankValid } from "../Blanks/IBlankValid";
import { ITestStats } from "./ITestStats";
import { IAssessments } from "../Assessment/IAssessments";

export interface ITestAllInfo extends Omit<ITest, 'grade'>, IAssessments {
  grade: IClass
  blanks: IBlankValid[]
  invalidBlanks: IBlankInvalid[]
  withoutPattern: IBlankValid[]
  stats: ITestStats
}
