import { IClass } from "../Classes/IClass";
import { IResultView } from "../Views/IResultView";
import { IBlankParsed } from "../Tests/Blanks/IBlankParsed";
import { IProfile } from "../User/IProfile";
import { IStudentCreate } from "./IStudentCreate";

export interface IStudentAllInfoRequest extends IStudentCreate {
  pk: number
  gradeDetail: IClass
  teacherDetail: Omit<IProfile, 'gender'> & { pk: number }
  works: (IResultView & IBlankParsed)[]
}
