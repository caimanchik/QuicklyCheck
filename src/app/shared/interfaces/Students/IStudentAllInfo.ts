import { IStudent } from "./IStudent";
import { IClass } from "../Classes/IClass";
import { IResultView } from "../Views/IResultView";
import { IBlankParsed } from "../Tests/Blanks/IBlankParsed";

export interface IStudentAllInfo extends Omit<IStudent, "works"> {
  gradeDetail: IClass,
  works: (IResultView & IBlankParsed)[]
}
