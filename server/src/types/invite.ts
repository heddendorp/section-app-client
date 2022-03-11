import {
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  queryType,
  stringArg,
} from 'nexus';
import { Invite } from 'nexus-prisma';
import { Invite as DBInvite } from '@prisma/client';
import { MailService } from '../helpers/mailService';
import { prisma } from '@tumi/party-animals/app/generated/prisma';

export const inviteType = objectType({
  name: Invite.$name,
  description: Invite.$description,
  definition(t) {
    t.field(Invite.id);
    t.field(Invite.createdAt);
    t.field(Invite.status);
    t.field(Invite.email);
    t.field(Invite.tenant);
    t.field(Invite.tenantId);
    t.field(Invite.creator);
    t.field(Invite.creatorId);
    t.field(Invite.redeemedAt);
    t.field(Invite.redeemedBy);
    t.field(Invite.redeemerId);
  },
});

export const listInvitesQuery = queryField('invites', {
  type: nonNull(list(nonNull(inviteType))),
  resolve: async (root, args, ctx) => {
    return ctx.prisma.invite.findMany();
  },
});

export const getInviteQuery = queryField('invite', {
  type: inviteType,
  args: {
    id: nonNull(idArg({ description: 'The ID of the invite' })),
  },
  resolve: async (root, { id }, ctx) => {
    return ctx.prisma.invite.findUnique({
      where: {
        id,
      },
    });
  },
});

export const useInviteMutation = mutationField('useInvite', {
  args: {
    id: nonNull(idArg({ description: 'The ID of the invite' })),
  },
  type: nonNull(inviteType),
  resolve: async (root, { id }, ctx) => {
    const invite = await ctx.prisma.invite.findUnique({
      where: {
        id,
      },
    });
    if (!invite) {
      throw new Error('Invite not found');
    }
    if (invite.redeemedAt) {
      throw new Error('Invite already redeemed');
    }
    await ctx.prisma.usersOfTenants.update({
      where: {
        userId_tenantId: {
          userId: ctx.user?.id ?? '',
          tenantId: invite.tenantId,
        },
      },
      data: {
        status: invite.status,
      },
    });
    return ctx.prisma.invite.update({
      where: {
        id,
      },
      data: {
        redeemedAt: new Date(),
        redeemedBy: { connect: { id: ctx.user?.id } },
      },
    });
  },
});

export const createInvitesMutation = mutationField('createInvites', {
  type: list(inviteType),
  args: {
    emails: nonNull(list(nonNull('String'))),
    status: nonNull('MembershipStatus'),
  },
  resolve: async (root, args, ctx) => {
    const invites = await Promise.all<DBInvite>(
      args.emails.map((email) =>
        ctx.prisma.invite.create({
          data: {
            creator: {
              connect: {
                id: ctx.user?.id,
              },
            },
            tenant: {
              connect: {
                id: ctx.tenant?.id,
              },
            },
            email,
            status: args.status,
          },
        })
      )
    ).catch((err) => {
      console.error(err);
      throw err;
    });
    await MailService.sendInviteMail(
      invites,
      ctx.user,
      ctx.tenant,
      `${ctx.req.protocol}://${ctx.req.hostname}${
        ctx.req.hostname == 'localhost' ? ':4200' : ''
      }/invite/`
    );
    return invites;
  },
});
