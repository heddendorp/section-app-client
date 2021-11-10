import {
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { ProductImage } from 'nexus-prisma';
import { ApolloError } from 'apollo-server-express';

export const productImageType = objectType({
  name: ProductImage.$name,
  description: ProductImage.$description,
  definition(t) {
    t.field(ProductImage.id);
    t.field(ProductImage.createdAt);
    t.field({
      ...ProductImage.product,
      resolve: (source, args, context) =>
        context.prisma.product.findUnique({ where: { id: source.productId } }),
    });
    t.field(ProductImage.productId);
    t.field(ProductImage.container);
    t.field(ProductImage.originalBlob);
    t.field(ProductImage.previewBlob);
    t.field(ProductImage.creatorId);
    t.field(ProductImage.type);
    t.field({
      ...ProductImage.creator,
      resolve: (source, args, context) =>
        context.prisma.user.findUnique({ where: { id: source.creatorId } }),
    });
    t.field({
      name: 'src',
      type: nonNull('String'),
      resolve: (source) => {
        const lastDot = source.originalBlob.lastIndexOf('.');
        return `/storage/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(
          `${source.originalBlob.substr(0, lastDot)}-preview.jpg`
        )}`;
      },
    });
    t.field({
      name: 'original',
      type: nonNull('String'),
      resolve: (source) =>
        `/storage/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.originalBlob)}`,
    });
  },
});

export const createProductImageInputType = inputObjectType({
  name: 'CreateProductImageInput',
  definition(t) {
    t.field(ProductImage.container);
    t.field(ProductImage.originalBlob);
    t.field(ProductImage.type);
  },
});

export const getProductImageKey = queryField('productImageKey', {
  type: nonNull('String'),
  resolve: (source, args, context) => {
    if (!context.assignment) {
      throw new ApolloError('Only logged in users may retrieve the key');
    }
    return process.env.PHOTO_SAS_TOKEN;
  },
});

// export const getPhotosQuery = queryField('photos', {
//   type: nonNull(list(nonNull(photoShare))),
//   resolve: (source, args, context) => {
//     if (!context.assignment || context.assignment.role !== 'ADMIN') {
//       throw new ApolloError('Only admins can load this list!');
//     }
//     return context.prisma.photoShare.findMany();
//   },
// });

// export const getPhotosOfEventQuery = queryField('photosOfEvent', {
//   type: nonNull(list(nonNull(photoShare))),
//   args: { id: nonNull(idArg()) },
//   resolve: (source, { id }, context) => {
//     const registrations = context.prisma.eventRegistration.count({
//       where: {
//         event: { id },
//         user: { id: context.user.id },
//         status: { not: RegistrationStatus.CANCELLED },
//       },
//     });
//     if (registrations === 0 && context.assignment.role !== Role.ADMIN) {
//       throw new ApolloError(
//         'You can only see photos of events your are registered for!'
//       );
//     }
//     return context.prisma.tumiEvent.findUnique({ where: { id } }).photoShares();
//   },
// });

export const createProductImageMutation = mutationField('createProductImage', {
  type: productImageType,
  args: {
    data: nonNull(createProductImageInputType),
    productId: nonNull(idArg()),
  },
  resolve: (source, { data, productId }, context) =>
    context.prisma.productImage.create({
      data: {
        ...data,
        creator: { connect: { id: context.user.id } },
        product: { connect: { id: productId } },
      },
    }),
});
