import { fromBuffer } from 'pdf2pic';
import { Buffer } from 'buffer';
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import 'tslib';
import * as appInsights from 'applicationinsights';

appInsights.setup();
const client = appInsights.defaultClient;

export const run = (context, inputBlob) => {
  const operationIdOverride = {
    'ai.operation.id': context.traceContext.traceparent,
  };
  client.trackEvent({
    name: 'begin pdf conversion',
    tagOverrides: operationIdOverride,
    properties: { length: inputBlob.length },
  });
  // context.log(inputBlob);
  context.log(context);
  console.log(context);
  fromBuffer(inputBlob)(1, true).then((response) => {
    const res = response as ToBase64Response;
    context.log(response);
    console.log(response);
    client.trackEvent({
      name: 'pdf converted',
      tagOverrides: operationIdOverride,
      properties: { ...response },
    });
    const imageBuffer = decodeBase64Image(res.base64);
    console.log(imageBuffer);
    context.bindings.imageBlob = imageBuffer.data;
    client.trackEvent({
      name: 'buffer sent',
      tagOverrides: operationIdOverride,
      properties: { type: imageBuffer.type, length: imageBuffer.data.length },
    });
    context.done();
  });
};

function decodeBase64Image(dataString: string) {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = { type: undefined, data: undefined };

  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}
