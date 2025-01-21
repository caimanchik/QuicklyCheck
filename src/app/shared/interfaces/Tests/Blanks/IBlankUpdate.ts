import { IBlankValid } from "./IBlankValid";

export interface IBlankUpdate extends Pick<IBlankValid, 'pk' | 'answers' | 'var' | 'idBlank' | 'quiz'> { }
