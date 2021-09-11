import { objectType } from 'nexus';
import { PhotoShare } from 'nexus-prisma';

export const photoShare = objectType({
  name: PhotoShare.$name,
  description: PhotoShare.$description,
  definition(t) {
    t.field(PhotoShare.id);
    t.field(PhotoShare.createdAt);
    t.field(PhotoShare.event);
    t.field(PhotoShare.eventId);
  },
});
