import {
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { User } from 'nexus-prisma';

export const userType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.authId);
    t.field(User.createdAt);
    t.field(User.firstName);
    t.field(User.lastName);
  },
});

export const createUserInputType = inputObjectType({
  name: 'CreateUserInput',
  description: 'New user input object',
  definition(t) {
    t.field(User.firstName);
    t.field(User.lastName);
  },
});

export const getById = queryField('userById', {
  type: userType,
  args: {
    id: nonNull(idArg({ description: 'ID of the user' })),
  },
  resolve: (parent, { id }, ctx) => {
    return ctx.prisma.user.findFirst({
      where: { id },
    });
  },
});

export const getCurrent = queryField('currentUser', {
  type: userType,
  description: 'Returns the logged in user if found or null',
  resolve: (source, args, context) => {
    return context.user;
  },
});

export const createUser = mutationField('registerUser', {
  type: nonNull(userType),
  description: 'Add a new user to the database',
  args: {
    userInput: createUserInputType,
  },
  resolve: (source, args, context) => {
    return context.prisma.user.create({
      data: { ...args.userInput, authId: context.token.sub },
    });
  },
});
