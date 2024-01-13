import { IStudentCreate } from "./IStudentCreate";

export interface IStudent extends IStudentCreate {
  teacher: number;
  pk: number
}
