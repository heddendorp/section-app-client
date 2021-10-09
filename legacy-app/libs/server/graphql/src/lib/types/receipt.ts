import { inputObjectType, objectType } from 'nexus';
import { Receipt } from 'nexus-prisma';

export const receiptType = objectType({
  name: Receipt.$name,
  description: Receipt.$description,
  definition(t) {
    t.field(Receipt.id);
    t.field(Receipt.createdAt);
    t.field({
      ...Receipt.user,
      resolve: (source, args, context) =>
        context.prisma.user.findUnique({ where: { id: source.userId } }),
    });
    t.field(Receipt.userId);
    t.field({
      ...Receipt.costItem,
      resolve: (source, args, context) =>
        context.prisma.costItem.findUnique({
          where: { id: source.costItemId },
        }),
    });
    t.field(Receipt.costItemId);
    t.field(Receipt.amount);
    t.field(Receipt.container);
    t.field(Receipt.blob);
    t.field(Receipt.preview);
    t.field(Receipt.type);
    t.field(Receipt.md5);
    t.nonNull.string('url', {
      resolve: (receipt) =>
        `https://storetumi.blob.core.windows.net/tumi/${encodeURIComponent(
          receipt.container
        )}/${encodeURIComponent(receipt.blob)}`,
    });
  },
});

export const createReceiptInputType = inputObjectType({
  name: 'CreateReceiptInput',
  definition(t) {
    // t.field(Receipt.costItemId);
    t.field(Receipt.amount);
    t.field(Receipt.container);
    t.field(Receipt.blob);
    t.field(Receipt.type);
    t.field(Receipt.md5);
  },
});
