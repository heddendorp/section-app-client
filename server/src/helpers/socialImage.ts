// import express from 'express';
// import { createCanvas, loadImage } from 'canvas';
// import { PrismaClient } from '../generated/prisma';
// import prisma from '../client';
//
// export const socialRouter = express.Router();
// socialRouter.get('/social/event/:id', async (req, res) => {
//   const { id } = req.params;
//   const event = await prisma.tumiEvent.findUnique({ where: { id } });
//
//   const [icon, style] = (event?.icon ?? '').split(':');
//   const iconURL = `https://img.icons8.com/${style ?? 'fluency'}/300/${
//     icon ?? 'cancel-2'
//   }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
//
//   const width = 1200;
//   const height = 630;
//
//   const canvas = createCanvas(width, height);
//   const context = canvas.getContext('2d');
//
//   context.fillStyle = '#fff';
//   context.fillRect(0, 0, width, height);
//
//   const image = await loadImage(iconURL);
//   context.drawImage(image, 450, 75, 300, 300);
//
//   context.textAlign = 'center';
//   context.textBaseline = 'top';
//   context.fillStyle = '#3574d4';
//
//   const text = event?.title ?? '';
//   let fontsize = 70;
//   do {
//     fontsize--;
//     context.font = `bold ${fontsize}px Oswald`;
//   } while (context.measureText(text).width > 1000);
//   // context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);
//   context.fillStyle = '#334155';
//   context.textAlign = 'left';
//   context.fillText(text, 25, height - 200);
//
//   ['#00aeef', '#7ac143', '#ec008c', '#f47b20'].forEach((color, index) => {
//     context.fillStyle = color;
//     context.fillRect(index * (width / 4), height - 120, width / 4, 15);
//   });
//
//   context.fillStyle = '#334155';
//   context.font = 'bold 30pt Oswald';
//   context.textAlign = 'center';
//   context.fillText('tumi.esn.world', 600, height - 75);
//
//   const result = canvas.toBuffer('image/png');
//   res.writeHead(200, {
//     'Content-Type': 'image/png',
//     'Content-Length': result.length,
//   });
//   res.end(result);
// });
