import { builder } from '../../builder';
import prisma from '../../client';
import { createUserInputType, updateUserInputType } from './userType';
import { removeEmpty } from '../helperFunctions';
import { BlobServiceClient } from '@azure/storage-blob';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import sharp from 'sharp';

const key = process.env.VISION_KEY;
const computerVisionClient = new ComputerVisionClient(
  // @ts-ignore
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
  'https://tumi-vision.cognitiveservices.azure.com/'
);

builder.mutationFields((t) => ({
  createUser: t.prismaField({
    authScopes: {
      authenticated: true,
    },
    type: 'User',
    args: {
      input: t.arg({ required: true, type: createUserInputType }),
    },
    resolve: async (query, root, { input }, context) => {
      const { email, email_verified, picture } = await context.auth0.getProfile(
        context.req.headers['authorization'] ?? ''
      );

      input.phone = input.phone?.replaceAll(' ', '');
      return prisma.user.upsert({
        ...query,
        where: {
          authId: context.token?.sub ?? '',
        },
        update: {
          email,
          email_verified,
          ...input,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
        },
        create: {
          ...input,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          authId: context.token?.sub ?? '',
          email,
          email_verified,
          picture,
          tenants: {
            create: {
              tenant: {
                connect: {
                  id: context.tenant.id,
                },
              },
            },
          },
        },
      });
    },
  }),
  updateUser: t.prismaField({
    type: 'User',
    args: {
      userId: t.arg.id({ required: true }),
      input: t.arg({ type: updateUserInputType, required: true }),
    },
    resolve: async (query, root, { userId, input }, context) => {
      return prisma.user.update({
        ...query,
        where: { id: userId },
        data: removeEmpty(input),
      });
    },
  }),
  updateUserPosition: t.prismaField({
    type: 'User',
    args: {
      userId: t.arg.id({ required: true }),
      position: t.arg.string(),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.user.update({
        ...query,
        where: { id: args.userId },
        data: { position: args.position },
      }),
  }),
  updateUserPicture: t.prismaField({
    type: 'User',
    args: {
      userId: t.arg.id({ required: true }),
      file: t.arg.string({ required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      const container = args.userId;
      const blob = args.file;
      const client = BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient(`tumi-profile/${container}`)
        .getBlockBlobClient(blob);
      const processedClient = BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient(`tumi-profile/${container}`)
        .getBlockBlobClient(blob + '-cropped');
      const properties = await client.getProperties();
      const blobResponse = await client.downloadToBuffer();
      try {
        const processedImage = sharp(blobResponse);
        const { data, info } = await processedImage
          .rotate()
          .jpeg()
          .toBuffer({ resolveWithObject: true });
        const image = await computerVisionClient.generateThumbnailInStream(
          450,
          450,
          data,
          { smartCropping: true }
        );
        const chunks: any[] = [];
        const thumbnailStream = image.readableStreamBody;
        if (!thumbnailStream) {
          throw new Error('No thumbnail stream');
        }
        thumbnailStream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        try {
          const buffer = await new Promise<Buffer>((resolve, reject) => {
            thumbnailStream.on('end', () => {
              resolve(Buffer.concat(chunks));
            });
            thumbnailStream.on('error', (err) => {
              reject(err);
            });
          });
          await processedClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: properties.contentType },
          });
          return prisma.user.update({
            ...query,
            where: { id: args.userId },
            data: {
              picture: `/storage/tumi-profile/${encodeURIComponent(
                container
              )}/${encodeURIComponent(blob)}-cropped`,
            },
          });
        } catch (err) {
          console.error(err);
        }
      } catch (error) {
        console.error(error);
      }
      return prisma.user.update({
        ...query,
        where: { id: args.userId },
        data: {
          picture: `/storage/tumi-profile/${encodeURIComponent(
            container
          )}/${encodeURIComponent(blob)}`,
        },
      });
    },
  }),
  updateESNCard: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.id({ required: true }),
      esnCardOverride: t.arg.boolean({ required: true }),
    },
    resolve: async (query, parent, args, context, info) =>
      prisma.user.update({
        ...query,
        where: { id: args.id },
        data: { esnCardOverride: args.esnCardOverride },
      }),
  }),
}));
