import { builder } from '../../builder';

export const photoShareType = builder.prismaObject('PhotoShare', {
  findUnique: (photoShare) => ({
    id: photoShare.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    event: t.relation('event'),
    eventId: t.exposeID('eventId'),
    cols: t.exposeInt('cols'),
    rows: t.exposeInt('rows'),
    container: t.exposeString('container'),
    originalBlob: t.exposeString('originalBlob'),
    previewBlob: t.exposeString('previewBlob', { nullable: true }),
    creatorId: t.exposeID('creatorId'),
    creator: t.relation('creator'),
    src: t.string({
      resolve: (source) =>
        `/storage/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.originalBlob)}`,
    }),
    original: t.string({
      resolve: (source) =>
        `/storage/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.originalBlob)}`,
    }),
  }),
});
