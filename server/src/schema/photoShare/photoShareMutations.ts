import { builder } from '../../builder';
import { createPhotoShareInputType } from './photoShareType';
import prisma from '../../client';
import { BlobServiceClient } from '@azure/storage-blob';
import sharp from 'sharp';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const key = process.env.VISION_KEY;
const computerVisionClient = new ComputerVisionClient(
  // @ts-ignore
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
  'https://tumi-vision.cognitiveservices.azure.com/'
);

builder.mutationFields((t) => ({
  createPhotoShare: t.prismaField({
    authScopes: {
      public: true,
    },
    type: 'PhotoShare',
    args: {
      input: t.arg({ required: true, type: createPhotoShareInputType }),
      eventId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, { input, eventId }, context) => {
      const container = input.container;
      const blob = input.originalBlob;
      const client = BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient(`tumi-photos/${container}`)
        .getBlockBlobClient(blob);
      const processedClient = BlobServiceClient.fromConnectionString(
        process.env.STORAGE_CONNECTION_STRING ?? ''
      )
        .getContainerClient(`tumi-photos/${container}`)
        .getBlockBlobClient(blob + '-preview');
      const properties = await client.getProperties();
      const blobResponse = await client.downloadToBuffer();
      try {
        const processedImage = sharp(blobResponse);
        const { data, info } = await processedImage
          .rotate()
          .jpeg()
          .toBuffer({ resolveWithObject: true });
        const ratio = info.width / info.height;
        const cols = ratio > 1.25 ? 2 : 1;
        const rows = ratio < 0.75 ? 2 : 1;
        const image = await computerVisionClient.generateThumbnailInStream(
          400 * cols,
          400 * rows,
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
          return prisma.photoShare.create({
            ...query,
            data: {
              ...input,
              cols,
              rows,
              previewBlob: blob + '-preview',
              event: { connect: { id: eventId } },
              creator: { connect: { id: context.user?.id } },
            },
          });
        } catch (err) {
          console.error(err);
        }
      } catch (error) {
        console.error(error);
      }
      return prisma.photoShare.create({
        ...query,
        data: {
          ...input,
          event: { connect: { id: eventId } },
          creator: { connect: { id: context.user?.id } },
        },
      });
    },
  }),
}));
