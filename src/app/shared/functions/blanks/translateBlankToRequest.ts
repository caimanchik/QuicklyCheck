import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";
import { BlankUpdate } from "../../interfaces/Tests/Blanks/BlankUpdate";

export function translateBlankToRequest(blank: IBlankParsed): BlankUpdate {
  return {
    pk: blank.pk,
    answers: blank.answers.map(answer => answer.actual.toString()),
    var: blank.var,
    idBlank: blank.idBlank,
    quiz: blank.quiz
  }
}
