import { IBlankValid } from "./IBlankValid";

export interface ITempBlankValid extends Omit<IBlankValid, 'testName' | 'authorInfo'> { }
