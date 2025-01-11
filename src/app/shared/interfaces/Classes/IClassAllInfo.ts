import { IClass } from "./IClass";
import { ITest } from "../Tests/Tests/ITest";
import { IStudent } from "../Students/IStudent";
import { IClassStats } from "./IClassStats";

export interface IClassAllInfo extends IClass {
  quizzes: ITest[]
  students: IStudent[]
  stats: IClassStats
}
