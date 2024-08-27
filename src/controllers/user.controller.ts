import { Request, Response } from "express";
import bcrypt from "bcrypt";
import bcryptConfig from "../config/bcrypt";

import User, { IUser } from "../db/user.model";
import {
  accessTokenService,
  bcryptPasswordService,
} from "../services/user.service";
import { TServerCommand, TUserReqBody } from "../types/types";

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
        return res.status(400).json({ message: "Missing data" });
      const isUserExists = await User.findOne({ email }).exec();
      if (isUserExists)
        return res.status(401).json({ message: "User Already Exists" });
      const password: string = bcryptPasswordService(passwordBody);
      const access_token: string = accessTokenService(email, password);
      const newUser: IUser = await new User({
        name,
        email,
        password,
        access_token,
      }).save();

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
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
      const { email, password, server } = req.body as TUserReqBody & {
        server: TServerCommand;
      };

      if (!email || !password)
        return res.status(400).json({ message: "Missing data" });
      const user: IUser | null = await User.findOne({ email }).exec();
      if (!user)
        return res.status(401).json({ message: "Email or Password is Wrong!" });

      const isPass: TUserReqBody = {
        id: user.id,
        name: user.name,
        email: user.email,
        access_token: user.access_token,
        updatePassword: "",
      };

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if ((!isPasswordValid && server.delete) || server.update) {
        return false;
      }
      if (!isPasswordValid)
        return res.status(401).json({ message: "Email or Password is Wrong!" });

      if (server.delete || server.update) {
        return isPass;
      }
      return res.status(200).json({ isPass });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
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
      return res.status(500).json({ message: "Internal Server Error", error });
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
      const { email, password } = req.body as TUserReqBody;
      if (!email || !password)
        return res.status(400).json({ message: "Missing data" });
      req.body = {
        email,
        password,
        server: { delete: true } as TServerCommand,
      };
      const isLogin: TUserReqBody = await UserControllerStaticClass.login(
        req,
        res
      );
      if (isLogin) {
        const deleted = await User.findOneAndDelete({ _id: isLogin.id }).exec();
        res.status(202).json({ message: `User ${deleted?.email} is deleted` });
      } else {
        return res.status(401).json({ message: "Email or Password is Wrong!" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
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
      const { email, password, updatePassword } = req.body as TUserReqBody;
      if (!email || !password || !updatePassword)
        return res.status(400).json({ message: "Missing data" });
      req.body = {
        email,
        password,
        server: { update: true } as TServerCommand,
      };
      const isLogin: TUserReqBody = await UserControllerStaticClass.login(
        req,
        res
      );
      if (isLogin.id) {
        const password: string = bcrypt.hashSync(
          updatePassword,
          bcryptConfig.salt
        );
        const access_token: string = accessTokenService(email, updatePassword);

        const updated = await User.findByIdAndUpdate(
          { _id: isLogin.id },
          {
            password,
            access_token,
          }
        ).exec();
        res.status(202).json({
          message: `User ${updated?.email} is updated`,
        });
      } else {
        return res.status(401).json({ message: "Email or Password is Wrong!" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};
export default UserControllerStaticClass;
