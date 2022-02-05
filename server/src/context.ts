import { PrismaClient, Tenant, User, UsersOfTenants } from '@prisma/client';
import { Auth0 } from './helpers/auth0';

const prisma = new PrismaClient();

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

export async function createContext(req: any) {
  const tenant = await prisma.tenant.findFirst();
  return {
    ...req,
    prisma,
    user: req.user,
    token: req.token,
    auth0: new Auth0(),
    tenant: tenant,
    assignment: req.user
      ? await prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: {
              userId: req.user.id,
              tenantId: tenant?.id ?? '',
            },
          },
        })
      : undefined,
  };
}
