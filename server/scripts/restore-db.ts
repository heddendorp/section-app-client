import { PrismaClient } from '../src/generated/prisma';
import * as jetpack from 'fs-jetpack';
import { template } from 'lodash';

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  rejectOnNotFound: true,
});

const storageFolder = jetpack.dir('storage');

async function main() {
  // Clean up DB
  await prisma.invite.deleteMany();
  await prisma.stripeUserData.deleteMany();
  await prisma.stripePayment.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.eventRegistrationCode.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.costItem.deleteMany();
  await prisma.photoShare.deleteMany();
  await prisma.tumiEvent.deleteMany();
  await prisma.eventTemplate.deleteMany();
  await prisma.eventTemplateCategory.deleteMany();
  await prisma.shoppingCart.deleteMany();
  await prisma.usersOfTenants.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.user.deleteMany();
  await prisma.eventOrganizer.deleteMany();
  await prisma.refundedRegistration.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.eventSubmission.deleteMany();
  await prisma.eventSubmissionItem.deleteMany();
  await prisma.tenant.deleteMany();
  console.log('DB cleaned up');

  const tenant = storageFolder.read('tenant.json', 'jsonWithDates');
  const user = storageFolder.read('user.json', 'jsonWithDates');
  const invite = storageFolder.read('invite.json', 'jsonWithDates');
  const stripeUserData = storageFolder.read(
    'stripeUserData.json',
    'jsonWithDates'
  );
  const shoppingCart = storageFolder.read('shoppingCart.json', 'jsonWithDates');
  const stripePayment = storageFolder
    .read('stripePayment.json', 'jsonWithDates')
    .map((payment) => ({
      ...payment,
      shipping: payment.shipping ?? undefined,
    }));
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
  const eventTemplate = storageFolder
    .read('eventTemplate.json', 'jsonWithDates')
    .map((template) => ({
      ...template,
      coordinates: template.coordinates ?? undefined,
    }));
  const eventTemplateCategory = storageFolder.read(
    'eventTemplateCategory.json',
    'jsonWithDates'
  );
  const tumiEvent = storageFolder
    .read('tumiEvent.json', 'jsonWithDates')
    .map((event) => ({
      ...event,
      coordinates: event.coordinates ?? undefined,
      prices: event.prices ?? undefined,
    }));
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
  const eventSubmissionItem = storageFolder
    .read('eventSubmissionItem.json', 'jsonWithDates')
    .map((item) => ({ ...item, data: item.data ?? undefined }));
  const eventSubmission = storageFolder.read(
    'eventSubmission.json',
    'jsonWithDates'
  );
  const activityLog = storageFolder
    .read('activityLog.json', 'jsonWithDates')
    .map((log) => ({
      ...log,
      oldData: log.oldData ?? undefined,
    }));

  await prisma.tenant.createMany({ data: tenant });
  await prisma.user.createMany({ data: user });
  await prisma.invite.createMany({ data: invite });
  await prisma.usersOfTenants.createMany({ data: usersOfTenants });
  await prisma.stripeUserData.createMany({ data: stripeUserData });
  await prisma.shoppingCart.createMany({ data: shoppingCart });
  await prisma.transaction.createMany({ data: transaction });
  await prisma.stripePayment.createMany({ data: stripePayment });
  await prisma.refundedRegistration.createMany({ data: refundedRegistration });
  await prisma.eventOrganizer.createMany({ data: eventOrganizer });
  await prisma.eventTemplateCategory.createMany({
    data: eventTemplateCategory,
  });
  await prisma.eventTemplate.createMany({ data: eventTemplate });
  await prisma.tumiEvent.createMany({ data: tumiEvent });
  await prisma.product.createMany({ data: product });
  await prisma.productImage.createMany({ data: productImage });
  await prisma.purchase.createMany({ data: purchase });
  await prisma.lineItem.createMany({ data: lineItem });
  await prisma.costItem.createMany({ data: costItem });
  await prisma.receipt.createMany({ data: receipt });
  await prisma.photoShare.createMany({ data: photoShare });
  await prisma.eventRegistrationCode.createMany({
    data: eventRegistrationCode,
  });
  await prisma.eventRegistration.createMany({ data: eventRegistration });
  await prisma.eventSubmissionItem.createMany({ data: eventSubmissionItem });
  await prisma.eventSubmission.createMany({ data: eventSubmission });
  await prisma.activityLog.createMany({ data: activityLog });

  console.log('Database restored');
}

main();
