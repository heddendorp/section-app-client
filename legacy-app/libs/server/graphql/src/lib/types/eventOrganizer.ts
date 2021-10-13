import {
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from 'nexus';
import { EventOrganizer } from 'nexus-prisma';
import { Role } from '@tumi/server-models';
import { ApolloError } from 'apollo-server-express';

export const organizerType = objectType({
  name: EventOrganizer.$name,
  description: EventOrganizer.$description,
  definition(t) {
    t.field(EventOrganizer.id);
    t.field(EventOrganizer.createdAt);
    t.field(EventOrganizer.tenant);
    t.field(EventOrganizer.tenantId);
    t.field(EventOrganizer.name);
    t.field(EventOrganizer.text);
    t.field(EventOrganizer.link);
    t.field(EventOrganizer.events);
  },
});

export const newOrganizerInputType = inputObjectType({
  name: 'NewOrganizerInput',
  description: 'Input to create a new Event Organizer',
  definition(t) {
    t.field(EventOrganizer.name);
    t.field(EventOrganizer.text);
    t.field(EventOrganizer.link);
  },
});

export const createOrganizerMutation = mutationField('createEventOrganizer', {
  description: 'Create a new event organizer',
  type: organizerType,
  args: {
    newOrganizerInput: nonNull(newOrganizerInputType),
  },
  resolve: (source, { newOrganizerInput }, context) => {
    const { role } = context.assignment;
    if (role !== Role.ADMIN) {
      throw new ApolloError('Only Admins can create event organizers');
    }
    return context.prisma.eventOrganizer.create({
      data: {
        ...newOrganizerInput,
        tenant: { connect: { id: context.tenant.id } },
      },
    });
  },
});

export const getEventOrganizersQuery = queryField('organizers', {
  description: 'Retrieve a list of all event organizers',
  type: nonNull(list(nonNull(organizerType))),
  resolve: (source, args, context) => context.prisma.eventOrganizer.findMany(),
});
