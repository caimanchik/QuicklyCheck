import { IStudentCreate } from "./IStudentCreate";
import { IClass } from "../Classes/IClass";

export interface IStudent extends IStudentCreate {
  teacher: number;
  pk: number,
  grade: number,
  gradeDetail: IClass
}
