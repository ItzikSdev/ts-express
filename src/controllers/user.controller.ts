import { Request, Response } from "express";
import User, { IUser } from "../db/user.model";

import crypto from "crypto-js";
import bcrypt from "bcrypt";
import bcryptConfig from "../config/bcrypt";

const UserControllerStaticClass = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, email, password: passwordBody } = req.body;
      if (!name || !email || !passwordBody)
        return res.status(400).json({ message: "Missing data" });
      const isUserExists = await User.findOne({ email }).exec();
      if (isUserExists)
        return res.status(401).json({ message: "User Already Exists" });
      const password: string = bcrypt.hashSync(passwordBody, bcryptConfig.salt);
      const access_token: string = crypto.HmacSHA256.toString();
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

  login: async (req: Request, res: Response) => {
    try {
      const { email, password, server } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Missing data" });
      const user: IUser | null = await User.findOne({ email }).exec();

      if (!user)
        return res.status(401).json({ message: "Email or Password is Wrong!" });
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Email or Password is Wrong!" });

      const isPass = {
        _id: user.id,
        name: user.name,
        email: user.email,
        access_token: user.access_token,
      };
      if (server.delete) {
        return isPass;
      }
      return res.status(200).json({ isPass });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  select: async (req: Request, res: Response) => {
    try {
      const { id: _id } = req.params;
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

  delete: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Missing data" });
      req.body = {
        email,
        password,
        server: { delete: true },
      };
      const isLogin = await UserControllerStaticClass.login(req, res);
      if (isLogin) {
        const deleted = await User.findOneAndDelete(isLogin).exec();
        res.status(202).json({ message: `User ${deleted?.email} is deleted` });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};
export default UserControllerStaticClass;
