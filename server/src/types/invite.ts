import {
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  queryType,
} from 'nexus';
import { Invite } from 'nexus-prisma';
import { Invite as DBInvite } from '@prisma/client';
import { MailService } from '../helpers/mailService';

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
  type: list(inviteType),
  resolve: async (root, args, ctx) => {
    return ctx.prisma.invite.findMany();
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
