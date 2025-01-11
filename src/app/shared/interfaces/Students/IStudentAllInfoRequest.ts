import { IClass } from "../Classes/IClass";
import { IResultView } from "../Views/IResultView";
import { IBlankParsed } from "../Tests/Blanks/IBlankParsed";
import { IProfile } from "../User/IProfile";
import { IStudentCreate } from "./IStudentCreate";
import { IBlankRequest } from "../Tests/Blanks/IBlankRequest";

export interface IStudentAllInfoRequest extends IStudentCreate {
  pk: number
  gradeDetail: IClass
  teacherDetail: Omit<IProfile, 'gender'> & { pk: number }
  works: IBlankRequest[]
}
