import { StudentCreate } from "./StudentCreate";

export interface Student extends StudentCreate {
  teacher: number;
  pk: number
}
