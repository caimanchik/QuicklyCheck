import { IStudent } from "./IStudent";
import { IClass } from "../Classes/IClass";
import { IBlankParsed } from "../Tests/Blanks/IBlankParsed";

export interface IStudentAllInfo extends Omit<IStudent, "works" | "teacher"> {
  gradeDetail: IClass,
  works: IBlankParsed[]
}
