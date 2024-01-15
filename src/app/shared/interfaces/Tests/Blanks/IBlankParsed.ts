import { IBlank } from "./IBlank";
import { Answer } from "../Answers/Answer";

export interface IBlankParsed extends IBlank {
  answers: Answer[],
  author: string,
  correctCount: number
  image: string
}
