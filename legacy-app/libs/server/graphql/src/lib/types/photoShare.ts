import {
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { PhotoShare } from '../nexus';
import { ApolloError } from 'apollo-server-express';
import { RegistrationStatus, Role } from '@tumi/server-models';

export const photoShare = objectType({
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
    t.field(PhotoShare.type);
    t.field({
      ...PhotoShare.creator,
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

export const createPhotoShareInputType = inputObjectType({
  name: 'CreatePhotoShareInput',
  definition(t) {
    t.field(PhotoShare.cols);
    t.field(PhotoShare.rows);
    t.field(PhotoShare.container);
    t.field(PhotoShare.originalBlob);
    t.field(PhotoShare.type);
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
  type: nonNull(list(nonNull(photoShare))),
  resolve: (source, args, context) => {
    if (!context.assignment || context.assignment.role !== 'ADMIN') {
      throw new ApolloError('Only admins can load this list!');
    }
    return context.prisma.photoShare.findMany();
  },
});

export const getPhotosOfEventQuery = queryField('photosOfEvent', {
  type: nonNull(list(nonNull(photoShare))),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) => {
    const registrations = context.prisma.eventRegistration.count({
      where: {
        event: { id },
        user: { id: context.user.id },
        status: { not: RegistrationStatus.CANCELLED },
      },
    });
    if (registrations === 0 && context.assignment.role !== Role.ADMIN) {
      throw new ApolloError(
        'You can only see photos of events your are registered for!'
      );
    }
    return context.prisma.tumiEvent.findUnique({ where: { id } }).photoShares();
  },
});

export const createPhotoShareMutation = mutationField('createPhotoShare', {
  type: photoShare,
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
