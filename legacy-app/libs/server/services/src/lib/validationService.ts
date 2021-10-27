import { Price } from '@tumi/shared/data-types';
import { TumiEvent } from '@tumi/server-models';
import { GetGen } from 'nexus/dist/typegenTypeHelpers';

export class ValidationService {
  public static async priceAllowed(
    price: Price,
    event: TumiEvent,
    context: GetGen<'context'>
  ): Promise<boolean> {
    if (price.defaultPrice) {
      return true;
    }
    let statusAllowed;
    let cardAllowed;
    if (price.allowedStatusList) {
      statusAllowed = price.allowedStatusList.includes(
        context.assignment.status
      );
    } else {
      statusAllowed = true;
    }
    if (price.esnCardRequired) {
      const { esnCardOverride } = await context.user;
      const purchases = await context.prisma.productPurchase.count({
        where: { userId: context.user.id, product: { isESNcard: true } },
      });
      cardAllowed = esnCardOverride || purchases > 0;
    } else {
      cardAllowed = true;
    }
    return cardAllowed && statusAllowed;
  }
}
