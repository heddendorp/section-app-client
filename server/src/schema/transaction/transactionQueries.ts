import { builder } from '../../builder';
import { dateRangeInputType, prepareSearchString } from '../helperFunctions';
import {
  Prisma,
  TransactionDirection,
  TransactionStatus,
} from '../../generated/prisma';
import TransactionWhereInput = Prisma.TransactionWhereInput;
import prisma from '../../client';

builder.queryFields((t) => ({
  transactions: t.prismaField({
    type: ['Transaction'],
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      directions: t.arg({
        type: [TransactionDirection],
      }),
      search: t.arg.string(),
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (
      query,
      parent,
      { range, search, skip, take, directions },
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
        ...(directions ? { direction: { in: directions } } : {}),
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
        orderBy: { createdAt: 'desc' },
      });
    },
  }),
  transactionCount: t.int({
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      directions: t.arg({
        type: [TransactionDirection],
      }),
      search: t.arg.string(),
    },
    resolve: (parent, { range, search, directions }, context, info) => {
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
        ...(directions ? { direction: { in: directions } } : {}),
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
  transactionNetAmount: t.field({
    type: 'Decimal',
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
    },
    resolve: (parent, { range }, context, info) => {
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
      };
      return Promise.all([
        prisma.transaction.aggregate({
          where: {
            ...where,
            direction: {
              in: [
                TransactionDirection.USER_TO_TUMI,
                TransactionDirection.EXTERNAL_TO_TUMI,
              ],
            },
            status: TransactionStatus.CONFIRMED,
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            ...where,
            direction: {
              in: [
                TransactionDirection.TUMI_TO_USER,
                TransactionDirection.TUMI_TO_EXTERNAL,
              ],
            },
            status: TransactionStatus.CONFIRMED,
          },
          _sum: { amount: true },
        }),
      ])
        .then((aggregations) =>
          aggregations.map(
            (aggregation) => aggregation._sum.amount?.toNumber() ?? 0
          )
        )
        .then(
          ([incoming, outgoing]) => new Prisma.Decimal(incoming - outgoing)
        );
    },
  }),
  transactionSumAmount: t.float({
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      directions: t.arg({
        type: [TransactionDirection],
      }),
      search: t.arg.string(),
    },
    resolve: (parent, { range, search, directions }, context, info) => {
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
        ...(directions ? { direction: { in: directions } } : {}),
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
