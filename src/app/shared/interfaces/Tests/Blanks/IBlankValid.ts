import { IBlank } from "./IBlank";
import { IBlankStudent } from "./IBlankStudent";
import { IBlankScore } from "./IBlankScore";

export interface IBlankValid extends IBlank {
  author: IBlankStudent
  answers: string[]
  blankScore: IBlankScore
}
