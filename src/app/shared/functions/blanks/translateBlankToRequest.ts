import { IBlankParsed } from "../../interfaces/Tests/Blanks/IBlankParsed";
import { BlankUpdate } from "../../interfaces/Tests/Blanks/BlankUpdate";

export function translateBlankToRequest(blank: IBlankParsed): BlankUpdate {
  return {
    pk: blank.pk,
    answers: blank.answers.map(answer => answer.actual).join(','),
    var: blank.var,
    id_blank: blank.id_blank,
    test: blank.test
  }
}
