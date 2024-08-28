import axios from "axios";
import { Request, Response } from "express";

const url: string = "http://localhost:5100";

const SearchControllerStaticClass = {
  data: async (req: Request, res: Response) => {
    try {
      const response = await axios.get(url);
      res.json({ message: "Scraper Data: ", data: response.data });
    } catch (error) {
      console.error("Error sending data:", error);
      res.status(500).json({ error: "Failed to send data" });
    }
  },

  movie: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const response = await axios.post(
        url,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.json({ message: "Scraper Data: ", data: response.data });
    } catch (error) {
      console.error("Error sending data:", error);
      res.status(500).json({ error: "Failed to send data" });
    }
  },

  countPages: async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const countPages: number = body.pages;
      const response = await axios.post(
        `${url}/scrape_yts`,
        { pages: countPages },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.json({ message: "Scraper Data: ", data: response.data });
    } catch (error) {
      console.error("Error sending data:", error);
      res.status(500).json({ error: "Failed to send data" });
    }
  },
};

export default SearchControllerStaticClass;
