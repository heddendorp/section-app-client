import { builder } from '../../builder';
import prisma from '../../client';
import { RegistrationStatus } from '../../generated/prisma';

builder.queryFields((t) => ({
  registrations: t.prismaField({
    type: ['EventRegistration'],
    args: {
      pageIndex: t.arg.int(),
      pageLength: t.arg.int(),
      statusList: t.arg({
        type: [RegistrationStatus],
        defaultValue: [
          RegistrationStatus.PENDING,
          RegistrationStatus.SUCCESSFUL,
        ],
      }),
    },
    resolve: async (
      query,
      root,
      { statusList, pageIndex, pageLength },
      context
    ) => {
      let page = {};
      if (typeof pageIndex === 'number' && typeof pageLength === 'number') {
        page = { skip: pageIndex * pageLength, take: pageLength };
      }
      return prisma.eventRegistration.findMany({
        ...query,
        orderBy: { createdAt: 'desc' },
        where: {
          status: { in: statusList ?? undefined },
          event: { eventTemplate: { tenant: { id: context.tenant.id } } },
        },
        ...page,
      });
    },
  }),
  registration: t.prismaField({
    type: 'EventRegistration',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { id }, context) => {
      return prisma.eventRegistration.findUniqueOrThrow({
        ...query,
        where: { id },
      });
    },
  }),
  registrationCount: t.int({
    args: {
      statusList: t.arg({
        type: [RegistrationStatus],
        defaultValue: [
          RegistrationStatus.PENDING,
          RegistrationStatus.SUCCESSFUL,
        ],
      }),
    },
    resolve: async (root, { statusList }, context) => {
      return prisma.eventRegistration.count({
        where: { status: { in: statusList ?? undefined } },
      });
    },
  }),
}));
