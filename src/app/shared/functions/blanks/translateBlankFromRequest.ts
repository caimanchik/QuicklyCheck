import { IPatternParsed } from "../../interfaces/Tests/Patterns/IPatternParsed";
import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";
import { IBlankWithAuthor } from "../../interfaces/Tests/Blanks/IBlankWithAuthor";

export function translateBlankFromRequest(blank: IBlankWithAuthor, pattern: IPatternParsed): IBlankParsed {
  let answers = blank.answers
    .split(',')
    .filter((e, i) => i < pattern.pattern.length)
    .map(e => parseInt(e))
    .map((answer, i) => {
      return {
        actual: answer,
        correct: pattern.pattern[i],
        isRight: answer === pattern.pattern[i]
      }
    })

  for (let i = 0; i < pattern.pattern.length - answers.length; i++)
    answers.push({
      actual: -1,
      correct: pattern.pattern[answers.length + i],
      isRight: false
    })

  return {
    ...blank,
    answers,
    correctCount: answers.filter(e => e.isRight).length
  }
}
