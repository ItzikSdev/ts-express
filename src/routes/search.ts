import express, { Express } from "express";
import SearchControllerStaticClass from "../controllers/search.controller";
import { isAuthorizedMiddleware } from "../middlewares/user.middleware";

const searchRoute: Express = express();

searchRoute.get("/data", [
  isAuthorizedMiddleware,
  SearchControllerStaticClass.data,
]);
searchRoute.post("/movie", [
  isAuthorizedMiddleware,
  SearchControllerStaticClass.movie,
]);
searchRoute.post("/count-pages", [
  isAuthorizedMiddleware,
  SearchControllerStaticClass.countPages,
]);

export default searchRoute;
