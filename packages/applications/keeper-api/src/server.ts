import cors from 'cors';
import express, { Request, Response } from 'express';

import { randomUUID } from 'crypto';

import { GoogleOauthRepository } from './google/google-oauth/google-oauth.repository'
import { GoogleOauthService } from './google/google-oauth/google-oauth.service';
import { GoogleOauthClient } from './google/google-oauth/google-oauth.client'
import { GoogleOauth } from './google/google-oauth/google-oauth.domain';

class InMemoryGoogleOauthRepository implements GoogleOauthRepository {
  private records: GoogleOauth[] = []

  async findOne(filter: GoogleOauthRepository.FindOneParameters): Promise<GoogleOauth | undefined> {
    return Promise.resolve(this.records.find((record) => (false
      || record.id === filter.id
      || record.email === filter.email
      || record.sourceId === filter.sourceId
    )))
  }

  async createOne(properties: GoogleOauthRepository.CreateOneParameters): Promise<GoogleOauth> {
    const oauth: GoogleOauth = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAd: new Date(),
      email: properties.email,
      sourceId: properties.sourceId,
      refreshToken: properties.refreshToken,
      refreshTokenExpiresAt: properties.refreshTokenExpiresAt,
      refreshTokenExchangedAt: properties.refreshTokenExchangedAt,
    }

    this.records.push(oauth)
    return Promise.resolve(oauth)
  }
  async updateOne(properties: GoogleOauthRepository.UpdateOneParameters): Promise<GoogleOauth> {
    const record = await this.findOne({ id: properties.id })

    if(!record) throw new Error('Oauth record not found.')

    record.refreshToken = properties.refreshToken ?? record.refreshToken
    record.refreshTokenExpiresAt = properties.refreshTokenExpiresAt ?? record.refreshTokenExpiresAt
    record.refreshTokenExchangedAt = properties.refreshTokenExchangedAt ?? record.refreshTokenExchangedAt

    return record
  }
}

const googleOauthClient = new GoogleOauthClient({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL!,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
});

const googleOauthRepository= new InMemoryGoogleOauthRepository()

const googleOauthService = new GoogleOauthService( googleOauthClient, googleOauthRepository)

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

  const result = await googleOauthService.upsertOauthCredentials(code);

  console.log(result)

  response.json({
    refreshToken: result.refreshToken,
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000!");
});