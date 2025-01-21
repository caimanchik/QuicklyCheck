import { IBlankScore } from "../Tests/Blanks/IBlankScore";

export interface IBlankView {
  pk: number
  quiz: number
  image: string
  createdAt: Date
  authorInfo?: string
  idBlank?: string
  var?: number;
  testName?: string
  answers?: string[]
  blankScore?: IBlankScore
  assessment?: string
}
