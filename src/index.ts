import express, { Express } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnect";
import { healthRoute, userRoute, movieRoute } from "./routes";

dotenv.config({ path: ".env" }); // environment variables
dbConnect(); // connect to db

const app: Express = express();
app.use(express.json());

app.use("/health", healthRoute);
app.use("/users", userRoute);
app.use("/movie", movieRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
