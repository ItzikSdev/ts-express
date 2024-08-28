import jwt, { VerifyCallback } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Secret key for JWT
export const accessTokenSecret = "youraccesstokensecret";
export const refreshTokenSecret = "yourrefreshtokensecret";

export const isAuthorizedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization as string;
  if (accessToken) {
    const token = accessToken.split(" ")[1];

    jwt.verify(
      token,
      accessTokenSecret,
      (err, user): VerifyCallback | undefined | Response => {
        if (err) return res.sendStatus(403);
        req.body.verify = user;
      }
    );
    next();
  } else {
    res.sendStatus(401);
  }
};
