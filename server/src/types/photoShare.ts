import {
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { PhotoShare } from '../generated/nexus-prisma';
import { RegistrationStatus, Role } from '../generated/prisma';
import { EnvelopError } from '@envelop/core';
import {
  BlobServiceClient,
  ContainerSASPermissions,
} from '@azure/storage-blob';
import { stream2buffer } from '../helpers/fileFunctions';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const photoShare = objectType({
  name: PhotoShare.$name,
  description: PhotoShare.$description,
  definition(t) {
    t.field(PhotoShare.id);
    t.field(PhotoShare.createdAt);
    t.field({
      ...PhotoShare.event,
      resolve: (source, args, context) =>
        context.prisma.tumiEvent
          .findUnique({ where: { id: source.eventId } })
          .then((res) => {
            if (!res) {
              throw new EnvelopError('Event not found');
            }
            return res;
          }),
    });
    t.field(PhotoShare.eventId);
    t.field(PhotoShare.cols);
    t.field(PhotoShare.rows);
    t.field(PhotoShare.container);
    t.field(PhotoShare.originalBlob);
    t.field(PhotoShare.previewBlob);
    t.field(PhotoShare.creatorId);
    t.field(PhotoShare.type);
    t.field(PhotoShare.creator);
    t.field({
      name: 'src',
      type: nonNull('String'),
      resolve: (source) =>
        `/storage/tumi-photos/${encodeURIComponent(
          source.container
        )}/${encodeURIComponent(source.originalBlob)}`,
      // resolve: (source) => {
      //   const lastDot = source.originalBlob.lastIndexOf('.');
      //   return `/storage/tumi-photos/${encodeURIComponent(
      //     source.container
      //   )}/${encodeURIComponent(
      //     `${source.originalBlob.substr(0, lastDot)}-preview.jpg`
      //   )}`;
      // },
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
      throw new GraphQLYogaError('Only logged in users may retrieve the key');
    }
    return BlobServiceClient.fromConnectionString(
      process.env.STORAGE_CONNECTION_STRING ?? ''
    )
      .getContainerClient('tumi-photos')
      .generateSasUrl({
        permissions: ContainerSASPermissions.parse('c'),
        expiresOn: new Date(Date.now() + 3600 * 1000),
      });
  },
});

export const getPhotosQuery = queryField('photos', {
  type: nonNull(list(nonNull(photoShare))),
  resolve: (source, args, context) => {
    if (!context.assignment || context.assignment.role !== 'ADMIN') {
      throw new EnvelopError('Only admins can load this list!');
    }
    return context.prisma.photoShare.findMany();
  },
});

export const getPhotosOfEventQuery = queryField('photosOfEvent', {
  type: nonNull(list(nonNull(photoShare))),
  args: { id: nonNull(idArg()) },
  resolve: async (source, { id }, context) => {
    const registrations = await context.prisma.eventRegistration.count({
      where: {
        event: { id },
        user: { id: context.user?.id },
        status: { not: RegistrationStatus.CANCELLED },
      },
    });
    if (registrations === 0 && context.assignment?.role !== Role.ADMIN) {
      throw new EnvelopError(
        'You can only see photos of events your are registered for!'
      );
    }
    return context.prisma.tumiEvent.findUnique({ where: { id } }).photoShares();
  },
});

export const createPhotoShareMutation = mutationField('createPhotoShare', {
  type: photoShare,
  args: { data: nonNull(createPhotoShareInputType), eventId: nonNull(idArg()) },
  resolve: (source, { data, eventId }, context) => {
    // const blobServiceClient = BlobServiceClient.fromConnectionString(
    //   process.env['STORAGE_CONNECTION_STRING'] ?? ''
    // );
    // const containerClient = blobServiceClient.getContainerClient('tumi-photos');
    // const blockBlobClient = containerClient.getBlockBlobClient(
    //   data.container + '/' + data.originalBlob
    // );
    // const downloadBlockBlobResponse = await blockBlobClient.download();
    // if (!downloadBlockBlobResponse.readableStreamBody) {
    //   throw new Error('No readable stream body');
    // }
    // const imageBuffer = await stream2buffer(
    //   downloadBlockBlobResponse.readableStreamBody
    // );
    // if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    //   console.log(pdfBuffer);
    //   throw new Error('Invalid image');
    // }
    // TODO: create image thumbnails
    return context.prisma.photoShare.create({
      data: {
        ...data,
        creator: { connect: { id: context.user?.id } },
        event: { connect: { id: eventId } },
      },
    });
  },
});
