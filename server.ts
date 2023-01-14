import express from 'express';
import  { Request, Response, Application } from "express";
const app: Application = express();
const PORT = 8000;

app.get("/", (req: Request, res: Response): void => {
    res.send("Hello Typescript!! TESTING");
});

app.listen(PORT, (): void => {
console.log(`Server Running here  https://localhost:${PORT}`);
});
  