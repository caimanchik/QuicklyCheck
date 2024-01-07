import { UserMainInfo } from "./UserMainInfo";

export interface User extends UserMainInfo{
  password?: string,
}
