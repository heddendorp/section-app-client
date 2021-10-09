import { fromBuffer } from 'pdf2pic';
import { Buffer } from 'buffer';
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';

module.exports = async (context, inputBlob) => {
  const response = (await fromBuffer(inputBlob)(1, true)) as ToBase64Response;
  context.bindings.imageBlob = Buffer.from(response.base64, 'base64');
};
