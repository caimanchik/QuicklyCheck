import { IStudent } from "./IStudent";
import { IClass } from "../Classes/IClass";
import { IResultView } from "../Views/IResultView";
import { IBlank } from "../Tests/Blanks/IBlank";

export interface IStudentAllInfo extends Omit<IStudent, "works"> {
  classInfo: IClass,
  works: (IResultView & IBlank)[]
}
