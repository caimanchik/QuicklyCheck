import { IClass } from "./IClass";
import { ITest } from "../Tests/Tests/ITest";
import { IStudent } from "../Students/IStudent";

export interface IClassAllInfo extends IClass {
  quizzes: ITest[]
  students: IStudent[]
}
