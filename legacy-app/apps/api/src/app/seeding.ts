import {
  MembershipStatus,
  Prisma,
  PrismaClient,
  Role,
} from '@tumi/server-models';
import InputJsonArray = Prisma.InputJsonArray;

export async function seedDB(prisma: PrismaClient) {
  const tenant = await prisma.tenant.upsert({
    where: {
      shortName: 'tumi',
    },
    update: {},
    create: {
      name: 'ESN TUMi e.V.',
      shortName: 'tumi',
    },
  });
  const user = await prisma.user.upsert({
    where: {
      authId: 'google-oauth2|110521442319435018423',
    },
    update: {},
    create: {
      authId: 'google-oauth2|110521442319435018423',
      firstName: 'Lukas',
      lastName: 'Heddendorp',
      email: 'lu.heddendorp@gmail.com',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gj7il6hmD_v_33d8-8qZ6ImjudYePD52Ra20fQe3X8=s96-c',
      email_verified: true,
      birthdate: new Date('1996-10-20T22:00:00.000Z'),
      tenants: {
        create: {
          status: MembershipStatus.FULL,
          role: Role.ADMIN,
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
        },
      },
    },
  });
  await migrateEvents(prisma);
  // const events = await prisma.tumiEvent.findMany();
  // const ages = await Promise.all(
  //   events.map((event) =>
  //     prisma.user
  //       .findMany({
  //         where: { eventRegistrations: { some: { eventId: event.id } } },
  //       })
  //       .then(
  //         (users) =>
  //           users.reduce(
  //             (previousValue, currentValue) =>
  //               previousValue +
  //               DateTime.local()
  //                 .diff(DateTime.fromJSDate(currentValue.birthdate), 'years')
  //                 .toObject().years,
  //             0
  //           ) / users.length
  //       )
  //       .then((avgAge) => ({
  //         title: event.title,
  //         avgAge: Math.round(avgAge),
  //         id: event.id,
  //       }))
  //   )
  // );
  // console.log(JSON.stringify(ages));
  // const users = await prisma.user.findMany({
  //   where: { calendarToken: null },
  //   // take: 50,
  // });
  // for (const user of users) {
  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: { calendarToken: randomUUID() },
  //   });
  // }
  // await prisma.user.updateMany({
  //   where: { calendarToken: null },
  //   data: { calendarToken: undefined },
  // });
  // await transferEvents(prisma, tenant);
}

async function migrateEvents(prisma: PrismaClient) {
  const eventsWithPrice = await prisma.tumiEvent.findMany({
    where: { price: { not: null } },
  });
  for (const event of eventsWithPrice) {
    const defaultPrice = {
      defaultPrice: true,
      allowedStatusList: [
        MembershipStatus.NONE,
        MembershipStatus.TRIAL,
        MembershipStatus.FULL,
        MembershipStatus.SPONSOR,
        MembershipStatus.ALUMNI,
      ],
      esnCardRequired: false,
      amount: event.price.toNumber(),
    };
    const prices: InputJsonArray = [];
    prices.push(defaultPrice);
    if (event.esnDiscount) {
      prices.push({
        defaultPrice: false,
        allowedStatusList: [
          MembershipStatus.NONE,
          MembershipStatus.TRIAL,
          MembershipStatus.FULL,
          MembershipStatus.SPONSOR,
          MembershipStatus.ALUMNI,
        ],
        esnCardRequired: true,
        amount: event.discountedPrice.toNumber(),
      });
    }
    await prisma.tumiEvent.update({
      where: { id: event.id },
      data: { prices: { options: prices } },
    });
  }
}
