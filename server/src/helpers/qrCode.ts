import * as express from 'express';
import * as QRCode from 'qrcode';
import { PassThrough } from 'stream';

export const qrRouter = () => {
  const router = express.Router();

  router.get('/:content', async (req, res) => {
    try {
      const content = req.params.content;
      const qrStream = new PassThrough();
      await QRCode.toFileStream(qrStream, content, {
        type: 'png',
        width: 200,
        errorCorrectionLevel: 'H',
      });

      qrStream.pipe(res);
    } catch (err) {
      console.error('Failed to return content', err);
    }
  });
  return router;
};
