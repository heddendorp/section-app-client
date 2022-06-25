import {
  arg,
  booleanArg,
  idArg,
  inputObjectType,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { MembershipStatus, Role, User } from '../generated/nexus-prisma';
import { userOfTenantType } from './userOfTenant';
import { membershipStatusEnum, roleEnum } from './enums';
import { eventType } from './event';
import {
  EnrollmentStatus,
  PurchaseStatus,
  RegistrationStatus,
  RegistrationType,
} from '../generated/prisma';
import { EnvelopError } from '@envelop/core';
import { GraphQLError } from 'graphql';
import { DateTime } from 'luxon';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const userType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.authId);
    t.field(User.createdAt);
    t.field(User.firstName);
    t.field(User.lastName);
    t.field(User.birthdate);
    t.field(User.picture);
    t.field(User.phone);
    t.field(User.university);
    t.field(User.iban);
    t.field(User.paypal);
    t.field(User.email_verified);
    t.field(User.email);
    t.field(User.calendarToken);
    t.field(User.esnCardOverride);
    t.field(User.eventRegistrations);
    t.field(User.transactions);
    t.field(User.createdTransactions);
    t.field(User.enrolmentStatus);
    t.field({
      ...User.purchases,
      args: { skipCancelled: booleanArg({ default: false }) },
      resolve: (source, { skipCancelled }, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 60,
        //   scope: CacheScope.Private,
        // });
        return context.prisma.user
          .findUnique({
            where: { id: source.id },
          })
          .purchases({
            ...(skipCancelled
              ? { where: { status: { not: PurchaseStatus.CANCELLED } } }
              : {}),
          });
      },
    });
    t.nonNull.boolean('profileComplete', {
      resolve: (source) =>
        !!(
          source.firstName &&
          source.lastName &&
          source.birthdate &&
          source.picture &&
          source.university &&
          source.enrolmentStatus !== EnrollmentStatus.NONE
        ),
    });
    t.nonNull.boolean('outstandingRating', {
      resolve: async (source, args, context) => {
        const lastWeek = DateTime.local().minus({ days: 7 });
        const registrations = await context.prisma.user
          .findUnique({
            where: { id: source.id },
          })
          .eventRegistrations({
            where: {
              event: {
                end: {
                  gt: lastWeek.toJSDate(),
                  lt: new Date(),
                },
              },
              status: { not: RegistrationStatus.CANCELLED },
              rating: null,
            },
          });
        console.log(registrations);
        return registrations.length > 0;
      },
    });
    t.nonNull.boolean('hasESNcard', {
      resolve: async (source, args, context) => {
        if (source.esnCardOverride) {
          return true;
        }

        const cardBought = await context.prisma.eventRegistration.count({
          where: {
            user: { id: source.id },
            event: { title: { contains: 'ESNcard' } },
            type: RegistrationType.PARTICIPANT,
          },
        });
        return !!cardBought;
      },
    });
    t.field({
      name: 'currentTenant',
      type: nonNull(userOfTenantType),
      args: { userId: idArg() },
      resolve: (source, { userId }, context) => {
        if (!userId) {
          userId = source.id;
        }
        return context.prisma.usersOfTenants
          .findUnique({
            where: {
              userId_tenantId: { userId, tenantId: context.tenant.id },
            },
          })
          .then((res) => {
            if (!res) {
              throw new GraphQLYogaError('User not found in tenant');
            }
            return res;
          });
      },
    });
    t.field({
      name: 'organizedEvents',
      type: nonNull(list(nonNull(eventType))),
      args: { hideCancelled: booleanArg({ default: false }) },
      description: 'List of events organized by the user',
      resolve: (source, { hideCancelled }, context) =>
        context.prisma.tumiEvent.findMany({
          where: {
            registrations: {
              some: {
                user: { id: source.id },
                type: RegistrationType.ORGANIZER,
                ...(hideCancelled
                  ? { status: { not: RegistrationStatus.CANCELLED } }
                  : {}),
              },
            },
          },
          orderBy: { start: 'desc' },
        }),
    });

    t.field({
      name: 'participatedEvents',
      type: nonNull(list(nonNull(eventType))),
      args: { hideCancelled: booleanArg({ default: false }) },
      description: 'List of events attended by the user',
      resolve: (source, { hideCancelled }, context) =>
        context.prisma.tumiEvent.findMany({
          where: {
            registrations: {
              some: {
                user: { id: source.id },
                type: RegistrationType.PARTICIPANT,
                ...(hideCancelled
                  ? { status: { not: RegistrationStatus.CANCELLED } }
                  : {}),
              },
            },
          },
          orderBy: { start: 'desc' },
        }),
    });
    t.nonNull.string('fullName', {
      description: 'Concatenated name of the user',
      resolve: (root) => `${root.firstName} ${root.lastName}`,
    });
  },
});

