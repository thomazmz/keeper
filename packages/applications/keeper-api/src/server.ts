import express, { Request, Response } from 'express';

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("API is healthy!");
});

app.listen(3000, () => {
  console.log("API running on port 3000!");
});