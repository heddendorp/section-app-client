import prisma from './client';
import { RegistrationStatus, RegistrationType } from './generated/prisma';

export const prismaUtils = async () => {
  const tigers = [
    'auth0|623a026c3401300069e43cb5',
    'auth0|622f67209244a00070fb073f',
    'auth0|622de617c4b56e007161132f',
    'google-oauth2|101831927439077837389',
    'google-oauth2|114853736075053397445',
    'auth0|622ff3e1c45d1100696cb208',
    'google-oauth2|104633245358948985676',
    'auth0|622f79ef950d100068bcfb64',
    'google-oauth2|108475820037143257719',
    'auth0|62339c60251b8c006a3f71f3',
    'auth0|62301f27dc4be000684873ab',
    'auth0|622f607f976a1f00695ea95b',
    'google-oauth2|111147741093324483511',
    'google-oauth2|105175174548404725649',
    'google-oauth2|110213990778757592650',
    'auth0|6236ebaa7b7da9006bd54803',
    'google-oauth2|102078262973124727809',
    'google-oauth2|107016561389485248505',
    'google-oauth2|117611294327342328240',
    'auth0|622f7823c4b56e0071616840',
  ];
  console.log('registering users');
  await Promise.all(
    tigers.map(async (tiger) => {
      // const user = await prisma.user.findUnique({
      //   where: {
      //     authId: tiger,
      //   },
      // });
      // if (!user) {
      //   console.log(`user ${tiger} not found`);
      //   return;
      // }
      // const registration = await prisma.eventRegistration.findFirst({
      //   where: {
      //     userId: user.id,
      //     eventId: 'c5d29e6f-9f1b-4aea-a30b-dd49a7a90715',
      //   },
      // });
      // if (!registration) {
      //   await prisma.eventRegistration.create({
      //     data: {
      //       userId: user.id,
      //       eventId: 'c5d29e6f-9f1b-4aea-a30b-dd49a7a90715',
      //       status: RegistrationStatus.PENDING,
      //       type: RegistrationType.PARTICIPANT,
      //     },
      //   });
      // }
      // await prisma.eventRegistration.deleteMany({
      //   where: { user: { authId: { not: { in: tigers } } } },
      // });
      console.log(`registered`);
    })
  );
  // prisma.eventRegistration.createMany({
  //   data: tigers.map((tiger) => ({
  //     userId: tiger,
  //     type: RegistrationType.PARTICIPANT,
  //     status: RegistrationStatus.SUCCESSFUL,
  //     eventId: 'c5d29e6f-9f1b-4aea-a30b-dd49a7a90715',
  //   })),
  // });
  console.log('done');
};
