import { VerifyCallback } from "jsonwebtoken";
export type TServerCommand = {
  update: boolean;
  delete: boolean;
};

export type TUserReqBody = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  updatePassword?: string;
  accessToken?: string;
  verify?: VerifyCallback;
};

export enum USER_SERVER_MESSAGE {
  INTERNAL_ERROR = "Internal Server Error",
  USER_EMAIL_OR_PASS_WRONG = "Email or Password is Wrong!",
  USER_MISSING_DATA = "Missing data",
  USER_EXISTS = "User Already Exists",
}
