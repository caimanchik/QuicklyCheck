import { ITokenPair } from "../interfaces/Tokens/ITokenPair";
import { IAccessToken } from "../interfaces/Tokens/IAccessToken";
import { IRefreshToken } from "../interfaces/Tokens/IRefreshToken";

export function IsTokenPair(token: ITokenPair | IAccessToken | IRefreshToken): token is ITokenPair {
  return (token as ITokenPair).refresh !== undefined && (token as ITokenPair).access !== undefined;
}
