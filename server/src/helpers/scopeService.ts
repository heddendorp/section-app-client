import { MembershipStatus } from '../generated/prisma';
import { Context } from '../builder';
import CacheService from './cacheService';

class ScopeService {
  public async getScopesForUser(
    userId: string,
    context: Context
  ): Promise<string[]> {
    const scopes: string[] = [];
    if (context.user?.id === userId) {
      scopes.push('ownProfile');
    }
    const membershipStatus = await CacheService.getUserMembershipStatus(
      userId,
      context
    );
    if (membershipStatus !== MembershipStatus.NONE) {
      scopes.push('memberProfile');
    }
    return scopes;
  }
}

const scopeService = new ScopeService();
export default scopeService;
