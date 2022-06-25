import { builder } from '../../builder';

export const receiptType = builder.prismaObject('Receipt', {
  findUnique: (receipt) => ({ id: receipt.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    user: t.relation('user'),
    userId: t.exposeID('userId'),
    costItem: t.relation('costItem'),
    costItemId: t.exposeID('costItemId'),
    amount: t.expose('amount', { type: 'Decimal' }),
    container: t.exposeString('container'),
    blob: t.exposeString('blob'),
    preview: t.exposeString('preview', { nullable: true }),
    type: t.exposeString('type', { nullable: true }),
    md5: t.exposeString('md5', { nullable: true }),
    url: t.string({
      resolve: (receipt) =>
        `https://storetumi.blob.core.windows.net/tumi/${encodeURIComponent(
          receipt.container
        )}/${encodeURIComponent(receipt.blob)}`,
    }),
    originalUrl: t.string({
      resolve: (receipt) =>
        `/storage/tumi/${encodeURIComponent(
          receipt.container
        )}/${encodeURIComponent(receipt.blob)}`,
    }),
  }),
});

export const createReceiptInputType = builder.inputType('CreateReceiptInput', {
  fields: (t) => ({
    costItemId: t.id({ required: true }),
    amount: t.field({ type: 'Decimal', required: true }),
    container: t.string({ required: true }),
    blob: t.string({ required: true }),
    type: t.string({ required: true }),
    md5: t.string({ required: true }),
  }),
});
