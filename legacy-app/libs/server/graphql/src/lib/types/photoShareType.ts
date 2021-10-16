import {
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { PhotoShare } from 'nexus-prisma';
import { ApolloError } from 'apollo-server-express';

export const photoShareType = objectType({
  name: PhotoShare.$name,
  description: PhotoShare.$description,
  definition(t) {
    t.field(PhotoShare.id);
    t.field(PhotoShare.createdAt);
    t.field({
      ...PhotoShare.event,
      resolve: (source, args, context) =>
        context.prisma.tumiEvent.findUnique({ where: { id: source.eventId } }),
    });
    t.field(PhotoShare.eventId);
    t.field(PhotoShare.cols);
    t.field(PhotoShare.rows);
    t.field(PhotoShare.container);
    t.field(PhotoShare.originalBlob);
    t.field(PhotoShare.previewBlob);
    t.field(PhotoShare.creatorId);
    t.field({
      ...PhotoShare.creator,
      resolve: (source, args, context) =>
        context.prisma.user.findUnique({ where: { id: source.creatorId } }),
    });
    t.field({
      name: 'src',
      type: nonNull('String'),
      resolve: (source) => {
        const [name, type] = source.originalBlob.split('.');
        return `https://storetumi.blob.core.windows.net/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(`${name}-preview.jpg`)}`;
      },
    });
  },
});

export const createPhotoShareInputType = inputObjectType({
  name: 'CreatePhotoShareInput',
  definition(t) {
    t.field(PhotoShare.cols);
    t.field(PhotoShare.rows);
    t.field(PhotoShare.container);
    t.field(PhotoShare.originalBlob);
  },
});

export const getPhotoShareKey = queryField('photoShareKey', {
  type: nonNull('String'),
  resolve: (source, args, context) => {
    if (!context.assignment) {
      throw new ApolloError('Only logged in users may retrieve the key');
    }
    return process.env.PHOTO_SAS_TOKEN;
  },
});

export const getPhotosQuery = queryField('photos', {
  type: nonNull(list(nonNull(photoShareType))),
  resolve: (source, args, context) => {
    if (!context.assignment || context.assignment.role !== 'ADMIN') {
      throw new ApolloError('Only admins can load this list!');
    }
    return context.prisma.photoShare.findMany();
  },
});

export const getPhotosOfEventQuery = queryField('photosOfEvent', {
  type: nonNull(list(nonNull(photoShareType))),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.tumiEvent.findUnique({ where: { id } }).photoShares(),
});

export const createPhotoShareMutation = mutationField('createPhotoShare', {
  type: photoShareType,
  args: { data: nonNull(createPhotoShareInputType), eventId: nonNull(idArg()) },
  resolve: (source, { data, eventId }, context) =>
    context.prisma.photoShare.create({
      data: {
        ...data,
        creator: { connect: { id: context.user.id } },
        event: { connect: { id: eventId } },
      },
    }),
});
