import { IAnswer } from "../Answers/IAnswer";

export interface IBlankScore {
  isChecked: boolean
  percentage: number
  total: number
  right: number
  checkedAnswers: IAnswer[]
}
