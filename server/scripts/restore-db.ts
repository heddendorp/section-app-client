import { PrismaClient } from '../src/generated/prisma';
import * as jetpack from 'fs-jetpack';

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  rejectOnNotFound: true,
});

const storageFolder = jetpack.dir('storage');

async function main() {
  const tenant = storageFolder.read('tenant.json', 'jsonWithDates');
  const user = storageFolder.read('user.json', 'jsonWithDates');
  const invite = storageFolder.read('invite.json', 'jsonWithDates');
  const stripeUserData = storageFolder.read(
    'stripeUserData.json',
    'jsonWithDates'
  );
  const shoppingCart = storageFolder.read('shoppingCart.json', 'jsonWithDates');
  const stripePayment = storageFolder.read(
    'stripePayment.json',
    'jsonWithDates'
  );
  const transaction = storageFolder.read('transaction.json', 'jsonWithDates');
  const refundedRegistration = storageFolder.read(
    'refundedRegistration.json',
    'jsonWithDates'
  );
  const usersOfTenants = storageFolder.read(
    'usersOfTenants.json',
    'jsonWithDates'
  );
  const eventOrganizer = storageFolder.read(
    'eventOrganizer.json',
    'jsonWithDates'
  );
  const eventTemplate = storageFolder.read(
    'eventTemplate.json',
    'jsonWithDates'
  );
  const eventTemplateCategory = storageFolder.read(
    'eventTemplateCategory.json',
    'jsonWithDates'
  );
  const tumiEvent = storageFolder.read('tumiEvent.json', 'jsonWithDates');
  const product = storageFolder.read('product.json', 'jsonWithDates');
  const productImage = storageFolder.read('productImage.json', 'jsonWithDates');
  const purchase = storageFolder.read('purchase.json', 'jsonWithDates');
  const lineItem = storageFolder.read('lineItem.json', 'jsonWithDates');
  const costItem = storageFolder.read('costItem.json', 'jsonWithDates');
  const receipt = storageFolder.read('receipt.json', 'jsonWithDates');
  const photoShare = storageFolder.read('photoShare.json', 'jsonWithDates');
  const eventRegistration = storageFolder.read(
    'eventRegistration.json',
    'jsonWithDates'
  );
  const eventRegistrationCode = storageFolder.read(
    'eventRegistrationCode.json',
    'jsonWithDates'
  );
  const eventSubmissionItem = storageFolder.read(
    'eventSubmissionItem.json',
    'jsonWithDates'
  );
  const eventSubmission = storageFolder.read(
    'eventSubmission.json',
    'jsonWithDates'
  );
  const activityLog = storageFolder.read('activityLog.json', 'jsonWithDates');

  await prisma.tenant.createMany(tenant);
  await prisma.user.createMany(user);
  await prisma.invite.createMany(invite);
  await prisma.stripeUserData.createMany(stripeUserData);
  await prisma.shoppingCart.createMany(shoppingCart);
  await prisma.stripePayment.createMany(stripePayment);
  await prisma.transaction.createMany(transaction);
  await prisma.refundedRegistration.createMany(refundedRegistration);
  await prisma.usersOfTenants.createMany(usersOfTenants);
  await prisma.eventOrganizer.createMany(eventOrganizer);
  await prisma.eventTemplate.createMany(eventTemplate);
  await prisma.eventTemplateCategory.createMany(eventTemplateCategory);
  await prisma.tumiEvent.createMany(tumiEvent);
  await prisma.product.createMany(product);
  await prisma.productImage.createMany(productImage);
  await prisma.purchase.createMany(purchase);
  await prisma.lineItem.createMany(lineItem);
  await prisma.costItem.createMany(costItem);
  await prisma.receipt.createMany(receipt);
  await prisma.photoShare.createMany(photoShare);
  await prisma.eventRegistration.createMany(eventRegistration);
  await prisma.eventRegistrationCode.createMany(eventRegistrationCode);
  await prisma.eventSubmissionItem.createMany(eventSubmissionItem);
  await prisma.eventSubmission.createMany(eventSubmission);
  await prisma.activityLog.createMany(activityLog);

  console.log('Database restored');
}

main();
