import { AccessToken } from "./AccessToken";
import { RefreshToken } from "./RefreshToken";

export interface TokenPair extends AccessToken, RefreshToken { }
