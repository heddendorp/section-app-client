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
    type: t.exposeString('type'),
    src: t.string({
      resolve: (source) =>
        `${
          process.env.DEV
            ? 'https://storetumi.blob.core.windows.net'
            : '/storage'
        }/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.previewBlob ?? source.originalBlob)}`,
    }),
    original: t.string({
      resolve: (source) =>
        `${
          process.env.DEV
            ? 'https://storetumi.blob.core.windows.net'
            : '/storage'
        }/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.originalBlob)}`,
    }),
  }),
});

export const createPhotoShareInputType = builder.inputType(
  'CreatePhotoShareInput',
  {
    fields: (t) => ({
      cols: t.int({ required: true }),
      rows: t.int({ required: true }),
      container: t.string({ required: true }),
      originalBlob: t.string({ required: true }),
      type: t.string({ required: true }),
    }),
  }
);
