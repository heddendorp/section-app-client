import { objectType } from 'nexus';
import { Transaction } from '../generated/nexus-prisma';

export const transactionType = objectType({
  name: Transaction.$name,
  description: Transaction.$description,
  definition: (t) => {
    t.field(Transaction.id);
    t.field(Transaction.createdAt);
    t.field(Transaction.amount);
    t.field(Transaction.comment);
    t.field(Transaction.costItem);
    t.field(Transaction.costItemId);
    t.field(Transaction.createdBy);
    t.field(Transaction.creatorId);
    t.field(Transaction.eventRegistration);
    t.field(Transaction.isMembershipFee);
    t.field(Transaction.partner);
    t.field(Transaction.purchase);
    t.field(Transaction.stripePayment);
    t.field(Transaction.subject);
    t.field(Transaction.tenant);
    t.field(Transaction.tenantId);
    t.field(Transaction.type);
    t.field(Transaction.user);
    t.field(Transaction.userId);
  },
});
