import cors from 'cors';
import express, { Request, Response } from 'express';
import { GoogleOauthClient } from './google-oauth-client';

const googleOauthClient = new GoogleOauthClient(
  process.env.GOOGLE_OAUTH_BASE_URL!,
  process.env.GOOGLE_OAUTH_CLIENT_ID!,
  process.env.GOOGLE_OAUTH_REDIRECT_URL!,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
);

const app = express();

app.use(cors()); 
app.use(express.json());

app.get("/server/health", (_request: Request, response: Response) => {
  response.status(200).send("API server is healthy!");
});

app.post("/api/oauth/google", async (request: Request, response: Response) => {
  const { code } = request.body;

  if (!code) {
    response.status(400).json({ message: 'Missing authorization code' });
    return;
  }

  const tokens = await googleOauthClient.exchangeToken(code);

  response.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000!");
});