import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/services/session.server';
import { Auth0Strategy } from 'remix-auth-auth0';
import { User } from '~/generated/prisma';
import { db } from '~/utils/db.server';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new Auth0Strategy(
    {
      domain: 'tumi.eu.auth0.com',
      clientID: 'BDYrE7BvffqlpP6kFI988qYXK6yamV1m',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      callbackURL: process.env.AUTH0_CALLBACK_URL ?? '',
      scope: 'openid profile email',
    },
    async ({ accessToken, refreshToken, extraParams, profile }) => {
      const user = await db.user.findUnique({
        where: { authId: profile.id },
      });
      if (!user) {
        return db.user.create({
          data: {
            authId: profile.id,
            firstName: profile.name.givenName ?? '',
            lastName: profile.name.familyName ?? '',
            email: profile.emails[0]?.value ?? '',
            photo: profile.photos[0]?.value ?? '',
          },
        });
      } else {
        return db.user.update({
          where: { authId: profile.id },
          data: {
            photo: profile.photos[0]?.value ?? '',
          },
        });
      }
    }
  )
);
