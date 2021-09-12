import got from 'got';
import * as jwt from 'jsonwebtoken';

export class UiAuth0 {
  private token;

  private async verifyToken() {
    if (this.token) {
      const payload = jwt.decode(this.token);
      if (typeof payload !== 'string' && new Date() < new Date(payload.exp)) {
        return;
      }
    }
    console.debug('Requesting new management token');
    const { body } = await got.post<{ access_token: string }>(
      'https://tumi.eu.auth0.com/oauth/token',
      {
        json: {
          client_id: 'TaouRQsTBU4QjXhdNNWQRvKIaqWEOKJY',
          client_secret: process.env.AUTH0_SECRET,
          audience: 'https://tumi.eu.auth0.com/api/v2/',
          grant_type: 'client_credentials',
        },
        responseType: 'json',
      }
    );
    this.token = body.access_token;
  }

  public async getUserInfo(userId) {
    await this.verifyToken();
    const { body } = await got.get<{
      email: string;
      email_verified: boolean;
      picture: string;
    }>(`https://tumi.eu.auth0.com/api/v2/users/${userId}`, {
      headers: { authorization: `Bearer ${this.token}` },
      responseType: 'json',
    });
    return body;
  }
}
