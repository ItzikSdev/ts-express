import express, { Express } from "express";
import UserControllerStaticClass from "../controllers/user.controller";
import { isAuthorizedMiddleware } from "../middlewares/user.middleware";

const userRoute: Express = express();

userRoute.get("/", UserControllerStaticClass.select);
userRoute.get("/:id", UserControllerStaticClass.select);
userRoute.post("/", UserControllerStaticClass.create);
userRoute.post("/login", UserControllerStaticClass.login);
userRoute.delete("/", isAuthorizedMiddleware, UserControllerStaticClass.delete);
userRoute.put("/", isAuthorizedMiddleware, UserControllerStaticClass.update);

export default userRoute;
