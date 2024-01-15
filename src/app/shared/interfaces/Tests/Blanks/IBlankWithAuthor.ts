import { IBlankRequest } from "./IBlankRequest";

export interface IBlankWithAuthor extends Omit<IBlankRequest, 'author'> {
  author: string
}
