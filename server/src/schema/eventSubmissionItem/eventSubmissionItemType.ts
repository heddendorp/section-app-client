import { builder } from '../../builder';
import {
  PurchaseStatus,
  SubmissionItemType,
  SubmissionTime,
} from '../../generated/prisma';
import prisma from '../../client';
import { countBy, toPairs } from 'lodash';

export const eventSubmissionItemType = builder.prismaObject(
  'EventSubmissionItem',
  {
    findUnique: (eventSubmissionItem) => ({ id: eventSubmissionItem.id }),
    fields: (t) => ({
      id: t.exposeID('id'),
      createdAt: t.expose('createdAt', { type: 'DateTime' }),
      event: t.relation('event'),
      eventId: t.exposeID('eventId', { nullable: true }),
      name: t.exposeString('name'),
      required: t.exposeBoolean('required'),
      submissionTime: t.expose('submissionTime', { type: SubmissionTime }),
      type: t.exposeString('type'),
      instruction: t.exposeString('instruction'),
      data: t.expose('data', { type: 'JSON', nullable: true }),
      submissions: t.relation('submissions'),
      ownSubmissions: t.relation('submissions', {
        args: {
          onlyOwn: t.arg.boolean(),
        },
        query: (args, context) => ({
          ...(args.onlyOwn
            ? {
                where: {
                  registration: { user: { id: context.user?.id ?? '' } },
                },
              }
            : {}),
        }),
      }),
      responses: t.field({
        type: 'JSON',
        args: { onlyWithPurchase: t.arg.boolean({ defaultValue: false }) },
        resolve: async (source, args, context, info) => {
          return prisma.eventSubmission
            .findMany({
              where: {
                submissionItemId: source.id,
                ...(args.onlyWithPurchase
                  ? {
                      lineItem: {
                        purchase: {
                          status: {
                            not: PurchaseStatus.CANCELLED,
                          },
                        },
                      },
                    }
                  : {}),
              },
            })
            .then((submissions) =>
              toPairs(
                // TODO: design an actual type for this
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                countBy(submissions.map((submission) => submission.data.value))
              ).map(([value, count]) => ({ value, count }))
            );
        },
      }),
    }),
  }
);

export const createSubmissionItemInputType = builder.inputType(
  'CreateSubmissionItemInput',
  {
    fields: (t) => ({
      required: t.boolean({ required: true }),
      submissionTime: t.field({ type: SubmissionTime, required: true }),
      type: t.field({ required: true, type: SubmissionItemType }),
      name: t.string({ required: true }),
      instruction: t.string({ required: true }),
      data: t.field({ type: 'JSON', required: true }),
    }),
  }
);
