import { IAccessToken } from "./IAccessToken";
import { IRefreshToken } from "./IRefreshToken";

export interface ITokenPair extends IAccessToken, IRefreshToken { }
