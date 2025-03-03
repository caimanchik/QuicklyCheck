import { IClass } from "../Classes/IClass";
import { IProfile } from "../User/IProfile";
import { IStudentCreate } from "./IStudentCreate";
import { IBlankValid } from "../Tests/Blanks/IBlankValid";
import { IStudentStats } from "./IStudentStats";

export interface IStudentAllInfo extends IStudentCreate {
  pk: number
  gradeDetail: IClass
  teacherDetail: Omit<IProfile, 'gender'> & { pk: number }
  works: IBlankValid[]
  stats: IStudentStats
}
