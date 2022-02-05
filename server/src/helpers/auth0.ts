import jwt from 'jsonwebtoken';
import { RequestInfo, RequestInit } from 'node-fetch';

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

export class Auth0 {
  private token: string | undefined;

  private async verifyToken() {
    if (this.token) {
      const payload = jwt.decode(this.token);
      if (
        typeof payload !== 'string' &&
        payload?.exp &&
        new Date() < new Date(payload.exp)
      ) {
        return;
      }
    }
    console.debug('Requesting new management token');
    const response = await fetch('https://tumi.eu.auth0.com/oauth/token', {
      body: JSON.stringify({
        client_id: 'TaouRQsTBU4QjXhdNNWQRvKIaqWEOKJY',
        client_secret: process.env['AUTH0_SECRET'],
        audience: 'https://tumi.eu.auth0.com/api/v2/',
        grant_type: 'client_credentials',
      }),
      method: 'POST',
    });
    const data = (await response.json()) as { access_token: string };
    this.token = data.access_token;
  }

  public async getUserInfo(userId: string) {
    await this.verifyToken();
    const response = await fetch(
      `https://tumi.eu.auth0.com/api/v2/users/${userId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    const data = (await response.json()) as {
      email: string;
      email_verified: boolean;
      picture: string;
    };
    return data;
  }

  // public async verifyEmail(userId: string) {
  //   await this.verifyToken();
  //   const { body } = await got.post<{
  //     status: string;
  //   }>(`https://tumi.eu.auth0.com/api/v2/jobs/verification-email`, {
  //     headers: { authorization: `Bearer ${this.token}` },
  //     responseType: 'json',
  //     json: { user_id: userId },
  //   });
  //   return body;
  // }
}