export const createUserInputType = inputObjectType({
  name: 'CreateUserInput',
  description: 'New user input object',
  definition(t) {
    t.field(User.firstName);
    t.field(User.lastName);
    t.field(User.university);
    t.field(User.birthdate);
    t.field(User.enrolmentStatus);
    t.field(User.phone);
  },
});

export const updateProfileInputType = inputObjectType({
  name: 'UpdateProfileInput',
  description: 'Profile update input object',
  definition(t) {
    t.field(User.firstName);
    t.field(User.lastName);
    t.field(User.university);
    t.field(User.enrolmentStatus);
    t.field(User.phone);
  },
});

export const updateProfileMutation = mutationField('updateProfile', {
  type: userType,
  args: { input: nonNull(updateProfileInputType) },
  resolve: (source, { input }, context) => {
    input.phone = input.phone?.replaceAll(' ', '');
    return context.prisma.user.update({
      where: { id: context.user?.id },
      data: input,
    });
  },
});

export const updateEsnCardMutation = mutationField('updateESNcard', {
  type: userType,
  args: { esnCardOverride: nonNull(booleanArg()), id: nonNull(idArg()) },
  resolve: (source, { esnCardOverride, id }, context) => {
    if (context.assignment?.role !== 'ADMIN') {
      throw new EnvelopError('Only admins can change this setting');
    }
    return context.prisma.user.update({
      where: { id },
      data: { esnCardOverride },
    });
  },
});

export const getById = queryField('userById', {
  type: userType,
  args: {
    id: nonNull(idArg({ description: 'ID of the user' })),
  },
  resolve: (parent, { id }, ctx) => {
    if (id !== ctx.user?.id && ctx.assignment?.role !== 'ADMIN') {
      throw new EnvelopError('Only admins can read the info of users');
    }
    return ctx.prisma.user.findUnique({
      where: { id },
    });
  },
});

export const getCurrent = queryField('currentUser', {
  type: userType,
  description: 'Returns the logged in user if found or throws an error',
  resolve: async (source, args, context) => {
    if (!context.user) {
      return null;
    }
    return context.user;
  },
});

export const listUsersQuery = queryField('users', {
  type: nonNull(list(nonNull(userType))),
  description: 'returns a list of users',
  args: {
    statusList: arg({
      type: list(membershipStatusEnum),
      default: MembershipStatus.members,
    }),
    roleList: arg({ type: list(roleEnum), default: Role.members }),
    search: stringArg(),
    pageLength: intArg(),
    pageIndex: intArg(),
    onlyWithPurchase: booleanArg({ default: false }),
  },
  resolve: (
    source,
    { statusList, roleList, search, pageLength, pageIndex, onlyWithPurchase },
    context
  ) => {
    // const OR: any[] = [];
    // return context.prisma.user.count({
    //   where: {
    //     ...(search ? { OR } : {}),
    //     tenants: {
    //       some: {
    //         tenantId: context.tenant.id,
    //         // @ts-ignore
    //         role: { in: roleList },
    //         // @ts-ignore
    //         status: { in: statusList },
    //       },
    //     },
    //   },
    // });
    if (context.assignment?.role != 'ADMIN') {
      throw new EnvelopError('Only admins can read the list of users');
    }
    const OR: any[] = [];
    let page = {};
    if (typeof pageIndex === 'number' && typeof pageLength === 'number') {
      page = { skip: pageIndex * pageLength, take: pageLength };
    }
    // if (search) {
    //   OR.push({ firstName: { contains: search } });
    //   OR.push({ lastName: { contains: search } });
    //   OR.push({ email: { contains: search } });
    // }
    if (search) {
      OR.push({ firstName: { search } });
      OR.push({ lastName: { search } });
      OR.push({ email: { search } });
    }
    return context.prisma.user.findMany({
      where: {
        ...(search ? { OR } : {}),
        ...(onlyWithPurchase
          ? {
              purchases: {
                some: { status: { not: PurchaseStatus.CANCELLED } },
              },
            }
          : {}),
        tenants: {
          some: {
            tenantId: context.tenant.id,
            // @ts-ignore
            role: { in: roleList ?? [] },
            // @ts-ignore
            status: { in: statusList ?? [] },
          },
        },
      },
      orderBy: { lastName: 'asc' },
      ...page,
    });
  },
});

