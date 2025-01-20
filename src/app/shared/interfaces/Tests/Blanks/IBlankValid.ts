import { IBlank } from "./IBlank";
import { IBlankStudent } from "./IBlankStudent";
import { IBlankScore } from "./IBlankScore";

export interface IBlankValid extends IBlank {
  authorInfo: IBlankStudent
  answers: string[]
  blankScore: IBlankScore
  assessment: string
}
