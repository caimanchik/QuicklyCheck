import { IStudentCreate } from "./IStudentCreate";
import { IBlankRequest } from "../Tests/Blanks/IBlankRequest";
import { IClass } from "../Classes/IClass";

export interface IStudent extends IStudentCreate {
  teacher: number;
  pk: number,
  grade: number,
  gradeDetail: IClass
  works: IBlankRequest[]
}
