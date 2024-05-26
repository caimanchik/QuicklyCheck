import { IStudentCreate } from "./IStudentCreate";
import { IBlankRequest } from "../Tests/Blanks/IBlankRequest";

export interface IStudent extends IStudentCreate {
  teacher: number;
  pk: number,
  grade: number,
  works: IBlankRequest[]
}
