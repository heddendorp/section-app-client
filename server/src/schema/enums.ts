import { builder } from '../builder';
import { MembershipStatus, Role } from '../generated/prisma';

builder.enumType(MembershipStatus, { name: 'MembershipStatus' });
builder.enumType(Role, { name: 'Role' });
