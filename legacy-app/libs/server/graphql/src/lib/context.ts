import { PrismaClient, Tenant, User } from '@tumi/server-models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UiAuth0 } from '../../../../../apps/api/src/app/auth0';

export interface Context {
  prisma: PrismaClient;
  auth0: UiAuth0;
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
