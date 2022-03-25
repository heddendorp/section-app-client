import { PrismaClient, Tenant, User, UsersOfTenants } from './generated/prisma';
import { Auth0 } from './helpers/auth0';

export interface Context {
  prisma: PrismaClient;
  req: any; // HTTP request carrying the `Authorization` header
  auth0: Auth0;
  tenant: Tenant;
  user?: User;
  assignment?: UsersOfTenants;
  token?: {
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
  };
}
