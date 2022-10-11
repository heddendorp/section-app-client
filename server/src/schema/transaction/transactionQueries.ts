import { builder } from '../../builder';
import { dateRangeInputType, prepareSearchString } from '../helperFunctions';
import {
  Prisma,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../../generated/prisma';
import prisma from '../../client';
import TransactionWhereInput = Prisma.TransactionWhereInput;

builder.queryFields((t) => ({
  transactions: t.prismaField({
    type: ['Transaction'],
    args: {
      range: t.arg({
        type: dateRangeInputType,
      }),
      directions: t.arg({
        type: [TransactionDirection],
        defaultValue: [],
        required: true,
      }),
      types: t.arg({
        type: [TransactionType],
        defaultValue: [],
        required: true,
      }),
      status: t.arg({
        type: [TransactionStatus],
        defaultValue: [TransactionStatus.CONFIRMED],
        required: true,
      }),
      search: t.arg.string(),
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (
      query,
      parent,
      { range, search, skip, take, directions, types, status },
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
        ...(directions.length ? { direction: { in: directions } } : {}),
        createdAt: rangeQuery,
        ...(types.length ? { type: { in: types } } : {}),
        ...(status.length ? { status: { in: status } } : {}),
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
      types: t.arg({
        type: [TransactionType],
      }),
      status: t.arg({
        type: [TransactionStatus],
        defaultValue: [TransactionStatus.CONFIRMED],
      }),
      search: t.arg.string(),
    },
    resolve: (
      parent,
      { range, search, directions, types, status },
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
        ...(types ? { type: { in: types } } : {}),
        ...(status ? { status: { in: status } } : {}),
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
}));
