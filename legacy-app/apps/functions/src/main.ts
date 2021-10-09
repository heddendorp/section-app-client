import { fromBuffer } from 'pdf2pic';
import { Buffer } from 'buffer';
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import 'tslib';

export const run = async (context, inputBlob) => {
  context.log(inputBlob);
  context.log(inputBlob.length);
  context.log(context);
  const response = (await fromBuffer(inputBlob)(1, true)) as ToBase64Response;
  context.log(response);
  // const prisma = new PrismaClient();
  const imageBuffer = decodeBase64Image(Buffer.from(response.base64, 'base64'));
  context.imageBlob = imageBuffer.data;
  context.done();
};

function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = { type: undefined, data: undefined };

  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}
