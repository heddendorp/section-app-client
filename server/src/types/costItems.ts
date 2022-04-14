import {
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { CostItem } from '../generated/nexus-prisma';
import { eventType } from './event';
import { createReceiptInputType } from './receipt';
import { Role } from '../generated/prisma';
import { EnvelopError } from '@envelop/core';
import { BlobServiceClient } from '@azure/storage-blob';
import { fromBuffer } from 'pdf2pic';
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import sharp from 'sharp';
import { stream2buffer } from '../helpers/fileFunctions';

export const costItemType = objectType({
  name: CostItem.$name,
  description: CostItem.$description,
  definition(t) {
    t.field(CostItem.id);
    t.field(CostItem.createdAt);
    t.field({
      ...CostItem.event,
      // resolve: (source, args, context) =>
      //   context.prisma.tumiEvent.findUnique({ where: { id: source.eventId } }),
    });
    t.field(CostItem.eventId);
    t.field(CostItem.name);
    t.field(CostItem.calculationInfo);
    t.field(CostItem.details);
    t.field(CostItem.amount);
    t.field(CostItem.actualAmount);
    t.field(CostItem.confirmed);
    t.field(CostItem.onInvoice);
    t.field(CostItem.moneySent);
    t.field(CostItem.moneySentTo);
    t.field({
      name: 'submittedAmount',
      type: nonNull('Decimal'),
      resolve: (source, args, context) =>
        context.prisma.receipt
          .aggregate({
            where: { costItem: { id: source.id } },
            _sum: { amount: true },
          })
          .then((data) => data._sum.amount ?? 0),
    });
    t.field({
      ...CostItem.receipts,
      resolve: (source, args, context) =>
        context.prisma.receipt.findMany({
          where: { costItem: { id: source.id } },
        }),
    });
  },
});

export const getCostItemsForEventQuery = queryField('costItemsForEvent', {
  type: nonNull(list(nonNull(costItemType))),
  args: { eventId: nonNull(idArg()) },
  resolve: (source, { eventId }, context) =>
    context.prisma.costItem.findMany({ where: { event: { id: eventId } } }),
});

export const getCostItemQuery = queryField('costItem', {
  type: nonNull(costItemType),
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) =>
    context.prisma.costItem.findUnique({ where: { id } }).then((res) => {
      if (!res) {
        throw new EnvelopError('Cost item not found');
      }
      return res;
    }),
});

export const getUploadKeyQuery = queryField('blobUploadKey', {
  type: nonNull('String'),
  resolve: () => process.env['BLOB_SAS_TOKEN'] ?? '',
});

export const addReceiptToCostItemMutation = mutationField(
  'addReceiptToCostItem',
  {
    type: costItemType,
    args: {
      costItemId: nonNull(idArg()),
      receiptInput: nonNull(createReceiptInputType),
    },
    resolve: async (source, { costItemId, receiptInput }, context) => {
      /*if (receiptInput.blob.includes('.pdf')) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
          process.env['STORAGE_CONNECTION_STRING'] ?? ''
        );
        const containerClient = blobServiceClient.getContainerClient('tumi');
        const blockBlobClient = containerClient.getBlockBlobClient(
          receiptInput.container + '/' + receiptInput.blob
        );
        const downloadBlockBlobResponse = await blockBlobClient.download();
        if (!downloadBlockBlobResponse.readableStreamBody) {
          throw new Error('No readable stream body');
        }
        const pdfBuffer = await stream2buffer(
          downloadBlockBlobResponse.readableStreamBody
        );
        if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
          console.log(pdfBuffer);
          throw new Error('Invalid pdf');
        }
        const pdfConvert = fromBuffer(pdfBuffer, {
          width: 707,
          height: 1000,
        });
        if (!pdfConvert.bulk) {
          throw new Error('Invalid pdf conversion');
        }
        const pdfResponse = (await pdfConvert.bulk(
          -1,
          true
        )) as ToBase64Response[];
        const image = await sharp({
          create: {
            width: 707,
            height: 1000 * pdfResponse.length,
            channels: 3,
            background: 'white',
          },
        })
          .composite(
            pdfResponse.map(({ base64 }, index) => ({
              input: Buffer.from(base64 ?? '', 'base64'),
              top: index * 1000,
              left: 0,
            }))
          )
          .png()
          .toBuffer();
        const resultBlockBlobClient = containerClient.getBlockBlobClient(
          receiptInput.container +
            '/' +
            receiptInput.blob.replace(/\.pdf$/, '.png')
        );
        await resultBlockBlobClient.upload(image, image.length);
      }*/
      return context.prisma.costItem.update({
        where: { id: costItemId },
        data: {
          receipts: {
            create: {
              ...receiptInput,
              /*preview: `${receiptInput.container}/${receiptInput.blob.replace(
                /\.pdf$/,
                '.png'
              )}`,*/
              user: { connect: { id: context.user?.id } },
            },
          },
        },
      });
    },
  }
);

export const deleteReceiptMutation = mutationField('deleteReceipt', {
  type: nonNull(costItemType),
  args: { costItemId: nonNull(idArg()), receiptId: nonNull(idArg()) },
  resolve: async (source, { costItemId, receiptId }, context) => {
    const { role } = context.assignment ?? {};
    const receipt = await context.prisma.receipt.findUnique({
      where: { id: receiptId },
    });
    if (role !== Role.ADMIN && receipt?.userId !== context.user?.id) {
      throw new EnvelopError(
        'Only Admins can delete receipts not added by them.'
      );
    }
    return context.prisma.costItem.update({
      where: { id: costItemId },
      data: { receipts: { delete: { id: receiptId } } },
    });
  },
});

export const deleteCostItemMutation = mutationField('deleteCostItem', {
  type: nonNull(eventType),
  args: { id: nonNull(idArg()) },
  resolve: async (source, { id }, context) => {
    const { role } = context.assignment ?? {};
    if (role !== Role.ADMIN) {
      throw new EnvelopError('Only Admins can delete cost items');
    }
    const item = await context.prisma.costItem.delete({ where: { id } });
    return context.prisma.tumiEvent
      .findUnique({ where: { id: item.eventId } })
      .then((res) => {
        if (!res) {
          throw new EnvelopError('Cost item not found');
        }
        return res;
      });
  },
});
