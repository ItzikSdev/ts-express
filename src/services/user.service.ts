import crypto from "crypto-js";
import bcrypt from "bcrypt";
import bcryptConfig from "../config/bcrypt";

/**
 *
 * @param email
 * @param password
 * @returns
 */
export const accessTokenService = (
  email: string,
  password: string,
  time: number
): string => {
  try {
    const sha256 = crypto.SHA256;
    const access_token: string = sha256(email + password + time).toString();
    return access_token;
  } catch (error) {
    if (error instanceof Error) {
      return `Error generating access token: ${error.message}`;
    } else {
      return "An unknown error occurred while generating access token.";
    }
  }
};
/**
 *
 * @param password
 * @returns
 */
export const bcryptPasswordService = (password: string): string => {
  try {
    const bcryptPass = bcrypt.hashSync(password, bcryptConfig.salt);
    return bcryptPass;
  } catch (error) {
    if (error instanceof Error) {
      return `Error generating bcrypt password: ${error.message}`;
    } else {
      return "An unknown error occurred while generating bcrypt password.";
    }
  }
};
