import { builder } from '../../builder';

export const activityLogType = builder.prismaObject('ActivityLog', {
  findUnique: (activityLog) => ({ id: activityLog.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    message: t.exposeString('message'),
    data: t.expose('data', { type: 'JSON', nullable: true }),
    oldData: t.expose('oldData', { type: 'JSON', nullable: true }),
    involvedUser: t.exposeString('involvedUser', { nullable: true }),
    severity: t.exposeString('severity'),
  }),
});

export const activityLogStatType = builder.simpleObject('ActivityLogStat', {
  fields: (t) => ({
    message: t.string(),
    count: t.int(),
  }),
});
