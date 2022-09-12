import {
  PrismaClient,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../src/generated/prisma';
import * as jetpack from 'fs-jetpack';

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  rejectOnNotFound: true,
});

const storageFolder = jetpack.dir('storage');

async function main() {
  // Clean up DB
  await prisma.stripeUserData.deleteMany();
  await prisma.stripePayment.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.activityLog.deleteMany();
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
  await prisma.lineItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.eventSubmission.deleteMany();
  await prisma.eventSubmissionItem.deleteMany();
  await prisma.tenant.deleteMany();
  console.log('DB cleaned up');

  const tenant = storageFolder.read('tenant.json', 'jsonWithDates');
  const user = storageFolder.read('user.json', 'jsonWithDates');
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
      transactionId: undefined,
    }));
  const transaction = storageFolder.read('transaction.json', 'jsonWithDates');
  const richTransaction = storageFolder.read(
    'richTransaction.json',
    'jsonWithDates'
  ) as any[];
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
  const purchase = storageFolder
    .read('purchase.json', 'jsonWithDates')
    .map((purchase) => ({
      ...purchase,
      transactionId: undefined,
    }));
  const lineItem = storageFolder.read('lineItem.json', 'jsonWithDates');
  const costItem = storageFolder.read('costItem.json', 'jsonWithDates');
  const receipt = storageFolder.read('receipt.json', 'jsonWithDates');
  const photoShare = storageFolder.read('photoShare.json', 'jsonWithDates');
  const eventRegistration = storageFolder
    .read('eventRegistration.json', 'jsonWithDates')
    .map((registration) => ({
      ...registration,
      transactionId: undefined,
    }));
  const eventRegistrationCode = storageFolder
    .read('eventRegistrationCode.json', 'jsonWithDates')
    .map((code) => ({
      ...code,
      transactionId: undefined,
    }));
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
  // console.log(richTransaction[2300].stripePayment);
  // const trans = richTransaction.find((trans) =>
  //   trans.stripePayment?.events?.some((ev) => ev.name === 'refunded')
  // ) as any;
  // console.log('Refunded payment');
  // console.log(JSON.stringify(trans, null, 2));
  // console.log('Non-stripe payment');
  // console.log(
  //   JSON.stringify(
  //     richTransaction.find((trans) => !trans.stripePayment),
  //     null,
  //     2
  //   )
  // );
  // console.log('Cancelled payment');
  // console.log(
  //   JSON.stringify(
  //     richTransaction.find((trans) => trans.stripePayment.status == 'canceled'),
  //     null,
  //     2
  //   )
  // );
  // console.log('Pending payment');
  // console.log(
  //   JSON.stringify(
  //     richTransaction.find(
  //       (trans) => trans.stripePayment.status === 'incomplete'
  //     ),
  //     null,
  //     2
  //   )
  // );
  // console.log('failed payment');
  // console.log(
  //   JSON.stringify(
  //     richTransaction.find(
  //       (trans) => trans.stripePayment.status === 'requires_payment_method'
  //     ),
  //     null,
  //     2
  //   )
  // );
  // console.log('cancelled payment');
  // console.log(
  //   JSON.stringify(
  //     richTransaction.find(
  //       (trans) =>
  //         ![
  //           'canceled',
  //           'succeeded',
  //           'refunded',
  //           'incomplete',
  //           'requires_payment_method',
  //         ].includes(trans.stripePayment.status)
  //     ),
  //     null,
  //     2
  //   )
  // );
  const transformedTransactions = richTransaction
    .map((trans): any[] => {
      if (
        ['canceled', 'requires_payment_method'].includes(
          trans.stripePayment.status
        )
      ) {
        return [
          {
            id: trans.id,
            createdAt: trans.createdAt,
            subject: trans.subject,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.amount),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.USER_TO_TUMI,
            status: TransactionStatus.CANCELLED,
          },
        ];
      }
      if (trans.stripePayment.status == 'incomplete') {
        return [
          {
            id: trans.id,
            createdAt: trans.createdAt,
            subject: trans.subject,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.amount),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.USER_TO_TUMI,
            status: TransactionStatus.PENDING,
          },
        ];
      }
      if (trans.stripePayment.status == 'succeeded') {
        return [
          {
            id: trans.id,
            createdAt: trans.createdAt,
            subject: trans.subject,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.amount),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.USER_TO_TUMI,
            status: TransactionStatus.CONFIRMED,
          },
          {
            createdAt: new Date(
              trans.createdAt.setSeconds(trans.createdAt.getSeconds() + 10)
            ),
            subject: `Stripe fees for ${
              trans.eventRegistration?.id ?? trans.purchase?.id
            }`,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.stripePayment.feeAmount / 100),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.TUMI_TO_EXTERNAL,
            status: TransactionStatus.CONFIRMED,
          },
        ];
      }
      if (trans.stripePayment.status == 'refunded') {
        const refundDate = new Date(
          trans.stripePayment.events.find((ev) => ev.name == 'refunded').date
        );
        return [
          {
            id: trans.id,
            createdAt: trans.createdAt,
            subject: trans.subject,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.amount),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.USER_TO_TUMI,
            status: TransactionStatus.CONFIRMED,
          },
          {
            createdAt: new Date(
              trans.createdAt.setSeconds(trans.createdAt.getSeconds() + 10)
            ),
            subject: `Stripe fees for ${
              trans.eventRegistration?.id ?? trans.purchase?.id
            }`,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.stripePayment.feeAmount / 100),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.TUMI_TO_EXTERNAL,
            status: TransactionStatus.CONFIRMED,
          },
          {
            createdAt: refundDate,
            subject: `Refund for ${
              trans.eventRegistration?.id ?? trans.purchase?.id
            }`,
            tenantId: trans.tenantId,
            userId: trans.userId,
            stripePaymentId: trans.stripePayment?.id,
            type: TransactionType.STRIPE,
            creatorId: trans.creatorId,
            amount: Math.abs(trans.stripePayment.refundedAmount / 100),
            costItemId: trans.costItemId,
            purchaseId: trans.purchase?.id,
            eventRegistrationId: trans.eventRegistration?.id,
            direction: TransactionDirection.TUMI_TO_USER,
            status: TransactionStatus.CONFIRMED,
          },
        ];
      }
      return [];
    })
    .flat();
  // return;
  // await prisma.transaction.create({
  //   data: {
  //     id: trans.id,
  //     createdAt: trans.createdAt,
  //     subject: trans.subject,
  //     tenantId: trans.tenantId,
  //     userId: trans.userId,
  //     stripePaymentId: trans.stripePayment?.id,
  //     type: trans.type,
  //     creatorId: trans.creatorId,
  //     amount: Math.abs(trans.amount),
  //     costItemId: trans.costItemId,
  //     purchaseId: trans.purchase?.id,
  //     eventRegistrationId: trans.eventRegistration?.id,
  //     direction: TransactionDirection.USER_TO_TUMI,
  //     status: TransactionStatus.CONFIRMED,
  //   },
  // });

  await prisma.tenant.createMany({ data: tenant });
  await prisma.user.createMany({ data: user });
  await prisma.usersOfTenants.createMany({ data: usersOfTenants });
  await prisma.stripeUserData.createMany({ data: stripeUserData });
  await prisma.shoppingCart.createMany({ data: shoppingCart });
  await prisma.stripePayment.createMany({ data: stripePayment });
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
  await prisma.transaction.createMany({ data: transformedTransactions });
  await prisma.activityLog.createMany({ data: activityLog });

  console.log('Database restored');
}

main();
