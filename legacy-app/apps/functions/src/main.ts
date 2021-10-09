import { fromBuffer } from 'pdf2pic';
import { Buffer } from 'buffer';
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import 'tslib';

export const run = async (context, inputBlob) => {
  const response = (await fromBuffer(inputBlob)(1, true)) as ToBase64Response;
  context.log(response);
  context.bindings.imageBlob = Buffer.from(response.base64, 'base64');
  // const prisma = new PrismaClient();
};
