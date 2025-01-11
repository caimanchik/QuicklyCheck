import { IBlankRequest } from "./IBlankRequest";

export type BlankUpdate = Pick<IBlankRequest, 'pk' | 'answers' | 'var' | 'id_blank' | 'quiz'>
