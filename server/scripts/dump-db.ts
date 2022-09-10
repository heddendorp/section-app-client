import * as jetpack from 'fs-jetpack';
import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  rejectOnNotFound: true,
});

const storageFolder = jetpack.dir('storage', { empty: true });

async function main() {
  const tenant = await prisma.tenant.findMany();
  const user = await prisma.user.findMany();
  const invite = await prisma.invite.findMany();
  const stripeUserData = await prisma.stripeUserData.findMany();
  const shoppingCart = await prisma.shoppingCart.findMany();
  const stripePayment = await prisma.stripePayment.findMany();
  const transaction = await prisma.transaction.findMany();
  const richTransaction = await prisma.transaction.findMany({
    include: {
      stripePayment: true,
      purchase: true,
      eventRegistration: true,
      eventRegistrationCode: true,
      costItem: true,
    },
  });
  const refundedRegistration = await prisma.refundedRegistration.findMany();
  const usersOfTenants = await prisma.usersOfTenants.findMany();
  const eventOrganizer = await prisma.eventOrganizer.findMany();
  const eventTemplate = await prisma.eventTemplate.findMany();
  const eventTemplateCategory = await prisma.eventTemplateCategory.findMany();
  const tumiEvent = await prisma.tumiEvent.findMany();
  const product = await prisma.product.findMany();
  const productImage = await prisma.productImage.findMany();
  const purchase = await prisma.purchase.findMany();
  const lineItem = await prisma.lineItem.findMany();
  const costItem = await prisma.costItem.findMany();
  const receipt = await prisma.receipt.findMany();
  const photoShare = await prisma.photoShare.findMany();
  const eventRegistration = await prisma.eventRegistration.findMany();
  const eventRegistrationCode = await prisma.eventRegistrationCode.findMany();
  const eventSubmissionItem = await prisma.eventSubmissionItem.findMany();
  const eventSubmission = await prisma.eventSubmission.findMany();
  const activityLog = await prisma.activityLog.findMany();

  storageFolder.write('tenant.json', tenant);
  storageFolder.write('user.json', user);
  storageFolder.write('invite.json', invite);
  storageFolder.write('stripeUserData.json', stripeUserData);
  storageFolder.write('shoppingCart.json', shoppingCart);
  storageFolder.write('stripePayment.json', stripePayment);
  storageFolder.write('transaction.json', transaction);
  storageFolder.write('richTransaction.json', richTransaction);
  storageFolder.write('refundedRegistration.json', refundedRegistration);
  storageFolder.write('usersOfTenants.json', usersOfTenants);
  storageFolder.write('eventOrganizer.json', eventOrganizer);
  storageFolder.write('eventTemplate.json', eventTemplate);
  storageFolder.write('eventTemplateCategory.json', eventTemplateCategory);
  storageFolder.write('tumiEvent.json', tumiEvent);
  storageFolder.write('product.json', product);
  storageFolder.write('productImage.json', productImage);
  storageFolder.write('purchase.json', purchase);
  storageFolder.write('lineItem.json', lineItem);
  storageFolder.write('costItem.json', costItem);
  storageFolder.write('receipt.json', receipt);
  storageFolder.write('photoShare.json', photoShare);
  storageFolder.write('eventRegistration.json', eventRegistration);
  storageFolder.write('eventRegistrationCode.json', eventRegistrationCode);
  storageFolder.write('eventSubmissionItem.json', eventSubmissionItem);
  storageFolder.write('eventSubmission.json', eventSubmission);
  storageFolder.write('activityLog.json', activityLog);

  console.log('Done!');
}

main();
