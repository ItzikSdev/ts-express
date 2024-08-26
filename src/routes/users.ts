import axios from "axios";
import { log } from "console";
import express, { Express, Request, Response } from "express";
import UserControllerStaticClass from "../controllers/user.controller";

const userRoute: Express = express();

// users
userRoute.get("/", UserControllerStaticClass.select);
userRoute.get("/:id", UserControllerStaticClass.select);
userRoute.post("/", UserControllerStaticClass.create);
userRoute.delete("/", UserControllerStaticClass.delete);

// login
userRoute.post("/login", UserControllerStaticClass.login);

export default userRoute;
