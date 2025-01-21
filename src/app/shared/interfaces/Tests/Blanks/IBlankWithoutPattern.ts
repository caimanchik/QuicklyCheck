import { IBlankValid } from "./IBlankValid";

export interface IBlankWithoutPattern extends Omit<IBlankValid, 'testName' | 'authorInfo'> { }
