import {
  arg,
  booleanArg,
  idArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { EventRegistrationCode } from '../generated/nexus-prisma';
import { RegistrationMode, Role } from '../generated/prisma';
import { RegistrationService } from '../helpers/registrationService';
import { eventRegistrationType } from './eventRegistration';
import { userType } from './user';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const eventRegistrationCodeType = objectType({
  name: EventRegistrationCode.$name,
  definition(t) {
    t.field(EventRegistrationCode.id);
    t.field(EventRegistrationCode.createdAt);
    t.field(EventRegistrationCode.createdById);
    t.field(EventRegistrationCode.registrationToRemoveId);
    t.field(EventRegistrationCode.registrationCreatedId);
    t.field(EventRegistrationCode.targetEvent);
    t.field(EventRegistrationCode.isPublic);
    t.field(EventRegistrationCode.eventId);
    t.field(EventRegistrationCode.status);
    t.field(EventRegistrationCode.sepaAllowed);
    t.field(EventRegistrationCode.connectedRegistrations);
    t.field(EventRegistrationCode.transaction);
    t.field(EventRegistrationCode.transactionId);
    t.field({
      name: 'registrationToRemove',
      type: eventRegistrationType,
      resolve: (source, args, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 10,
        //   scope: CacheScope.Public,
        // });
        if (!source.registrationToRemoveId) return null;
        return context.prisma.eventRegistration.findUnique({
          where: { id: source.registrationToRemoveId },
        });
      },
    });
    t.field({
      name: 'registrationCreated',
      type: eventRegistrationType,
      resolve: (source, args, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 10,
        //   scope: CacheScope.Public,
        // });
        if (!source.registrationCreatedId) return null;
        return context.prisma.eventRegistration.findUnique({
          where: { id: source.registrationCreatedId },
        });
      },
    });
    t.field({
      name: 'creator',
      type: nonNull(userType),
      resolve: (source, args, context) => {
        // info.cacheControl.setCacheHint({
        //   maxAge: 60,
        //   scope: CacheScope.Public,
        // });
        return context.prisma.user
          .findUnique({
            where: { id: source.createdById },
          })
          .then((res) => {
            if (!res) throw new GraphQLYogaError('User not found');
            return res;
          });
      },
    });
  },
});

export const getListQuery = queryField('eventRegistrationCodes', {
  type: nonNull(list(nonNull(eventRegistrationCodeType))),
  args: {
    includePrivate: booleanArg({ default: false }),
    includePassed: booleanArg({ default: false }),
    includeUsed: booleanArg({ default: false }),
    orderByEvent: booleanArg({ default: false }),
  },
  resolve: (
    source,
    { includePrivate, orderByEvent, includePassed, includeUsed },
    context
  ) => {
    // info.cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
    return context.prisma.eventRegistrationCode.findMany({
      where: {
        ...(includePrivate ? {} : { isPublic: true }),
        ...(includeUsed ? {} : { registrationCreatedId: null }),
        ...(includePassed
          ? {}
          : { targetEvent: { start: { gt: new Date() } } }),
      },
      orderBy: orderByEvent
        ? { targetEvent: { start: 'asc' } }
        : { createdAt: 'desc' },
    });
  },
});

export const getOneQuery = queryField('eventRegistrationCode', {
  type: eventRegistrationCodeType,
  args: { id: nonNull(idArg()) },
  resolve: (source, { id }, context) => {
    // info.cacheControl.setCacheHint({ maxAge: 10, scope: CacheScope.Public });
    return context.prisma.eventRegistrationCode.findUnique({ where: { id } });
  },
});

export const createRegistrationCodeMutation = mutationField(
  'createRegistrationCode',
  {
    type: nonNull(eventRegistrationCodeType),
    args: {
      registrationId: idArg(),
      eventId: nonNull(idArg()),
      isPublic: booleanArg({ default: false }),
      sepaAllowed: booleanArg({ default: false }),
    },
    resolve: async (
      source,
      { registrationId, eventId, isPublic, sepaAllowed },
      context
    ) => {
      const { role } = context.assignment ?? {};
      let registrationCode;
      if (sepaAllowed && role !== Role.ADMIN) {
        throw new GraphQLYogaError(
          'Only Admins can generate registration codes with SEPA payments!'
        );
      }
      if (!registrationId && role !== Role.ADMIN) {
        throw new GraphQLYogaError(
          'Only Admins can generate registration codes for new registrations!'
        );
      } else if (registrationId) {
        const registration = await context.prisma.eventRegistration.findUnique({
          where: { id: registrationId },
        });
        if (!registration) {
          throw new GraphQLYogaError(
            'Registration could not be found for id ' + registrationId
          );
        }
        registrationCode = await context.prisma.eventRegistrationCode.create({
          data: {
            registrationToRemoveId: registrationId,
            isPublic: isPublic ?? false,
            sepaAllowed: sepaAllowed ?? false,
            targetEvent: { connect: { id: eventId } },
            createdById: context.user?.id ?? '',
          },
        });
      } else {
        registrationCode = await context.prisma.eventRegistrationCode.create({
          data: {
            isPublic: isPublic ?? false,
            targetEvent: { connect: { id: eventId } },
            createdById: context.user?.id ?? '',
            sepaAllowed: sepaAllowed ?? false,
          },
        });
      }
      return registrationCode;
    },
  }
);

export const useRegistrationCodeMutation = mutationField(
  'useRegistrationCode',
  {
    type: nonNull(eventRegistrationCodeType),
    args: { id: nonNull(idArg()), price: arg({ type: 'Json' }) },
    resolve: async (source, { id, price }, context) => {
      const registrationCode =
        await context.prisma.eventRegistrationCode.findUnique({
          where: { id },
          include: { targetEvent: true },
        });
      if (!registrationCode) {
        throw new GraphQLYogaError(
          'Registration code could not be found for: ' + id
        );
      }
      if (
        registrationCode.targetEvent.registrationMode ===
        RegistrationMode.STRIPE
      ) {
        // const priceAllowed = await ValidationService.priceAllowed(
        //   price,
        //   registrationCode.targetEvent,
        //   context
        // );
        const priceAllowed = true;
        if (!priceAllowed) {
          throw new GraphQLYogaError(
            'Price received is not valid in this context'
          );
        }
      }
      const baseUrl = process.env.DEV
        ? 'http://localhost:4200/profile'
        : 'https://tumi.esn.world/profile';
      return RegistrationService.registerWithCode(
        context,
        id,
        context.user?.id ?? '',
        price,
        `${baseUrl}?cancel=true&code=${id}`,
        `${baseUrl}?success=true&code=${id}`
      );
    },
  }
);
