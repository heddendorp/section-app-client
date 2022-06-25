import { builder } from '../../builder';

export const productImageType = builder.prismaObject('ProductImage', {
  findUnique: (productImage) => ({
    id: productImage.id,
  }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    product: t.relation('product'),
    productId: t.exposeID('productId'),
    container: t.exposeString('container'),
    originalBlob: t.exposeString('originalBlob'),
    previewBlob: t.exposeString('previewBlob', { nullable: true }),
    creatorId: t.exposeID('creatorId'),
    creator: t.relation('creator'),
    src: t.string({
      resolve: (source) => {
        const lastDot = source.originalBlob.lastIndexOf('.');
        return `/storage/tumi-products/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(
          `${source.originalBlob.substr(0, lastDot)}-preview.jpg`
        )}`;
      },
    }),
    original: t.string({
      resolve: (source) =>
        `/storage/tumi-products/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.originalBlob)}`,
    }),
  }),
});
