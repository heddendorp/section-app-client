import jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import { PrismaClient, User } from '@prisma/client';

// UiAuthorization middleware. When used, the
// Access Token must exist and be verified against
// the UiAuth0 JSON Web Key Set
export const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://tumi.eu.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: 'esn.events',
  issuer: [`https://tumi.eu.auth0.com/`],
  algorithms: ['RS256'],
  credentialsRequired: false,
  property: 'token',
});

export const getUser =
  (prisma: PrismaClient) =>
  (req: Express.Request, res: Express.Response, next: () => void) => {
    if (!req.token) {
      return next();
    }
    delete req.user;
    prisma.user
      .findUnique({
        where: {
          authId: req.token.sub,
        },
      })
      .then((user: User | null) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      });
  };
