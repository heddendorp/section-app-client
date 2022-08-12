import jwt from 'jsonwebtoken';
import fetch from 'node-fetch-native';

export class Auth0 {
  private token: string | undefined;

  public async getProfile(auth_header: string) {
    console.log(auth_header);
    const response = await fetch(`https://tumi.eu.auth0.com/userinfo`, {
      headers: {
        Authorization: `${auth_header}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return (await response.json()) as {
      email: string;
      email_verified: boolean;
      picture: string;
    };
  }

  public async getUserInfo(userId: string) {
    await this.verifyToken();
    const response = await fetch(
      `https://tumi.eu.auth0.com/api/v2/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return (await response.json()) as {
      email: string;
      email_verified: boolean;
      picture: string;
      family_name?: string;
      given_name?: string;
    };
  }

  private async verifyToken() {
    if (this.token) {
      const payload = jwt.decode(this.token);
      if (
        typeof payload !== 'string' &&
        payload?.exp &&
        new Date().getTime() / 1000 < payload.exp
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
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = (await response.json()) as { access_token: string };
    this.token = data.access_token;
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
