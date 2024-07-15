import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app: Express = express();
app.use(express.json());

const url: string = 'http://localhost:5100'

app.get("/data", async (req: Request, res: Response) => {
    try {
        const response = await axios.get(url);
        res.json({ message: "Scraper Data: ", data: response.data });
    } catch (error) {
        console.error('Error sending data:', error);
        res.status(500).json({ error: 'Failed to send data' });
    }
});

app.post("/movie", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const response = await axios.post(url, { name }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json({ message: "Scraper Data: ", data: response.data });
    } catch (error) {
        console.error('Error sending data:', error);
        res.status(500).json({ error: 'Failed to send data' });
    }
});

app.post("/count-pages", async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const countPages: number = body.pages
        const response = await axios.post(`${url}/scrape_yts`, { pages: countPages }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        res.json({ message: "Scraper Data: ", data: response.data });
    } catch (error) {
        console.error('Error sending data:', error);
        res.status(500).json({ error: 'Failed to send data' });
    }
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});