import {
  enableIf,
  envelop,
  useExtendContext,
  useSchema,
  useTiming,
} from '@envelop/core';
import { schema } from './schema';
import { useHive } from '@graphql-hive/client';
import { useSentry } from '@envelop/sentry';
import { useAuth0 } from '@envelop/auth0';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { PrismaClient, Tenant, User } from './generated/prisma';
import * as Sentry from '@sentry/node';
import { useGraphQLMiddleware } from '@envelop/graphql-middleware';
import { permissions } from './permissions';

const isProd = process.env.NODE_ENV === 'production';
export const getEnveloped = envelop({
  plugins: [
    useSchema(schema),
    // useLogger(),
    enableIf(!isProd, useTiming()),
    enableIf(
      isProd,
      useHive({
        enabled: true,
        debug: process.env.NODE_ENV !== 'production', // or false
        token: process.env.HIVE_TOKEN ?? '',
        reporting: {
          // feel free to set dummy values here
          author: 'Author of the schema version',
          commit: 'git sha or any identifier',
        },
        usage: {
          clientInfo(context: any) {
            const name = context.req.headers['x-graphql-client-name'];
            const version = context.req.headers['x-graphql-client-version'];
            if (name && version) {
              return {
                name,
                version,
              };
            }
            return null;
          },
        },
      })
    ),
    enableIf(isProd, useSentry()),
    useAuth0({
      domain: 'tumi.eu.auth0.com',
      audience: 'esn.events',
      extendContextField: 'token',
    }),
    useParserCache(),
    useValidationCache(),
    useExtendContext(async (context) => {
      return {
        tenant: await context.prisma.tenant.findFirst(),
      };
    }),
    useExtendContext(async (context: { token: any; prisma: PrismaClient }) => {
      if (context.token) {
        let user = await context.prisma.user.findUnique({
          where: {
            authId: context.token.sub,
          },
        });
        if (!user) {
          user = await context.prisma.user.create({
            data: {
              authId: context.token.sub,
              email: '',
              firstName: '',
              lastName: '',
              email_verified: false,
              picture: '',
            },
          });
        }
        Sentry.setUser({ email: user.email, id: user.id });
        return {
          user,
        };
      }
    }),
    useExtendContext(
      async (context: {
        user?: User;
        prisma: PrismaClient;
        tenant: Tenant;
      }) => {
        if (context.user) {
          let assignment = await context.prisma.usersOfTenants.findUnique({
            where: {
              userId_tenantId: {
                userId: context.user.id,
                tenantId: context.tenant.id,
              },
            },
          });
          if (!assignment) {
            assignment = await context.prisma.usersOfTenants.create({
              data: {
                user: { connect: { id: context.user.id } },
                tenant: { connect: { id: context.tenant.id } },
              },
            });
          }
          return {
            assignment,
          };
        }
      }
    ),
    // useResponseCache({
    //   ttl: 2000,
    //   session: (context) => String(context.user?.id),
    // }),
    useGraphQLMiddleware([permissions]),
  ],
});
