import { IBlank } from "./IBlank";

export interface IBlankRequest extends IBlank {
  answers: string
  author: number
  image: string
}
