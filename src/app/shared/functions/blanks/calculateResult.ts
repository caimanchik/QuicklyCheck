import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";
import { IResultView } from "../../interfaces/Views/IResultView";

export function calculateResult(blank: IBlankParsed): IResultView {
  const actual = blank.answers.filter(e => e.isRight).length
  const right = blank.answers.length

  return {
    actual,
    right,
    percentage: Math.round(actual / right * 100)
  }
}
