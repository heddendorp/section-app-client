import { builder } from '../../builder';
import { dateRangeInputType, prepareSearchString } from '../helperFunctions';
import { Prisma } from '../../generated/prisma';
import TransactionWhereInput = Prisma.TransactionWhereInput;
import prisma from '../../client';

builder.queryFields((t) => ({
  transactions: t.prismaField({
    type: ['Transaction'],
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      search: t.arg.string(),
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (
      query,
      parent,
      { range, search, skip, take },
      context,
      info
    ) => {
      let rangeQuery: { gte?: Date; lte?: Date } = {};
      if (range) {
        if (range.start) {
          rangeQuery = {
            ...rangeQuery,
            gte: range.start,
          };
        }
        if (range.end) {
          rangeQuery = {
            ...rangeQuery,
            lte: range.end,
          };
        }
      }
      const where: TransactionWhereInput = {
        tenant: {
          id: context.tenant.id,
        },
        createdAt: rangeQuery,
        ...(search
          ? {
              eventRegistration: {
                event: { title: { search: prepareSearchString(search) } },
              },
            }
          : {}),
      };
      return prisma.transaction.findMany({
        ...query,
        where,
        ...(take ? { take } : {}),
        ...(skip ? { skip } : {}),
      });
    },
  }),
  transactionCount: t.int({
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      search: t.arg.string(),
    },
    resolve: (parent, { range, search }, context, info) => {
      let rangeQuery: { gte?: Date; lte?: Date } = {};
      if (range) {
        if (range.start) {
          rangeQuery = {
            ...rangeQuery,
            gte: range.start,
          };
        }
        if (range.end) {
          rangeQuery = {
            ...rangeQuery,
            lte: range.end,
          };
        }
      }
      const where: TransactionWhereInput = {
        tenant: {
          id: context.tenant.id,
        },
        createdAt: rangeQuery,
        ...(search
          ? {
              eventRegistration: {
                event: { title: { search: prepareSearchString(search) } },
              },
            }
          : {}),
      };
      return prisma.transaction.count({
        where,
      });
    },
  }),
  transactionSumAmount: t.float({
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      search: t.arg.string(),
    },
    resolve: (parent, { range, search }, context, info) => {
      let rangeQuery: { gte?: Date; lte?: Date } = {};
      if (range) {
        if (range.start) {
          rangeQuery = {
            ...rangeQuery,
            gte: range.start,
          };
        }
        if (range.end) {
          rangeQuery = {
            ...rangeQuery,
            lte: range.end,
          };
        }
      }
      const where: TransactionWhereInput = {
        tenant: {
          id: context.tenant.id,
        },
        createdAt: rangeQuery,
        ...(search
          ? {
              eventRegistration: {
                event: { title: { search: prepareSearchString(search) } },
              },
            }
          : {}),
      };
      return prisma.transaction
        .aggregate({
          where,
          _sum: { amount: true },
        })
        .then((res) => res._sum.amount?.toNumber() ?? 0);
    },
  }),
}));
