import { log } from "console";
import express, { Express, Request, Response } from "express";

const healthRoute: Express = express();

healthRoute.get("/", (req: Request, res: Response) => {
  try {
    res.json({ message: "server is healthy" });
  } catch (error) {
    log(error);
    res.status(500).json({ error: "Failed to send data" });
  }
});

export { healthRoute };
