import { Class } from "./Class";
import { Test } from "../Tests/Tests/Test";
import { Student } from "../Students/Student";

export interface ClassAllInfo extends Class {
  tests: Test[]
  students: Student[]
}
