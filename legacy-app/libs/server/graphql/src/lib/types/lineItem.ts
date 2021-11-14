import { objectType } from 'nexus';
import { LineItem } from 'nexus-prisma';

export const lineItemType = objectType({
  name: LineItem.$name,
  definition(t) {
    t.field(LineItem.id);
  },
});
