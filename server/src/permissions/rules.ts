import { rule } from 'graphql-shield';
import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../context';
import { MembershipStatus, Role, TumiEvent, User } from '../generated/prisma';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (
    parent: any,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    return !!context.token;
  }
);
export const isAdmin = rule({ cache: 'contextual' })(
  async (
    parent: any,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    return context.assignment?.role === Role.ADMIN;
  }
);
export const isMember = rule({ cache: 'contextual' })(
  async (
    parent: any,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    if (!context.assignment) return false;
    if (context.assignment.role === Role.ADMIN) return true;
    if (context.assignment.status === MembershipStatus.TRIAL) return true;
    if (context.assignment.status === MembershipStatus.FULL) return true;
    if (context.assignment.status === MembershipStatus.SPONSOR) return true;
    return false;
  }
);
export const isFullMember = rule({ cache: 'contextual' })(
  async (
    parent: any,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    if (!context.assignment) return false;
    if (context.assignment.role === Role.ADMIN) return true;
    if (context.assignment.status === MembershipStatus.FULL) return true;
    if (context.assignment.status === MembershipStatus.SPONSOR) return true;
    return false;
  }
);

export const isSelf = rule({ cache: 'strict' })(
  async (
    parent: User,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    return context.user?.id === parent.id;
  }
);
export const isEventCreator = rule({ cache: 'strict' })(
  async (
    parent: TumiEvent,
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    return context.user?.id === parent.creatorId;
  }
);
