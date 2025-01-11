import { IBlank } from "./IBlank";
import { IAnswer } from "../Answers/IAnswer";

export interface IBlankParsed extends IBlank {
  answers: IAnswer[],
  author: string,
  correctCount: number
  image: string
}
