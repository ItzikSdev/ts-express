import { Request, Response } from "express";
import bcrypt from "bcrypt";
import bcryptConfig from "../config/bcrypt";
import jwt from "jsonwebtoken";

import User, { IUser } from "../db/user.model";
import { bcryptPasswordService } from "../services/user.service";
import {
  USER_SERVER_MESSAGE,
  TServerCommand,
  TUserReqBody,
} from "../types/types";
import {
  refreshTokenSecret,
  accessTokenSecret,
} from "../middlewares/user.middleware";

const UserControllerStaticClass = {
  /**
   * create user
   * @param req
   * @param res
   * @returns
   */
  create: async (req: Request, res: Response) => {
    try {
      const { name, email, password: passwordBody } = req.body as TUserReqBody;
      if (!name || !email || !passwordBody)
        return res
          .status(400)
          .json({ message: USER_SERVER_MESSAGE.USER_MISSING_DATA });
      const isUserExists = await User.findOne({ email }).exec();
      if (isUserExists)
        return res
          .status(401)
          .json({ message: USER_SERVER_MESSAGE.USER_EXISTS });
      const password: string = bcryptPasswordService(passwordBody);
      const refreshToken = jwt.sign(email, refreshTokenSecret);

      const newUser: IUser = await new User({
        name,
        email,
        password,
        refreshToken,
      }).save();

      return res.status(201).json(newUser);
    } catch (error) {
      return res
        .status(500)
        .json({ message: USER_SERVER_MESSAGE.INTERNAL_ERROR, error });
    }
  },
  /**
   * login user
   * @param req
   * @param res
   * @returns
   */
  login: async (req: Request, res: Response): Promise<TUserReqBody | any> => {
    try {
      const { email, password } = req.body as TUserReqBody;

      if (!email || !password)
        return res
          .status(400)
          .json({ message: USER_SERVER_MESSAGE.USER_MISSING_DATA });
      const user: IUser | null = await User.findOne({ email }).exec();
      if (!user)
        return res
          .status(401)
          .json({ message: USER_SERVER_MESSAGE.USER_EMAIL_OR_PASS_WRONG });

      const accessToken = jwt.sign({ email }, accessTokenSecret, {
        expiresIn: "60m",
      });
      const refreshToken = jwt.sign(email, refreshTokenSecret);
      user.refreshToken = refreshToken; // update refreshToken in db
      await user.save(); // save user in db

      const isPass: TUserReqBody = {
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken,
        updatePassword: "",
      };

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return false;

      if (!isPasswordValid)
        return res
          .status(401)
          .json({ message: USER_SERVER_MESSAGE.USER_EMAIL_OR_PASS_WRONG });

      return res.status(200).json({
        name: isPass.name,
        email: isPass.email,
        token: isPass.accessToken,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: USER_SERVER_MESSAGE.INTERNAL_ERROR, error });
    }
  },
  /**
   * get user by id
   * @param req
   * @param res
   * @returns
   */
  select: async (req: Request, res: Response) => {
    try {
      const { id: _id } = req.params as TUserReqBody;
      const noSelect = ["-password", "-email", "-access_token"];
      if (_id) {
        const user = await User.findOne({ _id }, noSelect).exec();
        return res.status(200).json(user);
      } else {
        const users = await User.find({}, noSelect).exec();
        return res.status(200).json(users);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: USER_SERVER_MESSAGE.INTERNAL_ERROR, error });
    }
  },
  /**
   * delete user
   * @param req
   * @param res
   * @returns
   */
  delete: async (req: Request, res: Response) => {
    try {
      const { email, verify } = req.body as TUserReqBody;
      if (!email)
        return res
          .status(400)
          .json({ message: USER_SERVER_MESSAGE.USER_MISSING_DATA });

      if (verify) {
        const deleted = await User.findOneAndDelete({ email: email }).exec();
        res.status(202).json({ message: `User ${deleted?.email} is deleted` });
      } else {
        return res
          .status(401)
          .json({ message: USER_SERVER_MESSAGE.USER_EMAIL_OR_PASS_WRONG });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: USER_SERVER_MESSAGE.INTERNAL_ERROR, error });
    }
  },
  /**
   * update user
   * @param req
   * @param res
   * @returns
   */
  update: async (req: Request, res: Response) => {
    try {
      const { email, password, updatePassword, verify } =
        req.body as TUserReqBody;
      if (!email || !password || !updatePassword)
        return res
          .status(400)
          .json({ message: USER_SERVER_MESSAGE.USER_MISSING_DATA });

      if (verify) {
        const newPassword: string = bcrypt.hashSync(
          updatePassword,
          bcryptConfig.salt
        );
        const updated = await User.findOneAndUpdate(
          { email: email },
          { password: newPassword }
        ).exec();
        res.status(202).json({
          message: `User ${updated?.email} is updated`,
        });
      } else {
        return res
          .status(401)
          .json({ message: USER_SERVER_MESSAGE.USER_EMAIL_OR_PASS_WRONG });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: USER_SERVER_MESSAGE.INTERNAL_ERROR, error });
    }
  },
};
export default UserControllerStaticClass;
