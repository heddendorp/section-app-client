import { PrismaClient, User } from '@tumi/models';

export interface Context {
  prisma: PrismaClient;
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
