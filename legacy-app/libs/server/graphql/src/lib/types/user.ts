import {
  arg,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { MembershipStatus, Role, User } from 'nexus-prisma';
import { userOfTenantType } from './userOfTenant';
import { membershipStatusEnum, roleEnum } from './enums';
import { eventType } from './event';
import { RegistrationType } from '@tumi/server-models';

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
    t.field(User.iban);
    t.field(User.paypal);
    t.field(User.email_verified);
    t.field(User.email);
    t.field(User.calendarToken);
    t.field({
      name: 'currentTenant',
      type: userOfTenantType,
      resolve: (source, args, context) =>
        context.prisma.usersOfTenants.findUnique({
          where: {
            userId_tenantId: { userId: source.id, tenantId: context.tenant.id },
          },
        }),
    });
    t.field({
      name: 'organizedEvents',
      type: nonNull(list(nonNull(eventType))),
      description: 'List of events organized by the user',
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findMany({
          where: {
            registrations: {
              some: {
                user: { id: source.id },
                type: RegistrationType.ORGANIZER,
              },
            },
          },
          orderBy: { start: 'desc' },
        }),
    });

    t.field({
      name: 'participatedEvents',
      type: nonNull(list(nonNull(eventType))),
      description: 'List of events attended by the user',
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findMany({
          where: {
            registrations: {
              some: {
                user: { id: source.id },
                type: RegistrationType.PARTICIPANT,
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
    t.field(User.birthdate);
  },
});

export const updateProfileInputType = inputObjectType({
  name: 'UpdateProfileInput',
  description: 'Profile update input object',
  definition(t) {
    t.field(User.firstName);
    t.field(User.lastName);
    t.field(User.phone);
  },
});

export const updateProfileMutation = mutationField('updateProfile', {
  type: userType,
  args: { input: nonNull(updateProfileInputType) },
  resolve: (source, { input }, context) =>
    context.prisma.user.update({ where: { id: context.user.id }, data: input }),
});

export const getById = queryField('userById', {
  type: userType,
  args: {
    id: nonNull(idArg({ description: 'ID of the user' })),
  },
  resolve: (parent, { id }, ctx) => {
    return ctx.prisma.user.findUnique({
      where: { id },
    });
  },
});

export const getCurrent = queryField('currentUser', {
  type: userType,
  description: 'Returns the logged in user if found or null',
  resolve: async (source, args, context) => {
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
  },
  resolve: (source, { statusList, roleList }, context) => {
    console.log(roleList);
    console.log(statusList);
    return context.prisma.user.findMany({
      where: {
        tenants: {
          some: {
            tenantId: context.tenant.id,
            role: { in: roleList },
            status: { in: statusList },
          },
        },
      },
      orderBy: { lastName: 'asc' },
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
    if (!userId) userId = context.user.id;
    const user = await context.prisma.user.findUnique({
      where: { id: userId },
    });
    await context.auth0.verifyEmail(user.authId);
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
  resolve: (source, { userId, status }, context) =>
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
              status,
            },
          },
        },
      },
    }),
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
  description: 'Add a new user to the database',
  args: {
    userInput: createUserInputType,
  },
  resolve: async (source, args, context) => {
    const { email, email_verified, picture } = await context.auth0.getUserInfo(
      context.token.sub
    );
    return context.prisma.user.create({
      data: {
        ...args.userInput,
        authId: context.token.sub,
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