export const userSearchResultCountQuery = queryField('userSearchResultNum', {
  type: nonNull('Int'),
  args: {
    search: stringArg(),
    statusList: arg({
      type: list(membershipStatusEnum),
      default: MembershipStatus.members,
    }),
    roleList: arg({ type: list(roleEnum), default: Role.members }),
  },
  resolve: (source, { statusList, roleList, search }, context, info) => {
    const OR: any[] = [];
    if (search) {
      OR.push({ firstName: { search } });
      OR.push({ lastName: { search } });
      OR.push({ email: { search } });
    }
    return context.prisma.user.count({
      where: {
        ...(search ? { OR } : {}),
        tenants: {
          some: {
            tenantId: context.tenant.id,
            // @ts-ignore
            role: { in: roleList },
            // @ts-ignore
            status: { in: statusList },
          },
        },
      },
    });
  },
});

export const listUsersWithStatusQuery = queryField('userWithStatus', {
  type: nonNull(list(nonNull(userType))),
  description: 'Get all users with a status from the allowList',
  args: {
    allowList: nonNull(list(nonNull(membershipStatusEnum))),
  },
  resolve: (source, { allowList }, context) =>
    context.prisma.user.findMany({
      where: {
        tenants: {
          some: {
            tenantId: context.tenant.id,
            status: { in: allowList },
          },
        },
      },
    }),
});

export const verifyUserEmailMutation = mutationField('verifyEmail', {
  type: nonNull(userType),
  description:
    'Send a verification email to a user (to the current user if no id is provided)',
  args: { userId: idArg() },
  resolve: async (source, { userId }, context) => {
    if (!userId) userId = context.user?.id;
    const user = await context.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new EnvelopError('User not found');
    }
    // await context.auth0.verifyEmail(user.authId);
    return user;
  },
});

export const updateUserStatusMutation = mutationField('updateUserStatus', {
  type: nonNull(userType),
  description: 'Change the status of s user on the current tenant',
  args: {
    userId: nonNull(idArg()),
    status: nonNull(arg({ type: membershipStatusEnum })),
  },
  resolve: (source, { userId, status }, context) => {
    const { role } = context.assignment ?? {};
    if (role !== 'ADMIN') {
      throw new EnvelopError('Only Admins can change the status');
    }
    return context.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        tenants: {
          update: {
            where: {
              userId_tenantId: {
                userId,
                tenantId: context.tenant.id,
              },
            },
            data: {
              status,
            },
          },
        },
      },
    });
  },
});

export const updateUserRoleMutation = mutationField('updateUserRole', {
  type: nonNull(userType),
  description: 'Change the role of s user on the current tenant',
  args: {
    userId: nonNull(idArg()),
    role: nonNull(arg({ type: roleEnum })),
  },
  resolve: (source, { userId, role }, context) =>
    context.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        tenants: {
          update: {
            where: {
              userId_tenantId: {
                userId,
                tenantId: context.tenant.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
    }),
});

export const createUser = mutationField('registerUser', {
  type: nonNull(userType),
  description: 'Add a new user to the database or update existing',
  args: {
    userInput: nonNull(createUserInputType),
  },
  resolve: async (source, args, context) => {
    if (!context.token?.sub) {
      throw new Error('User not logged in');
    }
    const { email, email_verified, picture } = await context.auth0.getProfile(
      context.req.headers['authorization']
    );

    args.userInput.phone = args.userInput.phone?.replaceAll(' ', ''); // Strip spaces from phone numbers
    return context.prisma.user.upsert({
      where: {
        authId: context.token?.sub,
      },
      update: {
        email,
        email_verified,
        picture,
        ...args.userInput,
      },
      create: {
        ...args.userInput,
        authId: context.token?.sub ?? '',
        email_verified,
        picture,
        email,
        tenants: {
          create: [
            {
              tenant: {
                connect: { id: context.tenant.id },
              },
            },
          ],
        },
      },
    });
  },
});
