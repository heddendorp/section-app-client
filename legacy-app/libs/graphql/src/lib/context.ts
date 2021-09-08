import { PrismaClient, Tenant, User } from '@tumi/models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Auth0 } from '../../../../apps/api/src/app/auth0';

export interface Context {
  prisma: PrismaClient;
  auth0: Auth0;
  tenant: Tenant;
  user?: User;
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
