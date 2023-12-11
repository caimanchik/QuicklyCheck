import { TokenPair } from "../interfaces/Tokens/TokenPair";
import { AccessToken } from "../interfaces/Tokens/AccessToken";
import { RefreshToken } from "../interfaces/Tokens/RefreshToken";

export function IsTokenPair(token: TokenPair | AccessToken | RefreshToken): token is TokenPair {
  return (token as TokenPair).refresh !== undefined && (token as TokenPair).access !== undefined;
}
