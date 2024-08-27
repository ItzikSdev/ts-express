import express, { Express } from "express";
import UserControllerStaticClass from "../controllers/user.controller";

const userRoute: Express = express();

userRoute.get("/", UserControllerStaticClass.select);
userRoute.get("/:id", UserControllerStaticClass.select);
userRoute.post("/", UserControllerStaticClass.create);
userRoute.post("/login", UserControllerStaticClass.login);
userRoute.delete("/", UserControllerStaticClass.delete);
userRoute.put("/", UserControllerStaticClass.update);

export default userRoute;
