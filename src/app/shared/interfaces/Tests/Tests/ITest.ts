import { ITestCreate } from "./ITestCreate";

export interface ITest extends ITestCreate {
  teacher: number
  pk: number
}
