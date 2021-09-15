
/**
 * Client
**/

import * as runtime from './runtime';

declare const prisma: unique symbol;
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Tenant
 */

export type Tenant = {
  id: string
  createdAt: Date
  name: string
  shortName: string
}

/**
 * Model User
 */

export type User = {
  id: string
  createdAt: Date
  authId: string
  firstName: string
  lastName: string
  email: string
  email_verified: boolean
  picture: string
  birthdate: Date
}

/**
 * Model UsersOfTenants
 */

export type UsersOfTenants = {
  createdAt: Date
  userId: string
  tenantId: string
  role: Role
  status: MembershipStatus
}

/**
 * Model EventOrganizer
 */

export type EventOrganizer = {
  id: string
  createdAt: Date
  tenantId: string
  name: string
  text: string
  link: string | null
}

/**
 * Model EventTemplate
 */

export type EventTemplate = {
  id: string
  createdAt: Date
  title: string
  icon: string
  description: string
  comment: string
  location: string
  locationId: string
  duration: Prisma.Decimal
  participantText: string
  participantMail: string
  organizerText: string
  finances: Prisma.JsonValue
  tenantId: string
}

/**
 * Model TumiEvent
 */

export type TumiEvent = {
  id: string
  createdAt: Date
  title: string
  icon: string
  start: Date
  end: Date
  description: string
  location: string
  locationId: string
  participantText: string
  participantMail: string
  organizerText: string
  participantLimit: number
  organizerLimit: number
  price: Prisma.Decimal | null
  registrationLink: string | null
  registrationMode: RegistrationMode
  publicationState: PublicationState
  participantSignup: MembershipStatus[]
  organizerSignup: MembershipStatus[]
  eventOrganizerId: string
  creatorId: string
  eventTemplateId: string
}

/**
 * Model CostItem
 */

export type CostItem = {
  id: string
  createdAt: Date
  eventId: string
  name: string
  ammount: Prisma.Decimal
}

/**
 * Model Receipt
 */

export type Receipt = {
  id: string
  createdAt: Date
  userId: string
  costItemId: string
  covered: boolean
  amount: number
  date: Date
  amountCovered: number
}

/**
 * Model PhotoShare
 */

export type PhotoShare = {
  id: string
  createdAt: Date
  eventId: string
}

/**
 * Model EventRegistration
 */

export type EventRegistration = {
  id: string
  createdAt: Date
  type: RegistrationType
  userId: string
  eventId: string
}

/**
 * Model EventSubmissionItem
 */

export type EventSubmissionItem = {
  id: string
  createdAt: Date
  eventId: string
  required: boolean
  submissionTime: SubmissionTime
}

/**
 * Model EventSubmission
 */

export type EventSubmission = {
  id: string
  createdAt: Date
  userId: string
  submissionItemId: string
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const MembershipStatus: {
  NONE: 'NONE',
  TRIAL: 'TRIAL',
  FULL: 'FULL',
  SPONSOR: 'SPONSOR',
  ALUMNI: 'ALUMNI'
};

export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus]


export const RegistrationMode: {
  STRIPE: 'STRIPE',
  ONLINE: 'ONLINE',
  EXTERNAL: 'EXTERNAL'
};

export type RegistrationMode = (typeof RegistrationMode)[keyof typeof RegistrationMode]


export const PublicationState: {
  DRAFT: 'DRAFT',
  APPROVAL: 'APPROVAL',
  PUBLIC: 'PUBLIC'
};

export type PublicationState = (typeof PublicationState)[keyof typeof PublicationState]


export const RegistrationType: {
  ORGANIZER: 'ORGANIZER',
  PARTICIPANT: 'PARTICIPANT',
  CALENDAR: 'CALENDAR'
};

export type RegistrationType = (typeof RegistrationType)[keyof typeof RegistrationType]


export const SubmissionTime: {
  REGISTRATION: 'REGISTRATION',
  BEFORE: 'BEFORE',
  DURING: 'DURING',
  AFTER: 'AFTER'
};

export type SubmissionTime = (typeof SubmissionTime)[keyof typeof SubmissionTime]


/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<any>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;


      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<GlobalReject>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject>;

  /**
   * `prisma.usersOfTenants`: Exposes CRUD operations for the **UsersOfTenants** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsersOfTenants
    * const usersOfTenants = await prisma.usersOfTenants.findMany()
    * ```
    */
  get usersOfTenants(): Prisma.UsersOfTenantsDelegate<GlobalReject>;

  /**
   * `prisma.eventOrganizer`: Exposes CRUD operations for the **EventOrganizer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventOrganizers
    * const eventOrganizers = await prisma.eventOrganizer.findMany()
    * ```
    */
  get eventOrganizer(): Prisma.EventOrganizerDelegate<GlobalReject>;

  /**
   * `prisma.eventTemplate`: Exposes CRUD operations for the **EventTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventTemplates
    * const eventTemplates = await prisma.eventTemplate.findMany()
    * ```
    */
  get eventTemplate(): Prisma.EventTemplateDelegate<GlobalReject>;

  /**
   * `prisma.tumiEvent`: Exposes CRUD operations for the **TumiEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TumiEvents
    * const tumiEvents = await prisma.tumiEvent.findMany()
    * ```
    */
  get tumiEvent(): Prisma.TumiEventDelegate<GlobalReject>;

  /**
   * `prisma.costItem`: Exposes CRUD operations for the **CostItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CostItems
    * const costItems = await prisma.costItem.findMany()
    * ```
    */
  get costItem(): Prisma.CostItemDelegate<GlobalReject>;

  /**
   * `prisma.receipt`: Exposes CRUD operations for the **Receipt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Receipts
    * const receipts = await prisma.receipt.findMany()
    * ```
    */
  get receipt(): Prisma.ReceiptDelegate<GlobalReject>;

  /**
   * `prisma.photoShare`: Exposes CRUD operations for the **PhotoShare** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PhotoShares
    * const photoShares = await prisma.photoShare.findMany()
    * ```
    */
  get photoShare(): Prisma.PhotoShareDelegate<GlobalReject>;

  /**
   * `prisma.eventRegistration`: Exposes CRUD operations for the **EventRegistration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventRegistrations
    * const eventRegistrations = await prisma.eventRegistration.findMany()
    * ```
    */
  get eventRegistration(): Prisma.EventRegistrationDelegate<GlobalReject>;

  /**
   * `prisma.eventSubmissionItem`: Exposes CRUD operations for the **EventSubmissionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventSubmissionItems
    * const eventSubmissionItems = await prisma.eventSubmissionItem.findMany()
    * ```
    */
  get eventSubmissionItem(): Prisma.EventSubmissionItemDelegate<GlobalReject>;

  /**
   * `prisma.eventSubmission`: Exposes CRUD operations for the **EventSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventSubmissions
    * const eventSubmissions = await prisma.eventSubmission.findMany()
    * ```
    */
  get eventSubmission(): Prisma.EventSubmissionDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;
  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;
  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  /**
   * Prisma Client JS version: 3.0.2
   * Query Engine version: 2452cc6313d52b8b9a96999ac0e974d0aedf88db
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
   */
  export type JsonObject = { [Key in string]?: JsonValue };

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue =
    | string
    | number
    | boolean
    | JsonObject
    | JsonArray
    | null;

  /**
   * Same as JsonObject, but allows undefined
   */
  export type InputJsonObject = { [Key in string]?: JsonValue };

  export interface InputJsonArray extends Array<JsonValue> {}

  export type InputJsonValue =
    | string
    | number
    | boolean
    | InputJsonObject
    | InputJsonArray;

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: 'DbNull';

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: 'JsonNull';

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: 'AnyNull';

  type SelectAndInclude = {
    select: any;
    include: any;
  };
  type HasSelect = {
    select: any;
  };
  type HasInclude = {
    include: any;
  };
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S;

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<
    infer U
  >
    ? U
    : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> =
    PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key;
  }[keyof T];

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } &
    K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
    ? False
    : T extends Date
    ? False
    : T extends Buffer
    ? False
    : T extends BigInt
    ? False
    : T extends object
    ? True
    : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Exact<A, W = unknown> = W extends unknown
    ? A extends Narrowable
      ? Cast<A, W>
      : Cast<
          { [K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never },
          { [K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K] }
        >
    : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<
    T,
    TupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(
      prisma: PrismaClient<any, any>,
      debug?: boolean,
      hooks?: Hooks | undefined
    );
    request<T>(
      document: any,
      dataPath?: string[],
      rootField?: string,
      typeName?: string,
      isList?: boolean,
      callsite?: string
    ): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(
      document: any,
      data: any,
      path: string[],
      rootField?: string,
      isList?: boolean
    ): any;
  }

  export const ModelName: {
    Tenant: 'Tenant';
    User: 'User';
    UsersOfTenants: 'UsersOfTenants';
    EventOrganizer: 'EventOrganizer';
    EventTemplate: 'EventTemplate';
    TumiEvent: 'TumiEvent';
    CostItem: 'CostItem';
    Receipt: 'Receipt';
    PhotoShare: 'PhotoShare';
    EventRegistration: 'EventRegistration';
    EventSubmissionItem: 'EventSubmissionItem';
    EventSubmission: 'EventSubmission';
  };

  export type ModelName = typeof ModelName[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  export type RejectOnNotFound = boolean | ((error: Error) => Error);
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound };
  export type RejectPerOperation = {
    [P in 'findUnique' | 'findFirst']?: RejectPerModel | RejectOnNotFound;
  };
  type IsReject<T> = T extends true
    ? True
    : T extends (err: Error) => Error
    ? True
    : False;
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends boolean
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null.
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation;
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources;

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>;
  }

  export type Hooks = {
    beforeRequest?: (options: {
      query: string;
      path: string[];
      rootField?: string;
      typeName?: string;
      document: any;
    }) => any;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T['emit'] extends 'event'
        ? T['level']
        : never
      : never;
  export type GetEvents<T extends any> = T extends Array<
    LogLevel | LogDefinition
  >
    ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count';

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>
  ) => Promise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>
  ): LogLevel | undefined;
  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number;
    eventTemplates: number;
    organizers: number;
  };

  export type TenantCountOutputTypeSelect = {
    users?: boolean;
    eventTemplates?: boolean;
    organizers?: boolean;
  };

  export type TenantCountOutputTypeGetPayload<
    S extends boolean | null | undefined | TenantCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? TenantCountOutputType
    : S extends undefined
    ? never
    : S extends TenantCountOutputTypeArgs
    ? 'include' extends U
      ? TenantCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof TenantCountOutputType
            ? TenantCountOutputType[P]
            : never;
        }
      : TenantCountOutputType
    : TenantCountOutputType;

  // Custom InputTypes

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     *
     **/
    select?: TenantCountOutputTypeSelect | null;
  };

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    tenants: number;
    eventSubmissions: number;
    eventRegistrations: number;
    receipts: number;
    createdEvents: number;
  };

  export type UserCountOutputTypeSelect = {
    tenants?: boolean;
    eventSubmissions?: boolean;
    eventRegistrations?: boolean;
    receipts?: boolean;
    createdEvents?: boolean;
  };

  export type UserCountOutputTypeGetPayload<
    S extends boolean | null | undefined | UserCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? UserCountOutputType
    : S extends undefined
    ? never
    : S extends UserCountOutputTypeArgs
    ? 'include' extends U
      ? UserCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof UserCountOutputType
            ? UserCountOutputType[P]
            : never;
        }
      : UserCountOutputType
    : UserCountOutputType;

  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     *
     **/
    select?: UserCountOutputTypeSelect | null;
  };

  /**
   * Count Type EventOrganizerCountOutputType
   */

  export type EventOrganizerCountOutputType = {
    events: number;
  };

  export type EventOrganizerCountOutputTypeSelect = {
    events?: boolean;
  };

  export type EventOrganizerCountOutputTypeGetPayload<
    S extends boolean | null | undefined | EventOrganizerCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? EventOrganizerCountOutputType
    : S extends undefined
    ? never
    : S extends EventOrganizerCountOutputTypeArgs
    ? 'include' extends U
      ? EventOrganizerCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<
            S['select']
          >]: P extends keyof EventOrganizerCountOutputType
            ? EventOrganizerCountOutputType[P]
            : never;
        }
      : EventOrganizerCountOutputType
    : EventOrganizerCountOutputType;

  // Custom InputTypes

  /**
   * EventOrganizerCountOutputType without action
   */
  export type EventOrganizerCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizerCountOutputType
     *
     **/
    select?: EventOrganizerCountOutputTypeSelect | null;
  };

  /**
   * Count Type EventTemplateCountOutputType
   */

  export type EventTemplateCountOutputType = {
    eventInstances: number;
  };

  export type EventTemplateCountOutputTypeSelect = {
    eventInstances?: boolean;
  };

  export type EventTemplateCountOutputTypeGetPayload<
    S extends boolean | null | undefined | EventTemplateCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? EventTemplateCountOutputType
    : S extends undefined
    ? never
    : S extends EventTemplateCountOutputTypeArgs
    ? 'include' extends U
      ? EventTemplateCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<
            S['select']
          >]: P extends keyof EventTemplateCountOutputType
            ? EventTemplateCountOutputType[P]
            : never;
        }
      : EventTemplateCountOutputType
    : EventTemplateCountOutputType;

  // Custom InputTypes

  /**
   * EventTemplateCountOutputType without action
   */
  export type EventTemplateCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the EventTemplateCountOutputType
     *
     **/
    select?: EventTemplateCountOutputTypeSelect | null;
  };

  /**
   * Count Type TumiEventCountOutputType
   */

  export type TumiEventCountOutputType = {
    submissionItems: number;
    registrations: number;
    costItems: number;
  };

  export type TumiEventCountOutputTypeSelect = {
    submissionItems?: boolean;
    registrations?: boolean;
    costItems?: boolean;
  };

  export type TumiEventCountOutputTypeGetPayload<
    S extends boolean | null | undefined | TumiEventCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? TumiEventCountOutputType
    : S extends undefined
    ? never
    : S extends TumiEventCountOutputTypeArgs
    ? 'include' extends U
      ? TumiEventCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof TumiEventCountOutputType
            ? TumiEventCountOutputType[P]
            : never;
        }
      : TumiEventCountOutputType
    : TumiEventCountOutputType;

  // Custom InputTypes

  /**
   * TumiEventCountOutputType without action
   */
  export type TumiEventCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the TumiEventCountOutputType
     *
     **/
    select?: TumiEventCountOutputTypeSelect | null;
  };

  /**
   * Count Type CostItemCountOutputType
   */

  export type CostItemCountOutputType = {
    receipts: number;
  };

  export type CostItemCountOutputTypeSelect = {
    receipts?: boolean;
  };

  export type CostItemCountOutputTypeGetPayload<
    S extends boolean | null | undefined | CostItemCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? CostItemCountOutputType
    : S extends undefined
    ? never
    : S extends CostItemCountOutputTypeArgs
    ? 'include' extends U
      ? CostItemCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof CostItemCountOutputType
            ? CostItemCountOutputType[P]
            : never;
        }
      : CostItemCountOutputType
    : CostItemCountOutputType;

  // Custom InputTypes

  /**
   * CostItemCountOutputType without action
   */
  export type CostItemCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the CostItemCountOutputType
     *
     **/
    select?: CostItemCountOutputTypeSelect | null;
  };

  /**
   * Count Type EventSubmissionItemCountOutputType
   */

  export type EventSubmissionItemCountOutputType = {
    submissions: number;
  };

  export type EventSubmissionItemCountOutputTypeSelect = {
    submissions?: boolean;
  };

  export type EventSubmissionItemCountOutputTypeGetPayload<
    S extends
      | boolean
      | null
      | undefined
      | EventSubmissionItemCountOutputTypeArgs,
    U = keyof S
  > = S extends true
    ? EventSubmissionItemCountOutputType
    : S extends undefined
    ? never
    : S extends EventSubmissionItemCountOutputTypeArgs
    ? 'include' extends U
      ? EventSubmissionItemCountOutputType
      : 'select' extends U
      ? {
          [P in TrueKeys<
            S['select']
          >]: P extends keyof EventSubmissionItemCountOutputType
            ? EventSubmissionItemCountOutputType[P]
            : never;
        }
      : EventSubmissionItemCountOutputType
    : EventSubmissionItemCountOutputType;

  // Custom InputTypes

  /**
   * EventSubmissionItemCountOutputType without action
   */
  export type EventSubmissionItemCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItemCountOutputType
     *
     **/
    select?: EventSubmissionItemCountOutputTypeSelect | null;
  };

  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
  };

  export type TenantMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    name: string | null;
    shortName: string | null;
  };

  export type TenantMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    name: string | null;
    shortName: string | null;
  };

  export type TenantCountAggregateOutputType = {
    id: number;
    createdAt: number;
    name: number;
    shortName: number;
    _all: number;
  };

  export type TenantMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    name?: true;
    shortName?: true;
  };

  export type TenantMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    name?: true;
    shortName?: true;
  };

  export type TenantCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    name?: true;
    shortName?: true;
    _all?: true;
  };

  export type TenantAggregateArgs = {
    /**
     * Filter which Tenant to aggregate.
     *
     **/
    where?: TenantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     *
     **/
    orderBy?: Enumerable<TenantOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: TenantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Tenants
     **/
    _count?: true | TenantCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TenantMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TenantMaxAggregateInputType;
  };

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>;
  };

  export type TenantGroupByArgs = {
    where?: TenantWhereInput;
    orderBy?: Enumerable<TenantOrderByWithAggregationInput>;
    by: Array<TenantScalarFieldEnum>;
    having?: TenantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantCountAggregateInputType | true;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
  };

  export type TenantGroupByOutputType = {
    id: string;
    createdAt: Date;
    name: string;
    shortName: string;
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
  };

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Promise<
    Array<
      PickArray<TenantGroupByOutputType, T['by']> &
        {
          [P in keyof T & keyof TenantGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>;
        }
    >
  >;

  export type TenantSelect = {
    id?: boolean;
    createdAt?: boolean;
    users?: boolean | UsersOfTenantsFindManyArgs;
    name?: boolean;
    shortName?: boolean;
    eventTemplates?: boolean | EventTemplateFindManyArgs;
    organizers?: boolean | EventOrganizerFindManyArgs;
    _count?: boolean | TenantCountOutputTypeArgs;
  };

  export type TenantInclude = {
    users?: boolean | UsersOfTenantsFindManyArgs;
    eventTemplates?: boolean | EventTemplateFindManyArgs;
    organizers?: boolean | EventOrganizerFindManyArgs;
    _count?: boolean | TenantCountOutputTypeArgs;
  };

  export type TenantGetPayload<
    S extends boolean | null | undefined | TenantArgs,
    U = keyof S
  > = S extends true
    ? Tenant
    : S extends undefined
    ? never
    : S extends TenantArgs | TenantFindManyArgs
    ? 'include' extends U
      ? Tenant &
          {
            [P in TrueKeys<S['include']>]: P extends 'users'
              ? Array<UsersOfTenantsGetPayload<S['include'][P]>>
              : P extends 'eventTemplates'
              ? Array<EventTemplateGetPayload<S['include'][P]>>
              : P extends 'organizers'
              ? Array<EventOrganizerGetPayload<S['include'][P]>>
              : P extends '_count'
              ? TenantCountOutputTypeGetPayload<S['include'][P]> | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof Tenant
            ? Tenant[P]
            : P extends 'users'
            ? Array<UsersOfTenantsGetPayload<S['select'][P]>>
            : P extends 'eventTemplates'
            ? Array<EventTemplateGetPayload<S['select'][P]>>
            : P extends 'organizers'
            ? Array<EventOrganizerGetPayload<S['select'][P]>>
            : P extends '_count'
            ? TenantCountOutputTypeGetPayload<S['select'][P]> | null
            : never;
        }
      : Tenant
    : Tenant;

  type TenantCountArgs = Merge<
    Omit<TenantFindManyArgs, 'select' | 'include'> & {
      select?: TenantCountAggregateInputType | true;
    }
  >;

  export interface TenantDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends TenantFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, TenantFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'Tenant'
    > extends True
      ? CheckSelect<
          T,
          Prisma__TenantClient<Tenant>,
          Prisma__TenantClient<TenantGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__TenantClient<Tenant | null>,
          Prisma__TenantClient<TenantGetPayload<T> | null>
        >;

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends TenantFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, TenantFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'Tenant'
    > extends True
      ? CheckSelect<
          T,
          Prisma__TenantClient<Tenant>,
          Prisma__TenantClient<TenantGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__TenantClient<Tenant | null>,
          Prisma__TenantClient<TenantGetPayload<T> | null>
        >;

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     *
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends TenantFindManyArgs>(
      args?: SelectSubset<T, TenantFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<Tenant>>,
      PrismaPromise<Array<TenantGetPayload<T>>>
    >;

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     *
     **/
    create<T extends TenantCreateArgs>(
      args: SelectSubset<T, TenantCreateArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Create many Tenants.
     *     @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     *     @example
     *     // Create many Tenants
     *     const tenant = await prisma.tenant.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends TenantCreateManyArgs>(
      args?: SelectSubset<T, TenantCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     *
     **/
    delete<T extends TenantDeleteArgs>(
      args: SelectSubset<T, TenantDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends TenantUpdateArgs>(
      args: SelectSubset<T, TenantUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends TenantDeleteManyArgs>(
      args?: SelectSubset<T, TenantDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends TenantUpdateManyArgs>(
      args: SelectSubset<T, TenantUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     **/
    upsert<T extends TenantUpsertArgs>(
      args: SelectSubset<T, TenantUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
     **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TenantAggregateArgs>(
      args: Subset<T, TenantAggregateArgs>
    ): PrismaPromise<GetTenantAggregateType<T>>;

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetTenantGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TenantClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    users<T extends UsersOfTenantsFindManyArgs = {}>(
      args?: Subset<T, UsersOfTenantsFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<UsersOfTenants>>,
      PrismaPromise<Array<UsersOfTenantsGetPayload<T>>>
    >;

    eventTemplates<T extends EventTemplateFindManyArgs = {}>(
      args?: Subset<T, EventTemplateFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventTemplate>>,
      PrismaPromise<Array<EventTemplateGetPayload<T>>>
    >;

    organizers<T extends EventOrganizerFindManyArgs = {}>(
      args?: Subset<T, EventOrganizerFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventOrganizer>>,
      PrismaPromise<Array<EventOrganizerGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Throw an Error if a Tenant can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Tenant to fetch.
     *
     **/
    where: TenantWhereUniqueInput;
  };

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Throw an Error if a Tenant can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Tenant to fetch.
     *
     **/
    where?: TenantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     *
     **/
    orderBy?: Enumerable<TenantOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tenants.
     *
     **/
    cursor?: TenantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tenants.
     *
     **/
    distinct?: Enumerable<TenantScalarFieldEnum>;
  };

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Filter, which Tenants to fetch.
     *
     **/
    where?: TenantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     *
     **/
    orderBy?: Enumerable<TenantOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Tenants.
     *
     **/
    cursor?: TenantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     *
     **/
    skip?: number;
    distinct?: Enumerable<TenantScalarFieldEnum>;
  };

  /**
   * Tenant create
   */
  export type TenantCreateArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * The data needed to create a Tenant.
     *
     **/
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>;
  };

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs = {
    data: Enumerable<TenantCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Tenant update
   */
  export type TenantUpdateArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * The data needed to update a Tenant.
     *
     **/
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>;
    /**
     * Choose, which Tenant to update.
     *
     **/
    where: TenantWhereUniqueInput;
  };

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs = {
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>;
    where?: TenantWhereInput;
  };

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * The filter to search for the Tenant to update in case it exists.
     *
     **/
    where: TenantWhereUniqueInput;
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     *
     **/
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>;
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>;
  };

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Filter which Tenant to delete.
     *
     **/
    where: TenantWhereUniqueInput;
  };

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs = {
    where?: TenantWhereInput;
  };

  /**
   * Tenant without action
   */
  export type TenantArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
  };

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    authId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    email_verified: boolean | null;
    picture: string | null;
    birthdate: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    authId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    email_verified: boolean | null;
    picture: string | null;
    birthdate: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    createdAt: number;
    authId: number;
    firstName: number;
    lastName: number;
    email: number;
    email_verified: number;
    picture: number;
    birthdate: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    authId?: true;
    firstName?: true;
    lastName?: true;
    email?: true;
    email_verified?: true;
    picture?: true;
    birthdate?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    authId?: true;
    firstName?: true;
    lastName?: true;
    email?: true;
    email_verified?: true;
    picture?: true;
    birthdate?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    authId?: true;
    firstName?: true;
    lastName?: true;
    email?: true;
    email_verified?: true;
    picture?: true;
    birthdate?: true;
    _all?: true;
  };

  export type UserAggregateArgs = {
    /**
     * Filter which User to aggregate.
     *
     **/
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     *
     **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs = {
    where?: UserWhereInput;
    orderBy?: Enumerable<UserOrderByWithAggregationInput>;
    by: Array<UserScalarFieldEnum>;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };

  export type UserGroupByOutputType = {
    id: string;
    createdAt: Date;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Promise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>;
        }
    >
  >;

  export type UserSelect = {
    id?: boolean;
    createdAt?: boolean;
    authId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    email_verified?: boolean;
    picture?: boolean;
    birthdate?: boolean;
    tenants?: boolean | UsersOfTenantsFindManyArgs;
    eventSubmissions?: boolean | EventSubmissionFindManyArgs;
    eventRegistrations?: boolean | EventRegistrationFindManyArgs;
    receipts?: boolean | ReceiptFindManyArgs;
    createdEvents?: boolean | TumiEventFindManyArgs;
    _count?: boolean | UserCountOutputTypeArgs;
  };

  export type UserInclude = {
    tenants?: boolean | UsersOfTenantsFindManyArgs;
    eventSubmissions?: boolean | EventSubmissionFindManyArgs;
    eventRegistrations?: boolean | EventRegistrationFindManyArgs;
    receipts?: boolean | ReceiptFindManyArgs;
    createdEvents?: boolean | TumiEventFindManyArgs;
    _count?: boolean | UserCountOutputTypeArgs;
  };

  export type UserGetPayload<
    S extends boolean | null | undefined | UserArgs,
    U = keyof S
  > = S extends true
    ? User
    : S extends undefined
    ? never
    : S extends UserArgs | UserFindManyArgs
    ? 'include' extends U
      ? User &
          {
            [P in TrueKeys<S['include']>]: P extends 'tenants'
              ? Array<UsersOfTenantsGetPayload<S['include'][P]>>
              : P extends 'eventSubmissions'
              ? Array<EventSubmissionGetPayload<S['include'][P]>>
              : P extends 'eventRegistrations'
              ? Array<EventRegistrationGetPayload<S['include'][P]>>
              : P extends 'receipts'
              ? Array<ReceiptGetPayload<S['include'][P]>>
              : P extends 'createdEvents'
              ? Array<TumiEventGetPayload<S['include'][P]>>
              : P extends '_count'
              ? UserCountOutputTypeGetPayload<S['include'][P]> | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof User
            ? User[P]
            : P extends 'tenants'
            ? Array<UsersOfTenantsGetPayload<S['select'][P]>>
            : P extends 'eventSubmissions'
            ? Array<EventSubmissionGetPayload<S['select'][P]>>
            : P extends 'eventRegistrations'
            ? Array<EventRegistrationGetPayload<S['select'][P]>>
            : P extends 'receipts'
            ? Array<ReceiptGetPayload<S['select'][P]>>
            : P extends 'createdEvents'
            ? Array<TumiEventGetPayload<S['select'][P]>>
            : P extends '_count'
            ? UserCountOutputTypeGetPayload<S['select'][P]> | null
            : never;
        }
      : User
    : User;

  type UserCountArgs = Merge<
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true;
    }
  >;

  export interface UserDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends UserFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, UserFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'User'
    > extends True
      ? CheckSelect<
          T,
          Prisma__UserClient<User>,
          Prisma__UserClient<UserGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__UserClient<User | null>,
          Prisma__UserClient<UserGetPayload<T> | null>
        >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends UserFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, UserFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'User'
    > extends True
      ? CheckSelect<
          T,
          Prisma__UserClient<User>,
          Prisma__UserClient<UserGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__UserClient<User | null>,
          Prisma__UserClient<UserGetPayload<T> | null>
        >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<User>>,
      PrismaPromise<Array<UserGetPayload<T>>>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     **/
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User>,
      Prisma__UserClient<UserGetPayload<T>>
    >;

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     **/
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User>,
      Prisma__UserClient<UserGetPayload<T>>
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User>,
      Prisma__UserClient<UserGetPayload<T>>
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     **/
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User>,
      Prisma__UserClient<UserGetPayload<T>>
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>
    ): PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    tenants<T extends UsersOfTenantsFindManyArgs = {}>(
      args?: Subset<T, UsersOfTenantsFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<UsersOfTenants>>,
      PrismaPromise<Array<UsersOfTenantsGetPayload<T>>>
    >;

    eventSubmissions<T extends EventSubmissionFindManyArgs = {}>(
      args?: Subset<T, EventSubmissionFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventSubmission>>,
      PrismaPromise<Array<EventSubmissionGetPayload<T>>>
    >;

    eventRegistrations<T extends EventRegistrationFindManyArgs = {}>(
      args?: Subset<T, EventRegistrationFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventRegistration>>,
      PrismaPromise<Array<EventRegistrationGetPayload<T>>>
    >;

    receipts<T extends ReceiptFindManyArgs = {}>(
      args?: Subset<T, ReceiptFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<Receipt>>,
      PrismaPromise<Array<ReceiptGetPayload<T>>>
    >;

    createdEvents<T extends TumiEventFindManyArgs = {}>(
      args?: Subset<T, TumiEventFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<TumiEvent>>,
      PrismaPromise<Array<TumiEventGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * User findUnique
   */
  export type UserFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * Throw an Error if a User can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which User to fetch.
     *
     **/
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * Throw an Error if a User can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which User to fetch.
     *
     **/
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     *
     **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     *
     **/
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     *
     **/
    distinct?: Enumerable<UserScalarFieldEnum>;
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * Filter, which Users to fetch.
     *
     **/
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     *
     **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     *
     **/
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     *
     **/
    skip?: number;
    distinct?: Enumerable<UserScalarFieldEnum>;
  };

  /**
   * User create
   */
  export type UserCreateArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * The data needed to create a User.
     *
     **/
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs = {
    data: Enumerable<UserCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * The data needed to update a User.
     *
     **/
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     *
     **/
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs = {
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    where?: UserWhereInput;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * The filter to search for the User to update in case it exists.
     *
     **/
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     *
     **/
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
    /**
     * Filter which User to delete.
     *
     **/
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs = {
    where?: UserWhereInput;
  };

  /**
   * User without action
   */
  export type UserArgs = {
    /**
     * Select specific fields to fetch from the User
     *
     **/
    select?: UserSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UserInclude | null;
  };

  /**
   * Model UsersOfTenants
   */

  export type AggregateUsersOfTenants = {
    _count: UsersOfTenantsCountAggregateOutputType | null;
    _min: UsersOfTenantsMinAggregateOutputType | null;
    _max: UsersOfTenantsMaxAggregateOutputType | null;
  };

  export type UsersOfTenantsMinAggregateOutputType = {
    createdAt: Date | null;
    userId: string | null;
    tenantId: string | null;
    role: Role | null;
    status: MembershipStatus | null;
  };

  export type UsersOfTenantsMaxAggregateOutputType = {
    createdAt: Date | null;
    userId: string | null;
    tenantId: string | null;
    role: Role | null;
    status: MembershipStatus | null;
  };

  export type UsersOfTenantsCountAggregateOutputType = {
    createdAt: number;
    userId: number;
    tenantId: number;
    role: number;
    status: number;
    _all: number;
  };

  export type UsersOfTenantsMinAggregateInputType = {
    createdAt?: true;
    userId?: true;
    tenantId?: true;
    role?: true;
    status?: true;
  };

  export type UsersOfTenantsMaxAggregateInputType = {
    createdAt?: true;
    userId?: true;
    tenantId?: true;
    role?: true;
    status?: true;
  };

  export type UsersOfTenantsCountAggregateInputType = {
    createdAt?: true;
    userId?: true;
    tenantId?: true;
    role?: true;
    status?: true;
    _all?: true;
  };

  export type UsersOfTenantsAggregateArgs = {
    /**
     * Filter which UsersOfTenants to aggregate.
     *
     **/
    where?: UsersOfTenantsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UsersOfTenants to fetch.
     *
     **/
    orderBy?: Enumerable<UsersOfTenantsOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: UsersOfTenantsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UsersOfTenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UsersOfTenants.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UsersOfTenants
     **/
    _count?: true | UsersOfTenantsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UsersOfTenantsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UsersOfTenantsMaxAggregateInputType;
  };

  export type GetUsersOfTenantsAggregateType<
    T extends UsersOfTenantsAggregateArgs
  > = {
    [P in keyof T & keyof AggregateUsersOfTenants]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsersOfTenants[P]>
      : GetScalarType<T[P], AggregateUsersOfTenants[P]>;
  };

  export type UsersOfTenantsGroupByArgs = {
    where?: UsersOfTenantsWhereInput;
    orderBy?: Enumerable<UsersOfTenantsOrderByWithAggregationInput>;
    by: Array<UsersOfTenantsScalarFieldEnum>;
    having?: UsersOfTenantsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsersOfTenantsCountAggregateInputType | true;
    _min?: UsersOfTenantsMinAggregateInputType;
    _max?: UsersOfTenantsMaxAggregateInputType;
  };

  export type UsersOfTenantsGroupByOutputType = {
    createdAt: Date;
    userId: string;
    tenantId: string;
    role: Role;
    status: MembershipStatus;
    _count: UsersOfTenantsCountAggregateOutputType | null;
    _min: UsersOfTenantsMinAggregateOutputType | null;
    _max: UsersOfTenantsMaxAggregateOutputType | null;
  };

  type GetUsersOfTenantsGroupByPayload<T extends UsersOfTenantsGroupByArgs> =
    Promise<
      Array<
        PickArray<UsersOfTenantsGroupByOutputType, T['by']> &
          {
            [P in keyof T &
              keyof UsersOfTenantsGroupByOutputType]: P extends '_count'
              ? T[P] extends boolean
                ? number
                : GetScalarType<T[P], UsersOfTenantsGroupByOutputType[P]>
              : GetScalarType<T[P], UsersOfTenantsGroupByOutputType[P]>;
          }
      >
    >;

  export type UsersOfTenantsSelect = {
    createdAt?: boolean;
    user?: boolean | UserArgs;
    userId?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    role?: boolean;
    status?: boolean;
  };

  export type UsersOfTenantsInclude = {
    user?: boolean | UserArgs;
    tenant?: boolean | TenantArgs;
  };

  export type UsersOfTenantsGetPayload<
    S extends boolean | null | undefined | UsersOfTenantsArgs,
    U = keyof S
  > = S extends true
    ? UsersOfTenants
    : S extends undefined
    ? never
    : S extends UsersOfTenantsArgs | UsersOfTenantsFindManyArgs
    ? 'include' extends U
      ? UsersOfTenants &
          {
            [P in TrueKeys<S['include']>]: P extends 'user'
              ? UserGetPayload<S['include'][P]>
              : P extends 'tenant'
              ? TenantGetPayload<S['include'][P]>
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof UsersOfTenants
            ? UsersOfTenants[P]
            : P extends 'user'
            ? UserGetPayload<S['select'][P]>
            : P extends 'tenant'
            ? TenantGetPayload<S['select'][P]>
            : never;
        }
      : UsersOfTenants
    : UsersOfTenants;

  type UsersOfTenantsCountArgs = Merge<
    Omit<UsersOfTenantsFindManyArgs, 'select' | 'include'> & {
      select?: UsersOfTenantsCountAggregateInputType | true;
    }
  >;

  export interface UsersOfTenantsDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one UsersOfTenants that matches the filter.
     * @param {UsersOfTenantsFindUniqueArgs} args - Arguments to find a UsersOfTenants
     * @example
     * // Get one UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends UsersOfTenantsFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, UsersOfTenantsFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'UsersOfTenants'
    > extends True
      ? CheckSelect<
          T,
          Prisma__UsersOfTenantsClient<UsersOfTenants>,
          Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__UsersOfTenantsClient<UsersOfTenants | null>,
          Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T> | null>
        >;

    /**
     * Find the first UsersOfTenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersOfTenantsFindFirstArgs} args - Arguments to find a UsersOfTenants
     * @example
     * // Get one UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends UsersOfTenantsFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, UsersOfTenantsFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'UsersOfTenants'
    > extends True
      ? CheckSelect<
          T,
          Prisma__UsersOfTenantsClient<UsersOfTenants>,
          Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__UsersOfTenantsClient<UsersOfTenants | null>,
          Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T> | null>
        >;

    /**
     * Find zero or more UsersOfTenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersOfTenantsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.findMany()
     *
     * // Get first 10 UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.findMany({ take: 10 })
     *
     * // Only select the `createdAt`
     * const usersOfTenantsWithCreatedAtOnly = await prisma.usersOfTenants.findMany({ select: { createdAt: true } })
     *
     **/
    findMany<T extends UsersOfTenantsFindManyArgs>(
      args?: SelectSubset<T, UsersOfTenantsFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<UsersOfTenants>>,
      PrismaPromise<Array<UsersOfTenantsGetPayload<T>>>
    >;

    /**
     * Create a UsersOfTenants.
     * @param {UsersOfTenantsCreateArgs} args - Arguments to create a UsersOfTenants.
     * @example
     * // Create one UsersOfTenants
     * const UsersOfTenants = await prisma.usersOfTenants.create({
     *   data: {
     *     // ... data to create a UsersOfTenants
     *   }
     * })
     *
     **/
    create<T extends UsersOfTenantsCreateArgs>(
      args: SelectSubset<T, UsersOfTenantsCreateArgs>
    ): CheckSelect<
      T,
      Prisma__UsersOfTenantsClient<UsersOfTenants>,
      Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T>>
    >;

    /**
     * Create many UsersOfTenants.
     *     @param {UsersOfTenantsCreateManyArgs} args - Arguments to create many UsersOfTenants.
     *     @example
     *     // Create many UsersOfTenants
     *     const usersOfTenants = await prisma.usersOfTenants.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends UsersOfTenantsCreateManyArgs>(
      args?: SelectSubset<T, UsersOfTenantsCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a UsersOfTenants.
     * @param {UsersOfTenantsDeleteArgs} args - Arguments to delete one UsersOfTenants.
     * @example
     * // Delete one UsersOfTenants
     * const UsersOfTenants = await prisma.usersOfTenants.delete({
     *   where: {
     *     // ... filter to delete one UsersOfTenants
     *   }
     * })
     *
     **/
    delete<T extends UsersOfTenantsDeleteArgs>(
      args: SelectSubset<T, UsersOfTenantsDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__UsersOfTenantsClient<UsersOfTenants>,
      Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T>>
    >;

    /**
     * Update one UsersOfTenants.
     * @param {UsersOfTenantsUpdateArgs} args - Arguments to update one UsersOfTenants.
     * @example
     * // Update one UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends UsersOfTenantsUpdateArgs>(
      args: SelectSubset<T, UsersOfTenantsUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__UsersOfTenantsClient<UsersOfTenants>,
      Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T>>
    >;

    /**
     * Delete zero or more UsersOfTenants.
     * @param {UsersOfTenantsDeleteManyArgs} args - Arguments to filter UsersOfTenants to delete.
     * @example
     * // Delete a few UsersOfTenants
     * const { count } = await prisma.usersOfTenants.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends UsersOfTenantsDeleteManyArgs>(
      args?: SelectSubset<T, UsersOfTenantsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UsersOfTenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersOfTenantsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends UsersOfTenantsUpdateManyArgs>(
      args: SelectSubset<T, UsersOfTenantsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one UsersOfTenants.
     * @param {UsersOfTenantsUpsertArgs} args - Arguments to update or create a UsersOfTenants.
     * @example
     * // Update or create a UsersOfTenants
     * const usersOfTenants = await prisma.usersOfTenants.upsert({
     *   create: {
     *     // ... data to create a UsersOfTenants
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsersOfTenants we want to update
     *   }
     * })
     **/
    upsert<T extends UsersOfTenantsUpsertArgs>(
      args: SelectSubset<T, UsersOfTenantsUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__UsersOfTenantsClient<UsersOfTenants>,
      Prisma__UsersOfTenantsClient<UsersOfTenantsGetPayload<T>>
    >;

    /**
     * Count the number of UsersOfTenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersOfTenantsCountArgs} args - Arguments to filter UsersOfTenants to count.
     * @example
     * // Count the number of UsersOfTenants
     * const count = await prisma.usersOfTenants.count({
     *   where: {
     *     // ... the filter for the UsersOfTenants we want to count
     *   }
     * })
     **/
    count<T extends UsersOfTenantsCountArgs>(
      args?: Subset<T, UsersOfTenantsCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersOfTenantsCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a UsersOfTenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersOfTenantsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UsersOfTenantsAggregateArgs>(
      args: Subset<T, UsersOfTenantsAggregateArgs>
    ): PrismaPromise<GetUsersOfTenantsAggregateType<T>>;

    /**
     * Group by UsersOfTenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersOfTenantsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UsersOfTenantsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersOfTenantsGroupByArgs['orderBy'] }
        : { orderBy?: UsersOfTenantsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, UsersOfTenantsGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetUsersOfTenantsGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsersOfTenants.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UsersOfTenantsClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs = {}>(
      args?: Subset<T, UserArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User | null>,
      Prisma__UserClient<UserGetPayload<T> | null>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * UsersOfTenants findUnique
   */
  export type UsersOfTenantsFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * Throw an Error if a UsersOfTenants can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which UsersOfTenants to fetch.
     *
     **/
    where: UsersOfTenantsWhereUniqueInput;
  };

  /**
   * UsersOfTenants findFirst
   */
  export type UsersOfTenantsFindFirstArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * Throw an Error if a UsersOfTenants can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which UsersOfTenants to fetch.
     *
     **/
    where?: UsersOfTenantsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UsersOfTenants to fetch.
     *
     **/
    orderBy?: Enumerable<UsersOfTenantsOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UsersOfTenants.
     *
     **/
    cursor?: UsersOfTenantsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UsersOfTenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UsersOfTenants.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UsersOfTenants.
     *
     **/
    distinct?: Enumerable<UsersOfTenantsScalarFieldEnum>;
  };

  /**
   * UsersOfTenants findMany
   */
  export type UsersOfTenantsFindManyArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * Filter, which UsersOfTenants to fetch.
     *
     **/
    where?: UsersOfTenantsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UsersOfTenants to fetch.
     *
     **/
    orderBy?: Enumerable<UsersOfTenantsOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UsersOfTenants.
     *
     **/
    cursor?: UsersOfTenantsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UsersOfTenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UsersOfTenants.
     *
     **/
    skip?: number;
    distinct?: Enumerable<UsersOfTenantsScalarFieldEnum>;
  };

  /**
   * UsersOfTenants create
   */
  export type UsersOfTenantsCreateArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * The data needed to create a UsersOfTenants.
     *
     **/
    data: XOR<UsersOfTenantsCreateInput, UsersOfTenantsUncheckedCreateInput>;
  };

  /**
   * UsersOfTenants createMany
   */
  export type UsersOfTenantsCreateManyArgs = {
    data: Enumerable<UsersOfTenantsCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * UsersOfTenants update
   */
  export type UsersOfTenantsUpdateArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * The data needed to update a UsersOfTenants.
     *
     **/
    data: XOR<UsersOfTenantsUpdateInput, UsersOfTenantsUncheckedUpdateInput>;
    /**
     * Choose, which UsersOfTenants to update.
     *
     **/
    where: UsersOfTenantsWhereUniqueInput;
  };

  /**
   * UsersOfTenants updateMany
   */
  export type UsersOfTenantsUpdateManyArgs = {
    data: XOR<
      UsersOfTenantsUpdateManyMutationInput,
      UsersOfTenantsUncheckedUpdateManyInput
    >;
    where?: UsersOfTenantsWhereInput;
  };

  /**
   * UsersOfTenants upsert
   */
  export type UsersOfTenantsUpsertArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * The filter to search for the UsersOfTenants to update in case it exists.
     *
     **/
    where: UsersOfTenantsWhereUniqueInput;
    /**
     * In case the UsersOfTenants found by the `where` argument doesn't exist, create a new UsersOfTenants with this data.
     *
     **/
    create: XOR<UsersOfTenantsCreateInput, UsersOfTenantsUncheckedCreateInput>;
    /**
     * In case the UsersOfTenants was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<UsersOfTenantsUpdateInput, UsersOfTenantsUncheckedUpdateInput>;
  };

  /**
   * UsersOfTenants delete
   */
  export type UsersOfTenantsDeleteArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
    /**
     * Filter which UsersOfTenants to delete.
     *
     **/
    where: UsersOfTenantsWhereUniqueInput;
  };

  /**
   * UsersOfTenants deleteMany
   */
  export type UsersOfTenantsDeleteManyArgs = {
    where?: UsersOfTenantsWhereInput;
  };

  /**
   * UsersOfTenants without action
   */
  export type UsersOfTenantsArgs = {
    /**
     * Select specific fields to fetch from the UsersOfTenants
     *
     **/
    select?: UsersOfTenantsSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: UsersOfTenantsInclude | null;
  };

  /**
   * Model EventOrganizer
   */

  export type AggregateEventOrganizer = {
    _count: EventOrganizerCountAggregateOutputType | null;
    _min: EventOrganizerMinAggregateOutputType | null;
    _max: EventOrganizerMaxAggregateOutputType | null;
  };

  export type EventOrganizerMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    tenantId: string | null;
    name: string | null;
    text: string | null;
    link: string | null;
  };

  export type EventOrganizerMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    tenantId: string | null;
    name: string | null;
    text: string | null;
    link: string | null;
  };

  export type EventOrganizerCountAggregateOutputType = {
    id: number;
    createdAt: number;
    tenantId: number;
    name: number;
    text: number;
    link: number;
    _all: number;
  };

  export type EventOrganizerMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    tenantId?: true;
    name?: true;
    text?: true;
    link?: true;
  };

  export type EventOrganizerMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    tenantId?: true;
    name?: true;
    text?: true;
    link?: true;
  };

  export type EventOrganizerCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    tenantId?: true;
    name?: true;
    text?: true;
    link?: true;
    _all?: true;
  };

  export type EventOrganizerAggregateArgs = {
    /**
     * Filter which EventOrganizer to aggregate.
     *
     **/
    where?: EventOrganizerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventOrganizers to fetch.
     *
     **/
    orderBy?: Enumerable<EventOrganizerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: EventOrganizerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventOrganizers from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventOrganizers.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventOrganizers
     **/
    _count?: true | EventOrganizerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventOrganizerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventOrganizerMaxAggregateInputType;
  };

  export type GetEventOrganizerAggregateType<
    T extends EventOrganizerAggregateArgs
  > = {
    [P in keyof T & keyof AggregateEventOrganizer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventOrganizer[P]>
      : GetScalarType<T[P], AggregateEventOrganizer[P]>;
  };

  export type EventOrganizerGroupByArgs = {
    where?: EventOrganizerWhereInput;
    orderBy?: Enumerable<EventOrganizerOrderByWithAggregationInput>;
    by: Array<EventOrganizerScalarFieldEnum>;
    having?: EventOrganizerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventOrganizerCountAggregateInputType | true;
    _min?: EventOrganizerMinAggregateInputType;
    _max?: EventOrganizerMaxAggregateInputType;
  };

  export type EventOrganizerGroupByOutputType = {
    id: string;
    createdAt: Date;
    tenantId: string;
    name: string;
    text: string;
    link: string | null;
    _count: EventOrganizerCountAggregateOutputType | null;
    _min: EventOrganizerMinAggregateOutputType | null;
    _max: EventOrganizerMaxAggregateOutputType | null;
  };

  type GetEventOrganizerGroupByPayload<T extends EventOrganizerGroupByArgs> =
    Promise<
      Array<
        PickArray<EventOrganizerGroupByOutputType, T['by']> &
          {
            [P in keyof T &
              keyof EventOrganizerGroupByOutputType]: P extends '_count'
              ? T[P] extends boolean
                ? number
                : GetScalarType<T[P], EventOrganizerGroupByOutputType[P]>
              : GetScalarType<T[P], EventOrganizerGroupByOutputType[P]>;
          }
      >
    >;

  export type EventOrganizerSelect = {
    id?: boolean;
    createdAt?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    name?: boolean;
    text?: boolean;
    link?: boolean;
    events?: boolean | TumiEventFindManyArgs;
    _count?: boolean | EventOrganizerCountOutputTypeArgs;
  };

  export type EventOrganizerInclude = {
    tenant?: boolean | TenantArgs;
    events?: boolean | TumiEventFindManyArgs;
    _count?: boolean | EventOrganizerCountOutputTypeArgs;
  };

  export type EventOrganizerGetPayload<
    S extends boolean | null | undefined | EventOrganizerArgs,
    U = keyof S
  > = S extends true
    ? EventOrganizer
    : S extends undefined
    ? never
    : S extends EventOrganizerArgs | EventOrganizerFindManyArgs
    ? 'include' extends U
      ? EventOrganizer &
          {
            [P in TrueKeys<S['include']>]: P extends 'tenant'
              ? TenantGetPayload<S['include'][P]>
              : P extends 'events'
              ? Array<TumiEventGetPayload<S['include'][P]>>
              : P extends '_count'
              ? EventOrganizerCountOutputTypeGetPayload<S['include'][P]> | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof EventOrganizer
            ? EventOrganizer[P]
            : P extends 'tenant'
            ? TenantGetPayload<S['select'][P]>
            : P extends 'events'
            ? Array<TumiEventGetPayload<S['select'][P]>>
            : P extends '_count'
            ? EventOrganizerCountOutputTypeGetPayload<S['select'][P]> | null
            : never;
        }
      : EventOrganizer
    : EventOrganizer;

  type EventOrganizerCountArgs = Merge<
    Omit<EventOrganizerFindManyArgs, 'select' | 'include'> & {
      select?: EventOrganizerCountAggregateInputType | true;
    }
  >;

  export interface EventOrganizerDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one EventOrganizer that matches the filter.
     * @param {EventOrganizerFindUniqueArgs} args - Arguments to find a EventOrganizer
     * @example
     * // Get one EventOrganizer
     * const eventOrganizer = await prisma.eventOrganizer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends EventOrganizerFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, EventOrganizerFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'EventOrganizer'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventOrganizerClient<EventOrganizer>,
          Prisma__EventOrganizerClient<EventOrganizerGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventOrganizerClient<EventOrganizer | null>,
          Prisma__EventOrganizerClient<EventOrganizerGetPayload<T> | null>
        >;

    /**
     * Find the first EventOrganizer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventOrganizerFindFirstArgs} args - Arguments to find a EventOrganizer
     * @example
     * // Get one EventOrganizer
     * const eventOrganizer = await prisma.eventOrganizer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends EventOrganizerFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, EventOrganizerFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'EventOrganizer'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventOrganizerClient<EventOrganizer>,
          Prisma__EventOrganizerClient<EventOrganizerGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventOrganizerClient<EventOrganizer | null>,
          Prisma__EventOrganizerClient<EventOrganizerGetPayload<T> | null>
        >;

    /**
     * Find zero or more EventOrganizers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventOrganizerFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventOrganizers
     * const eventOrganizers = await prisma.eventOrganizer.findMany()
     *
     * // Get first 10 EventOrganizers
     * const eventOrganizers = await prisma.eventOrganizer.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventOrganizerWithIdOnly = await prisma.eventOrganizer.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends EventOrganizerFindManyArgs>(
      args?: SelectSubset<T, EventOrganizerFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventOrganizer>>,
      PrismaPromise<Array<EventOrganizerGetPayload<T>>>
    >;

    /**
     * Create a EventOrganizer.
     * @param {EventOrganizerCreateArgs} args - Arguments to create a EventOrganizer.
     * @example
     * // Create one EventOrganizer
     * const EventOrganizer = await prisma.eventOrganizer.create({
     *   data: {
     *     // ... data to create a EventOrganizer
     *   }
     * })
     *
     **/
    create<T extends EventOrganizerCreateArgs>(
      args: SelectSubset<T, EventOrganizerCreateArgs>
    ): CheckSelect<
      T,
      Prisma__EventOrganizerClient<EventOrganizer>,
      Prisma__EventOrganizerClient<EventOrganizerGetPayload<T>>
    >;

    /**
     * Create many EventOrganizers.
     *     @param {EventOrganizerCreateManyArgs} args - Arguments to create many EventOrganizers.
     *     @example
     *     // Create many EventOrganizers
     *     const eventOrganizer = await prisma.eventOrganizer.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends EventOrganizerCreateManyArgs>(
      args?: SelectSubset<T, EventOrganizerCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a EventOrganizer.
     * @param {EventOrganizerDeleteArgs} args - Arguments to delete one EventOrganizer.
     * @example
     * // Delete one EventOrganizer
     * const EventOrganizer = await prisma.eventOrganizer.delete({
     *   where: {
     *     // ... filter to delete one EventOrganizer
     *   }
     * })
     *
     **/
    delete<T extends EventOrganizerDeleteArgs>(
      args: SelectSubset<T, EventOrganizerDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__EventOrganizerClient<EventOrganizer>,
      Prisma__EventOrganizerClient<EventOrganizerGetPayload<T>>
    >;

    /**
     * Update one EventOrganizer.
     * @param {EventOrganizerUpdateArgs} args - Arguments to update one EventOrganizer.
     * @example
     * // Update one EventOrganizer
     * const eventOrganizer = await prisma.eventOrganizer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends EventOrganizerUpdateArgs>(
      args: SelectSubset<T, EventOrganizerUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__EventOrganizerClient<EventOrganizer>,
      Prisma__EventOrganizerClient<EventOrganizerGetPayload<T>>
    >;

    /**
     * Delete zero or more EventOrganizers.
     * @param {EventOrganizerDeleteManyArgs} args - Arguments to filter EventOrganizers to delete.
     * @example
     * // Delete a few EventOrganizers
     * const { count } = await prisma.eventOrganizer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends EventOrganizerDeleteManyArgs>(
      args?: SelectSubset<T, EventOrganizerDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventOrganizers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventOrganizerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventOrganizers
     * const eventOrganizer = await prisma.eventOrganizer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends EventOrganizerUpdateManyArgs>(
      args: SelectSubset<T, EventOrganizerUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one EventOrganizer.
     * @param {EventOrganizerUpsertArgs} args - Arguments to update or create a EventOrganizer.
     * @example
     * // Update or create a EventOrganizer
     * const eventOrganizer = await prisma.eventOrganizer.upsert({
     *   create: {
     *     // ... data to create a EventOrganizer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventOrganizer we want to update
     *   }
     * })
     **/
    upsert<T extends EventOrganizerUpsertArgs>(
      args: SelectSubset<T, EventOrganizerUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__EventOrganizerClient<EventOrganizer>,
      Prisma__EventOrganizerClient<EventOrganizerGetPayload<T>>
    >;

    /**
     * Count the number of EventOrganizers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventOrganizerCountArgs} args - Arguments to filter EventOrganizers to count.
     * @example
     * // Count the number of EventOrganizers
     * const count = await prisma.eventOrganizer.count({
     *   where: {
     *     // ... the filter for the EventOrganizers we want to count
     *   }
     * })
     **/
    count<T extends EventOrganizerCountArgs>(
      args?: Subset<T, EventOrganizerCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventOrganizerCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EventOrganizer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventOrganizerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventOrganizerAggregateArgs>(
      args: Subset<T, EventOrganizerAggregateArgs>
    ): PrismaPromise<GetEventOrganizerAggregateType<T>>;

    /**
     * Group by EventOrganizer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventOrganizerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventOrganizerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventOrganizerGroupByArgs['orderBy'] }
        : { orderBy?: EventOrganizerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, EventOrganizerGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetEventOrganizerGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventOrganizer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventOrganizerClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    events<T extends TumiEventFindManyArgs = {}>(
      args?: Subset<T, TumiEventFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<TumiEvent>>,
      PrismaPromise<Array<TumiEventGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EventOrganizer findUnique
   */
  export type EventOrganizerFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * Throw an Error if a EventOrganizer can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventOrganizer to fetch.
     *
     **/
    where: EventOrganizerWhereUniqueInput;
  };

  /**
   * EventOrganizer findFirst
   */
  export type EventOrganizerFindFirstArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * Throw an Error if a EventOrganizer can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventOrganizer to fetch.
     *
     **/
    where?: EventOrganizerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventOrganizers to fetch.
     *
     **/
    orderBy?: Enumerable<EventOrganizerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventOrganizers.
     *
     **/
    cursor?: EventOrganizerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventOrganizers from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventOrganizers.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventOrganizers.
     *
     **/
    distinct?: Enumerable<EventOrganizerScalarFieldEnum>;
  };

  /**
   * EventOrganizer findMany
   */
  export type EventOrganizerFindManyArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * Filter, which EventOrganizers to fetch.
     *
     **/
    where?: EventOrganizerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventOrganizers to fetch.
     *
     **/
    orderBy?: Enumerable<EventOrganizerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventOrganizers.
     *
     **/
    cursor?: EventOrganizerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventOrganizers from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventOrganizers.
     *
     **/
    skip?: number;
    distinct?: Enumerable<EventOrganizerScalarFieldEnum>;
  };

  /**
   * EventOrganizer create
   */
  export type EventOrganizerCreateArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * The data needed to create a EventOrganizer.
     *
     **/
    data: XOR<EventOrganizerCreateInput, EventOrganizerUncheckedCreateInput>;
  };

  /**
   * EventOrganizer createMany
   */
  export type EventOrganizerCreateManyArgs = {
    data: Enumerable<EventOrganizerCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * EventOrganizer update
   */
  export type EventOrganizerUpdateArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * The data needed to update a EventOrganizer.
     *
     **/
    data: XOR<EventOrganizerUpdateInput, EventOrganizerUncheckedUpdateInput>;
    /**
     * Choose, which EventOrganizer to update.
     *
     **/
    where: EventOrganizerWhereUniqueInput;
  };

  /**
   * EventOrganizer updateMany
   */
  export type EventOrganizerUpdateManyArgs = {
    data: XOR<
      EventOrganizerUpdateManyMutationInput,
      EventOrganizerUncheckedUpdateManyInput
    >;
    where?: EventOrganizerWhereInput;
  };

  /**
   * EventOrganizer upsert
   */
  export type EventOrganizerUpsertArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * The filter to search for the EventOrganizer to update in case it exists.
     *
     **/
    where: EventOrganizerWhereUniqueInput;
    /**
     * In case the EventOrganizer found by the `where` argument doesn't exist, create a new EventOrganizer with this data.
     *
     **/
    create: XOR<EventOrganizerCreateInput, EventOrganizerUncheckedCreateInput>;
    /**
     * In case the EventOrganizer was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<EventOrganizerUpdateInput, EventOrganizerUncheckedUpdateInput>;
  };

  /**
   * EventOrganizer delete
   */
  export type EventOrganizerDeleteArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
    /**
     * Filter which EventOrganizer to delete.
     *
     **/
    where: EventOrganizerWhereUniqueInput;
  };

  /**
   * EventOrganizer deleteMany
   */
  export type EventOrganizerDeleteManyArgs = {
    where?: EventOrganizerWhereInput;
  };

  /**
   * EventOrganizer without action
   */
  export type EventOrganizerArgs = {
    /**
     * Select specific fields to fetch from the EventOrganizer
     *
     **/
    select?: EventOrganizerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventOrganizerInclude | null;
  };

  /**
   * Model EventTemplate
   */

  export type AggregateEventTemplate = {
    _count: EventTemplateCountAggregateOutputType | null;
    _avg: EventTemplateAvgAggregateOutputType | null;
    _sum: EventTemplateSumAggregateOutputType | null;
    _min: EventTemplateMinAggregateOutputType | null;
    _max: EventTemplateMaxAggregateOutputType | null;
  };

  export type EventTemplateAvgAggregateOutputType = {
    duration: Decimal | null;
  };

  export type EventTemplateSumAggregateOutputType = {
    duration: Decimal | null;
  };

  export type EventTemplateMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    title: string | null;
    icon: string | null;
    description: string | null;
    comment: string | null;
    location: string | null;
    locationId: string | null;
    duration: Decimal | null;
    participantText: string | null;
    participantMail: string | null;
    organizerText: string | null;
    tenantId: string | null;
  };

  export type EventTemplateMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    title: string | null;
    icon: string | null;
    description: string | null;
    comment: string | null;
    location: string | null;
    locationId: string | null;
    duration: Decimal | null;
    participantText: string | null;
    participantMail: string | null;
    organizerText: string | null;
    tenantId: string | null;
  };

  export type EventTemplateCountAggregateOutputType = {
    id: number;
    createdAt: number;
    title: number;
    icon: number;
    description: number;
    comment: number;
    location: number;
    locationId: number;
    duration: number;
    participantText: number;
    participantMail: number;
    organizerText: number;
    finances: number;
    tenantId: number;
    _all: number;
  };

  export type EventTemplateAvgAggregateInputType = {
    duration?: true;
  };

  export type EventTemplateSumAggregateInputType = {
    duration?: true;
  };

  export type EventTemplateMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    title?: true;
    icon?: true;
    description?: true;
    comment?: true;
    location?: true;
    locationId?: true;
    duration?: true;
    participantText?: true;
    participantMail?: true;
    organizerText?: true;
    tenantId?: true;
  };

  export type EventTemplateMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    title?: true;
    icon?: true;
    description?: true;
    comment?: true;
    location?: true;
    locationId?: true;
    duration?: true;
    participantText?: true;
    participantMail?: true;
    organizerText?: true;
    tenantId?: true;
  };

  export type EventTemplateCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    title?: true;
    icon?: true;
    description?: true;
    comment?: true;
    location?: true;
    locationId?: true;
    duration?: true;
    participantText?: true;
    participantMail?: true;
    organizerText?: true;
    finances?: true;
    tenantId?: true;
    _all?: true;
  };

  export type EventTemplateAggregateArgs = {
    /**
     * Filter which EventTemplate to aggregate.
     *
     **/
    where?: EventTemplateWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventTemplates to fetch.
     *
     **/
    orderBy?: Enumerable<EventTemplateOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: EventTemplateWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventTemplates from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventTemplates.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventTemplates
     **/
    _count?: true | EventTemplateCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: EventTemplateAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: EventTemplateSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventTemplateMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventTemplateMaxAggregateInputType;
  };

  export type GetEventTemplateAggregateType<
    T extends EventTemplateAggregateArgs
  > = {
    [P in keyof T & keyof AggregateEventTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventTemplate[P]>
      : GetScalarType<T[P], AggregateEventTemplate[P]>;
  };

  export type EventTemplateGroupByArgs = {
    where?: EventTemplateWhereInput;
    orderBy?: Enumerable<EventTemplateOrderByWithAggregationInput>;
    by: Array<EventTemplateScalarFieldEnum>;
    having?: EventTemplateScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventTemplateCountAggregateInputType | true;
    _avg?: EventTemplateAvgAggregateInputType;
    _sum?: EventTemplateSumAggregateInputType;
    _min?: EventTemplateMinAggregateInputType;
    _max?: EventTemplateMaxAggregateInputType;
  };

  export type EventTemplateGroupByOutputType = {
    id: string;
    createdAt: Date;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonValue;
    tenantId: string;
    _count: EventTemplateCountAggregateOutputType | null;
    _avg: EventTemplateAvgAggregateOutputType | null;
    _sum: EventTemplateSumAggregateOutputType | null;
    _min: EventTemplateMinAggregateOutputType | null;
    _max: EventTemplateMaxAggregateOutputType | null;
  };

  type GetEventTemplateGroupByPayload<T extends EventTemplateGroupByArgs> =
    Promise<
      Array<
        PickArray<EventTemplateGroupByOutputType, T['by']> &
          {
            [P in keyof T &
              keyof EventTemplateGroupByOutputType]: P extends '_count'
              ? T[P] extends boolean
                ? number
                : GetScalarType<T[P], EventTemplateGroupByOutputType[P]>
              : GetScalarType<T[P], EventTemplateGroupByOutputType[P]>;
          }
      >
    >;

  export type EventTemplateSelect = {
    id?: boolean;
    createdAt?: boolean;
    title?: boolean;
    icon?: boolean;
    description?: boolean;
    comment?: boolean;
    location?: boolean;
    locationId?: boolean;
    duration?: boolean;
    participantText?: boolean;
    participantMail?: boolean;
    organizerText?: boolean;
    finances?: boolean;
    eventInstances?: boolean | TumiEventFindManyArgs;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    _count?: boolean | EventTemplateCountOutputTypeArgs;
  };

  export type EventTemplateInclude = {
    eventInstances?: boolean | TumiEventFindManyArgs;
    tenant?: boolean | TenantArgs;
    _count?: boolean | EventTemplateCountOutputTypeArgs;
  };

  export type EventTemplateGetPayload<
    S extends boolean | null | undefined | EventTemplateArgs,
    U = keyof S
  > = S extends true
    ? EventTemplate
    : S extends undefined
    ? never
    : S extends EventTemplateArgs | EventTemplateFindManyArgs
    ? 'include' extends U
      ? EventTemplate &
          {
            [P in TrueKeys<S['include']>]: P extends 'eventInstances'
              ? Array<TumiEventGetPayload<S['include'][P]>>
              : P extends 'tenant'
              ? TenantGetPayload<S['include'][P]>
              : P extends '_count'
              ? EventTemplateCountOutputTypeGetPayload<S['include'][P]> | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof EventTemplate
            ? EventTemplate[P]
            : P extends 'eventInstances'
            ? Array<TumiEventGetPayload<S['select'][P]>>
            : P extends 'tenant'
            ? TenantGetPayload<S['select'][P]>
            : P extends '_count'
            ? EventTemplateCountOutputTypeGetPayload<S['select'][P]> | null
            : never;
        }
      : EventTemplate
    : EventTemplate;

  type EventTemplateCountArgs = Merge<
    Omit<EventTemplateFindManyArgs, 'select' | 'include'> & {
      select?: EventTemplateCountAggregateInputType | true;
    }
  >;

  export interface EventTemplateDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one EventTemplate that matches the filter.
     * @param {EventTemplateFindUniqueArgs} args - Arguments to find a EventTemplate
     * @example
     * // Get one EventTemplate
     * const eventTemplate = await prisma.eventTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends EventTemplateFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, EventTemplateFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'EventTemplate'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventTemplateClient<EventTemplate>,
          Prisma__EventTemplateClient<EventTemplateGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventTemplateClient<EventTemplate | null>,
          Prisma__EventTemplateClient<EventTemplateGetPayload<T> | null>
        >;

    /**
     * Find the first EventTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTemplateFindFirstArgs} args - Arguments to find a EventTemplate
     * @example
     * // Get one EventTemplate
     * const eventTemplate = await prisma.eventTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends EventTemplateFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, EventTemplateFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'EventTemplate'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventTemplateClient<EventTemplate>,
          Prisma__EventTemplateClient<EventTemplateGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventTemplateClient<EventTemplate | null>,
          Prisma__EventTemplateClient<EventTemplateGetPayload<T> | null>
        >;

    /**
     * Find zero or more EventTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTemplateFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventTemplates
     * const eventTemplates = await prisma.eventTemplate.findMany()
     *
     * // Get first 10 EventTemplates
     * const eventTemplates = await prisma.eventTemplate.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventTemplateWithIdOnly = await prisma.eventTemplate.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends EventTemplateFindManyArgs>(
      args?: SelectSubset<T, EventTemplateFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventTemplate>>,
      PrismaPromise<Array<EventTemplateGetPayload<T>>>
    >;

    /**
     * Create a EventTemplate.
     * @param {EventTemplateCreateArgs} args - Arguments to create a EventTemplate.
     * @example
     * // Create one EventTemplate
     * const EventTemplate = await prisma.eventTemplate.create({
     *   data: {
     *     // ... data to create a EventTemplate
     *   }
     * })
     *
     **/
    create<T extends EventTemplateCreateArgs>(
      args: SelectSubset<T, EventTemplateCreateArgs>
    ): CheckSelect<
      T,
      Prisma__EventTemplateClient<EventTemplate>,
      Prisma__EventTemplateClient<EventTemplateGetPayload<T>>
    >;

    /**
     * Create many EventTemplates.
     *     @param {EventTemplateCreateManyArgs} args - Arguments to create many EventTemplates.
     *     @example
     *     // Create many EventTemplates
     *     const eventTemplate = await prisma.eventTemplate.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends EventTemplateCreateManyArgs>(
      args?: SelectSubset<T, EventTemplateCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a EventTemplate.
     * @param {EventTemplateDeleteArgs} args - Arguments to delete one EventTemplate.
     * @example
     * // Delete one EventTemplate
     * const EventTemplate = await prisma.eventTemplate.delete({
     *   where: {
     *     // ... filter to delete one EventTemplate
     *   }
     * })
     *
     **/
    delete<T extends EventTemplateDeleteArgs>(
      args: SelectSubset<T, EventTemplateDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__EventTemplateClient<EventTemplate>,
      Prisma__EventTemplateClient<EventTemplateGetPayload<T>>
    >;

    /**
     * Update one EventTemplate.
     * @param {EventTemplateUpdateArgs} args - Arguments to update one EventTemplate.
     * @example
     * // Update one EventTemplate
     * const eventTemplate = await prisma.eventTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends EventTemplateUpdateArgs>(
      args: SelectSubset<T, EventTemplateUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__EventTemplateClient<EventTemplate>,
      Prisma__EventTemplateClient<EventTemplateGetPayload<T>>
    >;

    /**
     * Delete zero or more EventTemplates.
     * @param {EventTemplateDeleteManyArgs} args - Arguments to filter EventTemplates to delete.
     * @example
     * // Delete a few EventTemplates
     * const { count } = await prisma.eventTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends EventTemplateDeleteManyArgs>(
      args?: SelectSubset<T, EventTemplateDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventTemplates
     * const eventTemplate = await prisma.eventTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends EventTemplateUpdateManyArgs>(
      args: SelectSubset<T, EventTemplateUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one EventTemplate.
     * @param {EventTemplateUpsertArgs} args - Arguments to update or create a EventTemplate.
     * @example
     * // Update or create a EventTemplate
     * const eventTemplate = await prisma.eventTemplate.upsert({
     *   create: {
     *     // ... data to create a EventTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventTemplate we want to update
     *   }
     * })
     **/
    upsert<T extends EventTemplateUpsertArgs>(
      args: SelectSubset<T, EventTemplateUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__EventTemplateClient<EventTemplate>,
      Prisma__EventTemplateClient<EventTemplateGetPayload<T>>
    >;

    /**
     * Count the number of EventTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTemplateCountArgs} args - Arguments to filter EventTemplates to count.
     * @example
     * // Count the number of EventTemplates
     * const count = await prisma.eventTemplate.count({
     *   where: {
     *     // ... the filter for the EventTemplates we want to count
     *   }
     * })
     **/
    count<T extends EventTemplateCountArgs>(
      args?: Subset<T, EventTemplateCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventTemplateCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EventTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventTemplateAggregateArgs>(
      args: Subset<T, EventTemplateAggregateArgs>
    ): PrismaPromise<GetEventTemplateAggregateType<T>>;

    /**
     * Group by EventTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventTemplateGroupByArgs['orderBy'] }
        : { orderBy?: EventTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, EventTemplateGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetEventTemplateGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventTemplateClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    eventInstances<T extends TumiEventFindManyArgs = {}>(
      args?: Subset<T, TumiEventFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<TumiEvent>>,
      PrismaPromise<Array<TumiEventGetPayload<T>>>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EventTemplate findUnique
   */
  export type EventTemplateFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * Throw an Error if a EventTemplate can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventTemplate to fetch.
     *
     **/
    where: EventTemplateWhereUniqueInput;
  };

  /**
   * EventTemplate findFirst
   */
  export type EventTemplateFindFirstArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * Throw an Error if a EventTemplate can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventTemplate to fetch.
     *
     **/
    where?: EventTemplateWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventTemplates to fetch.
     *
     **/
    orderBy?: Enumerable<EventTemplateOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventTemplates.
     *
     **/
    cursor?: EventTemplateWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventTemplates from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventTemplates.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventTemplates.
     *
     **/
    distinct?: Enumerable<EventTemplateScalarFieldEnum>;
  };

  /**
   * EventTemplate findMany
   */
  export type EventTemplateFindManyArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * Filter, which EventTemplates to fetch.
     *
     **/
    where?: EventTemplateWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventTemplates to fetch.
     *
     **/
    orderBy?: Enumerable<EventTemplateOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventTemplates.
     *
     **/
    cursor?: EventTemplateWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventTemplates from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventTemplates.
     *
     **/
    skip?: number;
    distinct?: Enumerable<EventTemplateScalarFieldEnum>;
  };

  /**
   * EventTemplate create
   */
  export type EventTemplateCreateArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * The data needed to create a EventTemplate.
     *
     **/
    data: XOR<EventTemplateCreateInput, EventTemplateUncheckedCreateInput>;
  };

  /**
   * EventTemplate createMany
   */
  export type EventTemplateCreateManyArgs = {
    data: Enumerable<EventTemplateCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * EventTemplate update
   */
  export type EventTemplateUpdateArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * The data needed to update a EventTemplate.
     *
     **/
    data: XOR<EventTemplateUpdateInput, EventTemplateUncheckedUpdateInput>;
    /**
     * Choose, which EventTemplate to update.
     *
     **/
    where: EventTemplateWhereUniqueInput;
  };

  /**
   * EventTemplate updateMany
   */
  export type EventTemplateUpdateManyArgs = {
    data: XOR<
      EventTemplateUpdateManyMutationInput,
      EventTemplateUncheckedUpdateManyInput
    >;
    where?: EventTemplateWhereInput;
  };

  /**
   * EventTemplate upsert
   */
  export type EventTemplateUpsertArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * The filter to search for the EventTemplate to update in case it exists.
     *
     **/
    where: EventTemplateWhereUniqueInput;
    /**
     * In case the EventTemplate found by the `where` argument doesn't exist, create a new EventTemplate with this data.
     *
     **/
    create: XOR<EventTemplateCreateInput, EventTemplateUncheckedCreateInput>;
    /**
     * In case the EventTemplate was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<EventTemplateUpdateInput, EventTemplateUncheckedUpdateInput>;
  };

  /**
   * EventTemplate delete
   */
  export type EventTemplateDeleteArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
    /**
     * Filter which EventTemplate to delete.
     *
     **/
    where: EventTemplateWhereUniqueInput;
  };

  /**
   * EventTemplate deleteMany
   */
  export type EventTemplateDeleteManyArgs = {
    where?: EventTemplateWhereInput;
  };

  /**
   * EventTemplate without action
   */
  export type EventTemplateArgs = {
    /**
     * Select specific fields to fetch from the EventTemplate
     *
     **/
    select?: EventTemplateSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventTemplateInclude | null;
  };

  /**
   * Model TumiEvent
   */

  export type AggregateTumiEvent = {
    _count: TumiEventCountAggregateOutputType | null;
    _avg: TumiEventAvgAggregateOutputType | null;
    _sum: TumiEventSumAggregateOutputType | null;
    _min: TumiEventMinAggregateOutputType | null;
    _max: TumiEventMaxAggregateOutputType | null;
  };

  export type TumiEventAvgAggregateOutputType = {
    participantLimit: number | null;
    organizerLimit: number | null;
    price: Decimal | null;
  };

  export type TumiEventSumAggregateOutputType = {
    participantLimit: number | null;
    organizerLimit: number | null;
    price: Decimal | null;
  };

  export type TumiEventMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    title: string | null;
    icon: string | null;
    start: Date | null;
    end: Date | null;
    description: string | null;
    location: string | null;
    locationId: string | null;
    participantText: string | null;
    participantMail: string | null;
    organizerText: string | null;
    participantLimit: number | null;
    organizerLimit: number | null;
    price: Decimal | null;
    registrationLink: string | null;
    registrationMode: RegistrationMode | null;
    publicationState: PublicationState | null;
    eventOrganizerId: string | null;
    creatorId: string | null;
    eventTemplateId: string | null;
  };

  export type TumiEventMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    title: string | null;
    icon: string | null;
    start: Date | null;
    end: Date | null;
    description: string | null;
    location: string | null;
    locationId: string | null;
    participantText: string | null;
    participantMail: string | null;
    organizerText: string | null;
    participantLimit: number | null;
    organizerLimit: number | null;
    price: Decimal | null;
    registrationLink: string | null;
    registrationMode: RegistrationMode | null;
    publicationState: PublicationState | null;
    eventOrganizerId: string | null;
    creatorId: string | null;
    eventTemplateId: string | null;
  };

  export type TumiEventCountAggregateOutputType = {
    id: number;
    createdAt: number;
    title: number;
    icon: number;
    start: number;
    end: number;
    description: number;
    location: number;
    locationId: number;
    participantText: number;
    participantMail: number;
    organizerText: number;
    participantLimit: number;
    organizerLimit: number;
    price: number;
    registrationLink: number;
    registrationMode: number;
    publicationState: number;
    participantSignup: number;
    organizerSignup: number;
    eventOrganizerId: number;
    creatorId: number;
    eventTemplateId: number;
    _all: number;
  };

  export type TumiEventAvgAggregateInputType = {
    participantLimit?: true;
    organizerLimit?: true;
    price?: true;
  };

  export type TumiEventSumAggregateInputType = {
    participantLimit?: true;
    organizerLimit?: true;
    price?: true;
  };

  export type TumiEventMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    title?: true;
    icon?: true;
    start?: true;
    end?: true;
    description?: true;
    location?: true;
    locationId?: true;
    participantText?: true;
    participantMail?: true;
    organizerText?: true;
    participantLimit?: true;
    organizerLimit?: true;
    price?: true;
    registrationLink?: true;
    registrationMode?: true;
    publicationState?: true;
    eventOrganizerId?: true;
    creatorId?: true;
    eventTemplateId?: true;
  };

  export type TumiEventMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    title?: true;
    icon?: true;
    start?: true;
    end?: true;
    description?: true;
    location?: true;
    locationId?: true;
    participantText?: true;
    participantMail?: true;
    organizerText?: true;
    participantLimit?: true;
    organizerLimit?: true;
    price?: true;
    registrationLink?: true;
    registrationMode?: true;
    publicationState?: true;
    eventOrganizerId?: true;
    creatorId?: true;
    eventTemplateId?: true;
  };

  export type TumiEventCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    title?: true;
    icon?: true;
    start?: true;
    end?: true;
    description?: true;
    location?: true;
    locationId?: true;
    participantText?: true;
    participantMail?: true;
    organizerText?: true;
    participantLimit?: true;
    organizerLimit?: true;
    price?: true;
    registrationLink?: true;
    registrationMode?: true;
    publicationState?: true;
    participantSignup?: true;
    organizerSignup?: true;
    eventOrganizerId?: true;
    creatorId?: true;
    eventTemplateId?: true;
    _all?: true;
  };

  export type TumiEventAggregateArgs = {
    /**
     * Filter which TumiEvent to aggregate.
     *
     **/
    where?: TumiEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TumiEvents to fetch.
     *
     **/
    orderBy?: Enumerable<TumiEventOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: TumiEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TumiEvents from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TumiEvents.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TumiEvents
     **/
    _count?: true | TumiEventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TumiEventAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TumiEventSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TumiEventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TumiEventMaxAggregateInputType;
  };

  export type GetTumiEventAggregateType<T extends TumiEventAggregateArgs> = {
    [P in keyof T & keyof AggregateTumiEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTumiEvent[P]>
      : GetScalarType<T[P], AggregateTumiEvent[P]>;
  };

  export type TumiEventGroupByArgs = {
    where?: TumiEventWhereInput;
    orderBy?: Enumerable<TumiEventOrderByWithAggregationInput>;
    by: Array<TumiEventScalarFieldEnum>;
    having?: TumiEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TumiEventCountAggregateInputType | true;
    _avg?: TumiEventAvgAggregateInputType;
    _sum?: TumiEventSumAggregateInputType;
    _min?: TumiEventMinAggregateInputType;
    _max?: TumiEventMaxAggregateInputType;
  };

  export type TumiEventGroupByOutputType = {
    id: string;
    createdAt: Date;
    title: string;
    icon: string;
    start: Date;
    end: Date;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price: Decimal | null;
    registrationLink: string | null;
    registrationMode: RegistrationMode;
    publicationState: PublicationState;
    participantSignup: MembershipStatus[];
    organizerSignup: MembershipStatus[];
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    _count: TumiEventCountAggregateOutputType | null;
    _avg: TumiEventAvgAggregateOutputType | null;
    _sum: TumiEventSumAggregateOutputType | null;
    _min: TumiEventMinAggregateOutputType | null;
    _max: TumiEventMaxAggregateOutputType | null;
  };

  type GetTumiEventGroupByPayload<T extends TumiEventGroupByArgs> = Promise<
    Array<
      PickArray<TumiEventGroupByOutputType, T['by']> &
        {
          [P in keyof T & keyof TumiEventGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TumiEventGroupByOutputType[P]>
            : GetScalarType<T[P], TumiEventGroupByOutputType[P]>;
        }
    >
  >;

  export type TumiEventSelect = {
    id?: boolean;
    createdAt?: boolean;
    title?: boolean;
    icon?: boolean;
    start?: boolean;
    end?: boolean;
    description?: boolean;
    location?: boolean;
    locationId?: boolean;
    participantText?: boolean;
    participantMail?: boolean;
    organizerText?: boolean;
    participantLimit?: boolean;
    organizerLimit?: boolean;
    price?: boolean;
    registrationLink?: boolean;
    registrationMode?: boolean;
    publicationState?: boolean;
    participantSignup?: boolean;
    organizerSignup?: boolean;
    submissionItems?: boolean | EventSubmissionItemFindManyArgs;
    registrations?: boolean | EventRegistrationFindManyArgs;
    costItems?: boolean | CostItemFindManyArgs;
    photoShare?: boolean | PhotoShareArgs;
    organizer?: boolean | EventOrganizerArgs;
    eventOrganizerId?: boolean;
    createdBy?: boolean | UserArgs;
    creatorId?: boolean;
    eventTemplate?: boolean | EventTemplateArgs;
    eventTemplateId?: boolean;
    _count?: boolean | TumiEventCountOutputTypeArgs;
  };

  export type TumiEventInclude = {
    submissionItems?: boolean | EventSubmissionItemFindManyArgs;
    registrations?: boolean | EventRegistrationFindManyArgs;
    costItems?: boolean | CostItemFindManyArgs;
    photoShare?: boolean | PhotoShareArgs;
    organizer?: boolean | EventOrganizerArgs;
    createdBy?: boolean | UserArgs;
    eventTemplate?: boolean | EventTemplateArgs;
    _count?: boolean | TumiEventCountOutputTypeArgs;
  };

  export type TumiEventGetPayload<
    S extends boolean | null | undefined | TumiEventArgs,
    U = keyof S
  > = S extends true
    ? TumiEvent
    : S extends undefined
    ? never
    : S extends TumiEventArgs | TumiEventFindManyArgs
    ? 'include' extends U
      ? TumiEvent &
          {
            [P in TrueKeys<S['include']>]: P extends 'submissionItems'
              ? Array<EventSubmissionItemGetPayload<S['include'][P]>>
              : P extends 'registrations'
              ? Array<EventRegistrationGetPayload<S['include'][P]>>
              : P extends 'costItems'
              ? Array<CostItemGetPayload<S['include'][P]>>
              : P extends 'photoShare'
              ? PhotoShareGetPayload<S['include'][P]> | null
              : P extends 'organizer'
              ? EventOrganizerGetPayload<S['include'][P]>
              : P extends 'createdBy'
              ? UserGetPayload<S['include'][P]>
              : P extends 'eventTemplate'
              ? EventTemplateGetPayload<S['include'][P]>
              : P extends '_count'
              ? TumiEventCountOutputTypeGetPayload<S['include'][P]> | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof TumiEvent
            ? TumiEvent[P]
            : P extends 'submissionItems'
            ? Array<EventSubmissionItemGetPayload<S['select'][P]>>
            : P extends 'registrations'
            ? Array<EventRegistrationGetPayload<S['select'][P]>>
            : P extends 'costItems'
            ? Array<CostItemGetPayload<S['select'][P]>>
            : P extends 'photoShare'
            ? PhotoShareGetPayload<S['select'][P]> | null
            : P extends 'organizer'
            ? EventOrganizerGetPayload<S['select'][P]>
            : P extends 'createdBy'
            ? UserGetPayload<S['select'][P]>
            : P extends 'eventTemplate'
            ? EventTemplateGetPayload<S['select'][P]>
            : P extends '_count'
            ? TumiEventCountOutputTypeGetPayload<S['select'][P]> | null
            : never;
        }
      : TumiEvent
    : TumiEvent;

  type TumiEventCountArgs = Merge<
    Omit<TumiEventFindManyArgs, 'select' | 'include'> & {
      select?: TumiEventCountAggregateInputType | true;
    }
  >;

  export interface TumiEventDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TumiEvent that matches the filter.
     * @param {TumiEventFindUniqueArgs} args - Arguments to find a TumiEvent
     * @example
     * // Get one TumiEvent
     * const tumiEvent = await prisma.tumiEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends TumiEventFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, TumiEventFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'TumiEvent'
    > extends True
      ? CheckSelect<
          T,
          Prisma__TumiEventClient<TumiEvent>,
          Prisma__TumiEventClient<TumiEventGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__TumiEventClient<TumiEvent | null>,
          Prisma__TumiEventClient<TumiEventGetPayload<T> | null>
        >;

    /**
     * Find the first TumiEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumiEventFindFirstArgs} args - Arguments to find a TumiEvent
     * @example
     * // Get one TumiEvent
     * const tumiEvent = await prisma.tumiEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends TumiEventFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, TumiEventFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'TumiEvent'
    > extends True
      ? CheckSelect<
          T,
          Prisma__TumiEventClient<TumiEvent>,
          Prisma__TumiEventClient<TumiEventGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__TumiEventClient<TumiEvent | null>,
          Prisma__TumiEventClient<TumiEventGetPayload<T> | null>
        >;

    /**
     * Find zero or more TumiEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumiEventFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TumiEvents
     * const tumiEvents = await prisma.tumiEvent.findMany()
     *
     * // Get first 10 TumiEvents
     * const tumiEvents = await prisma.tumiEvent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tumiEventWithIdOnly = await prisma.tumiEvent.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends TumiEventFindManyArgs>(
      args?: SelectSubset<T, TumiEventFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<TumiEvent>>,
      PrismaPromise<Array<TumiEventGetPayload<T>>>
    >;

    /**
     * Create a TumiEvent.
     * @param {TumiEventCreateArgs} args - Arguments to create a TumiEvent.
     * @example
     * // Create one TumiEvent
     * const TumiEvent = await prisma.tumiEvent.create({
     *   data: {
     *     // ... data to create a TumiEvent
     *   }
     * })
     *
     **/
    create<T extends TumiEventCreateArgs>(
      args: SelectSubset<T, TumiEventCreateArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent>,
      Prisma__TumiEventClient<TumiEventGetPayload<T>>
    >;

    /**
     * Create many TumiEvents.
     *     @param {TumiEventCreateManyArgs} args - Arguments to create many TumiEvents.
     *     @example
     *     // Create many TumiEvents
     *     const tumiEvent = await prisma.tumiEvent.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends TumiEventCreateManyArgs>(
      args?: SelectSubset<T, TumiEventCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a TumiEvent.
     * @param {TumiEventDeleteArgs} args - Arguments to delete one TumiEvent.
     * @example
     * // Delete one TumiEvent
     * const TumiEvent = await prisma.tumiEvent.delete({
     *   where: {
     *     // ... filter to delete one TumiEvent
     *   }
     * })
     *
     **/
    delete<T extends TumiEventDeleteArgs>(
      args: SelectSubset<T, TumiEventDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent>,
      Prisma__TumiEventClient<TumiEventGetPayload<T>>
    >;

    /**
     * Update one TumiEvent.
     * @param {TumiEventUpdateArgs} args - Arguments to update one TumiEvent.
     * @example
     * // Update one TumiEvent
     * const tumiEvent = await prisma.tumiEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends TumiEventUpdateArgs>(
      args: SelectSubset<T, TumiEventUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent>,
      Prisma__TumiEventClient<TumiEventGetPayload<T>>
    >;

    /**
     * Delete zero or more TumiEvents.
     * @param {TumiEventDeleteManyArgs} args - Arguments to filter TumiEvents to delete.
     * @example
     * // Delete a few TumiEvents
     * const { count } = await prisma.tumiEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends TumiEventDeleteManyArgs>(
      args?: SelectSubset<T, TumiEventDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more TumiEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumiEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TumiEvents
     * const tumiEvent = await prisma.tumiEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends TumiEventUpdateManyArgs>(
      args: SelectSubset<T, TumiEventUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one TumiEvent.
     * @param {TumiEventUpsertArgs} args - Arguments to update or create a TumiEvent.
     * @example
     * // Update or create a TumiEvent
     * const tumiEvent = await prisma.tumiEvent.upsert({
     *   create: {
     *     // ... data to create a TumiEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TumiEvent we want to update
     *   }
     * })
     **/
    upsert<T extends TumiEventUpsertArgs>(
      args: SelectSubset<T, TumiEventUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent>,
      Prisma__TumiEventClient<TumiEventGetPayload<T>>
    >;

    /**
     * Count the number of TumiEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumiEventCountArgs} args - Arguments to filter TumiEvents to count.
     * @example
     * // Count the number of TumiEvents
     * const count = await prisma.tumiEvent.count({
     *   where: {
     *     // ... the filter for the TumiEvents we want to count
     *   }
     * })
     **/
    count<T extends TumiEventCountArgs>(
      args?: Subset<T, TumiEventCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TumiEventCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a TumiEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumiEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TumiEventAggregateArgs>(
      args: Subset<T, TumiEventAggregateArgs>
    ): PrismaPromise<GetTumiEventAggregateType<T>>;

    /**
     * Group by TumiEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumiEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TumiEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TumiEventGroupByArgs['orderBy'] }
        : { orderBy?: TumiEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, TumiEventGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetTumiEventGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TumiEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TumiEventClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    submissionItems<T extends EventSubmissionItemFindManyArgs = {}>(
      args?: Subset<T, EventSubmissionItemFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventSubmissionItem>>,
      PrismaPromise<Array<EventSubmissionItemGetPayload<T>>>
    >;

    registrations<T extends EventRegistrationFindManyArgs = {}>(
      args?: Subset<T, EventRegistrationFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventRegistration>>,
      PrismaPromise<Array<EventRegistrationGetPayload<T>>>
    >;

    costItems<T extends CostItemFindManyArgs = {}>(
      args?: Subset<T, CostItemFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<CostItem>>,
      PrismaPromise<Array<CostItemGetPayload<T>>>
    >;

    photoShare<T extends PhotoShareArgs = {}>(
      args?: Subset<T, PhotoShareArgs>
    ): CheckSelect<
      T,
      Prisma__PhotoShareClient<PhotoShare | null>,
      Prisma__PhotoShareClient<PhotoShareGetPayload<T> | null>
    >;

    organizer<T extends EventOrganizerArgs = {}>(
      args?: Subset<T, EventOrganizerArgs>
    ): CheckSelect<
      T,
      Prisma__EventOrganizerClient<EventOrganizer | null>,
      Prisma__EventOrganizerClient<EventOrganizerGetPayload<T> | null>
    >;

    createdBy<T extends UserArgs = {}>(
      args?: Subset<T, UserArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User | null>,
      Prisma__UserClient<UserGetPayload<T> | null>
    >;

    eventTemplate<T extends EventTemplateArgs = {}>(
      args?: Subset<T, EventTemplateArgs>
    ): CheckSelect<
      T,
      Prisma__EventTemplateClient<EventTemplate | null>,
      Prisma__EventTemplateClient<EventTemplateGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TumiEvent findUnique
   */
  export type TumiEventFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * Throw an Error if a TumiEvent can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which TumiEvent to fetch.
     *
     **/
    where: TumiEventWhereUniqueInput;
  };

  /**
   * TumiEvent findFirst
   */
  export type TumiEventFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * Throw an Error if a TumiEvent can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which TumiEvent to fetch.
     *
     **/
    where?: TumiEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TumiEvents to fetch.
     *
     **/
    orderBy?: Enumerable<TumiEventOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TumiEvents.
     *
     **/
    cursor?: TumiEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TumiEvents from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TumiEvents.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TumiEvents.
     *
     **/
    distinct?: Enumerable<TumiEventScalarFieldEnum>;
  };

  /**
   * TumiEvent findMany
   */
  export type TumiEventFindManyArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * Filter, which TumiEvents to fetch.
     *
     **/
    where?: TumiEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TumiEvents to fetch.
     *
     **/
    orderBy?: Enumerable<TumiEventOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TumiEvents.
     *
     **/
    cursor?: TumiEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TumiEvents from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TumiEvents.
     *
     **/
    skip?: number;
    distinct?: Enumerable<TumiEventScalarFieldEnum>;
  };

  /**
   * TumiEvent create
   */
  export type TumiEventCreateArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * The data needed to create a TumiEvent.
     *
     **/
    data: XOR<TumiEventCreateInput, TumiEventUncheckedCreateInput>;
  };

  /**
   * TumiEvent createMany
   */
  export type TumiEventCreateManyArgs = {
    data: Enumerable<TumiEventCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * TumiEvent update
   */
  export type TumiEventUpdateArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * The data needed to update a TumiEvent.
     *
     **/
    data: XOR<TumiEventUpdateInput, TumiEventUncheckedUpdateInput>;
    /**
     * Choose, which TumiEvent to update.
     *
     **/
    where: TumiEventWhereUniqueInput;
  };

  /**
   * TumiEvent updateMany
   */
  export type TumiEventUpdateManyArgs = {
    data: XOR<
      TumiEventUpdateManyMutationInput,
      TumiEventUncheckedUpdateManyInput
    >;
    where?: TumiEventWhereInput;
  };

  /**
   * TumiEvent upsert
   */
  export type TumiEventUpsertArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * The filter to search for the TumiEvent to update in case it exists.
     *
     **/
    where: TumiEventWhereUniqueInput;
    /**
     * In case the TumiEvent found by the `where` argument doesn't exist, create a new TumiEvent with this data.
     *
     **/
    create: XOR<TumiEventCreateInput, TumiEventUncheckedCreateInput>;
    /**
     * In case the TumiEvent was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<TumiEventUpdateInput, TumiEventUncheckedUpdateInput>;
  };

  /**
   * TumiEvent delete
   */
  export type TumiEventDeleteArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
    /**
     * Filter which TumiEvent to delete.
     *
     **/
    where: TumiEventWhereUniqueInput;
  };

  /**
   * TumiEvent deleteMany
   */
  export type TumiEventDeleteManyArgs = {
    where?: TumiEventWhereInput;
  };

  /**
   * TumiEvent without action
   */
  export type TumiEventArgs = {
    /**
     * Select specific fields to fetch from the TumiEvent
     *
     **/
    select?: TumiEventSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TumiEventInclude | null;
  };

  /**
   * Model CostItem
   */

  export type AggregateCostItem = {
    _count: CostItemCountAggregateOutputType | null;
    _avg: CostItemAvgAggregateOutputType | null;
    _sum: CostItemSumAggregateOutputType | null;
    _min: CostItemMinAggregateOutputType | null;
    _max: CostItemMaxAggregateOutputType | null;
  };

  export type CostItemAvgAggregateOutputType = {
    ammount: Decimal | null;
  };

  export type CostItemSumAggregateOutputType = {
    ammount: Decimal | null;
  };

  export type CostItemMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    eventId: string | null;
    name: string | null;
    ammount: Decimal | null;
  };

  export type CostItemMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    eventId: string | null;
    name: string | null;
    ammount: Decimal | null;
  };

  export type CostItemCountAggregateOutputType = {
    id: number;
    createdAt: number;
    eventId: number;
    name: number;
    ammount: number;
    _all: number;
  };

  export type CostItemAvgAggregateInputType = {
    ammount?: true;
  };

  export type CostItemSumAggregateInputType = {
    ammount?: true;
  };

  export type CostItemMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    name?: true;
    ammount?: true;
  };

  export type CostItemMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    name?: true;
    ammount?: true;
  };

  export type CostItemCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    name?: true;
    ammount?: true;
    _all?: true;
  };

  export type CostItemAggregateArgs = {
    /**
     * Filter which CostItem to aggregate.
     *
     **/
    where?: CostItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CostItems to fetch.
     *
     **/
    orderBy?: Enumerable<CostItemOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: CostItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CostItems from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CostItems.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned CostItems
     **/
    _count?: true | CostItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: CostItemAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: CostItemSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CostItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CostItemMaxAggregateInputType;
  };

  export type GetCostItemAggregateType<T extends CostItemAggregateArgs> = {
    [P in keyof T & keyof AggregateCostItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCostItem[P]>
      : GetScalarType<T[P], AggregateCostItem[P]>;
  };

  export type CostItemGroupByArgs = {
    where?: CostItemWhereInput;
    orderBy?: Enumerable<CostItemOrderByWithAggregationInput>;
    by: Array<CostItemScalarFieldEnum>;
    having?: CostItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CostItemCountAggregateInputType | true;
    _avg?: CostItemAvgAggregateInputType;
    _sum?: CostItemSumAggregateInputType;
    _min?: CostItemMinAggregateInputType;
    _max?: CostItemMaxAggregateInputType;
  };

  export type CostItemGroupByOutputType = {
    id: string;
    createdAt: Date;
    eventId: string;
    name: string;
    ammount: Decimal;
    _count: CostItemCountAggregateOutputType | null;
    _avg: CostItemAvgAggregateOutputType | null;
    _sum: CostItemSumAggregateOutputType | null;
    _min: CostItemMinAggregateOutputType | null;
    _max: CostItemMaxAggregateOutputType | null;
  };

  type GetCostItemGroupByPayload<T extends CostItemGroupByArgs> = Promise<
    Array<
      PickArray<CostItemGroupByOutputType, T['by']> &
        {
          [P in keyof T & keyof CostItemGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CostItemGroupByOutputType[P]>
            : GetScalarType<T[P], CostItemGroupByOutputType[P]>;
        }
    >
  >;

  export type CostItemSelect = {
    id?: boolean;
    createdAt?: boolean;
    event?: boolean | TumiEventArgs;
    eventId?: boolean;
    name?: boolean;
    ammount?: boolean;
    receipts?: boolean | ReceiptFindManyArgs;
    _count?: boolean | CostItemCountOutputTypeArgs;
  };

  export type CostItemInclude = {
    event?: boolean | TumiEventArgs;
    receipts?: boolean | ReceiptFindManyArgs;
    _count?: boolean | CostItemCountOutputTypeArgs;
  };

  export type CostItemGetPayload<
    S extends boolean | null | undefined | CostItemArgs,
    U = keyof S
  > = S extends true
    ? CostItem
    : S extends undefined
    ? never
    : S extends CostItemArgs | CostItemFindManyArgs
    ? 'include' extends U
      ? CostItem &
          {
            [P in TrueKeys<S['include']>]: P extends 'event'
              ? TumiEventGetPayload<S['include'][P]>
              : P extends 'receipts'
              ? Array<ReceiptGetPayload<S['include'][P]>>
              : P extends '_count'
              ? CostItemCountOutputTypeGetPayload<S['include'][P]> | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof CostItem
            ? CostItem[P]
            : P extends 'event'
            ? TumiEventGetPayload<S['select'][P]>
            : P extends 'receipts'
            ? Array<ReceiptGetPayload<S['select'][P]>>
            : P extends '_count'
            ? CostItemCountOutputTypeGetPayload<S['select'][P]> | null
            : never;
        }
      : CostItem
    : CostItem;

  type CostItemCountArgs = Merge<
    Omit<CostItemFindManyArgs, 'select' | 'include'> & {
      select?: CostItemCountAggregateInputType | true;
    }
  >;

  export interface CostItemDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one CostItem that matches the filter.
     * @param {CostItemFindUniqueArgs} args - Arguments to find a CostItem
     * @example
     * // Get one CostItem
     * const costItem = await prisma.costItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends CostItemFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, CostItemFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'CostItem'
    > extends True
      ? CheckSelect<
          T,
          Prisma__CostItemClient<CostItem>,
          Prisma__CostItemClient<CostItemGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__CostItemClient<CostItem | null>,
          Prisma__CostItemClient<CostItemGetPayload<T> | null>
        >;

    /**
     * Find the first CostItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CostItemFindFirstArgs} args - Arguments to find a CostItem
     * @example
     * // Get one CostItem
     * const costItem = await prisma.costItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends CostItemFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, CostItemFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'CostItem'
    > extends True
      ? CheckSelect<
          T,
          Prisma__CostItemClient<CostItem>,
          Prisma__CostItemClient<CostItemGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__CostItemClient<CostItem | null>,
          Prisma__CostItemClient<CostItemGetPayload<T> | null>
        >;

    /**
     * Find zero or more CostItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CostItemFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CostItems
     * const costItems = await prisma.costItem.findMany()
     *
     * // Get first 10 CostItems
     * const costItems = await prisma.costItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const costItemWithIdOnly = await prisma.costItem.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends CostItemFindManyArgs>(
      args?: SelectSubset<T, CostItemFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<CostItem>>,
      PrismaPromise<Array<CostItemGetPayload<T>>>
    >;

    /**
     * Create a CostItem.
     * @param {CostItemCreateArgs} args - Arguments to create a CostItem.
     * @example
     * // Create one CostItem
     * const CostItem = await prisma.costItem.create({
     *   data: {
     *     // ... data to create a CostItem
     *   }
     * })
     *
     **/
    create<T extends CostItemCreateArgs>(
      args: SelectSubset<T, CostItemCreateArgs>
    ): CheckSelect<
      T,
      Prisma__CostItemClient<CostItem>,
      Prisma__CostItemClient<CostItemGetPayload<T>>
    >;

    /**
     * Create many CostItems.
     *     @param {CostItemCreateManyArgs} args - Arguments to create many CostItems.
     *     @example
     *     // Create many CostItems
     *     const costItem = await prisma.costItem.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends CostItemCreateManyArgs>(
      args?: SelectSubset<T, CostItemCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a CostItem.
     * @param {CostItemDeleteArgs} args - Arguments to delete one CostItem.
     * @example
     * // Delete one CostItem
     * const CostItem = await prisma.costItem.delete({
     *   where: {
     *     // ... filter to delete one CostItem
     *   }
     * })
     *
     **/
    delete<T extends CostItemDeleteArgs>(
      args: SelectSubset<T, CostItemDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__CostItemClient<CostItem>,
      Prisma__CostItemClient<CostItemGetPayload<T>>
    >;

    /**
     * Update one CostItem.
     * @param {CostItemUpdateArgs} args - Arguments to update one CostItem.
     * @example
     * // Update one CostItem
     * const costItem = await prisma.costItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends CostItemUpdateArgs>(
      args: SelectSubset<T, CostItemUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__CostItemClient<CostItem>,
      Prisma__CostItemClient<CostItemGetPayload<T>>
    >;

    /**
     * Delete zero or more CostItems.
     * @param {CostItemDeleteManyArgs} args - Arguments to filter CostItems to delete.
     * @example
     * // Delete a few CostItems
     * const { count } = await prisma.costItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends CostItemDeleteManyArgs>(
      args?: SelectSubset<T, CostItemDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more CostItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CostItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CostItems
     * const costItem = await prisma.costItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends CostItemUpdateManyArgs>(
      args: SelectSubset<T, CostItemUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one CostItem.
     * @param {CostItemUpsertArgs} args - Arguments to update or create a CostItem.
     * @example
     * // Update or create a CostItem
     * const costItem = await prisma.costItem.upsert({
     *   create: {
     *     // ... data to create a CostItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CostItem we want to update
     *   }
     * })
     **/
    upsert<T extends CostItemUpsertArgs>(
      args: SelectSubset<T, CostItemUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__CostItemClient<CostItem>,
      Prisma__CostItemClient<CostItemGetPayload<T>>
    >;

    /**
     * Count the number of CostItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CostItemCountArgs} args - Arguments to filter CostItems to count.
     * @example
     * // Count the number of CostItems
     * const count = await prisma.costItem.count({
     *   where: {
     *     // ... the filter for the CostItems we want to count
     *   }
     * })
     **/
    count<T extends CostItemCountArgs>(
      args?: Subset<T, CostItemCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CostItemCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a CostItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CostItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CostItemAggregateArgs>(
      args: Subset<T, CostItemAggregateArgs>
    ): PrismaPromise<GetCostItemAggregateType<T>>;

    /**
     * Group by CostItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CostItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CostItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CostItemGroupByArgs['orderBy'] }
        : { orderBy?: CostItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, CostItemGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetCostItemGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CostItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__CostItemClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    event<T extends TumiEventArgs = {}>(
      args?: Subset<T, TumiEventArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent | null>,
      Prisma__TumiEventClient<TumiEventGetPayload<T> | null>
    >;

    receipts<T extends ReceiptFindManyArgs = {}>(
      args?: Subset<T, ReceiptFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<Receipt>>,
      PrismaPromise<Array<ReceiptGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * CostItem findUnique
   */
  export type CostItemFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * Throw an Error if a CostItem can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which CostItem to fetch.
     *
     **/
    where: CostItemWhereUniqueInput;
  };

  /**
   * CostItem findFirst
   */
  export type CostItemFindFirstArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * Throw an Error if a CostItem can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which CostItem to fetch.
     *
     **/
    where?: CostItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CostItems to fetch.
     *
     **/
    orderBy?: Enumerable<CostItemOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CostItems.
     *
     **/
    cursor?: CostItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CostItems from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CostItems.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CostItems.
     *
     **/
    distinct?: Enumerable<CostItemScalarFieldEnum>;
  };

  /**
   * CostItem findMany
   */
  export type CostItemFindManyArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * Filter, which CostItems to fetch.
     *
     **/
    where?: CostItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CostItems to fetch.
     *
     **/
    orderBy?: Enumerable<CostItemOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing CostItems.
     *
     **/
    cursor?: CostItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CostItems from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CostItems.
     *
     **/
    skip?: number;
    distinct?: Enumerable<CostItemScalarFieldEnum>;
  };

  /**
   * CostItem create
   */
  export type CostItemCreateArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * The data needed to create a CostItem.
     *
     **/
    data: XOR<CostItemCreateInput, CostItemUncheckedCreateInput>;
  };

  /**
   * CostItem createMany
   */
  export type CostItemCreateManyArgs = {
    data: Enumerable<CostItemCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * CostItem update
   */
  export type CostItemUpdateArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * The data needed to update a CostItem.
     *
     **/
    data: XOR<CostItemUpdateInput, CostItemUncheckedUpdateInput>;
    /**
     * Choose, which CostItem to update.
     *
     **/
    where: CostItemWhereUniqueInput;
  };

  /**
   * CostItem updateMany
   */
  export type CostItemUpdateManyArgs = {
    data: XOR<
      CostItemUpdateManyMutationInput,
      CostItemUncheckedUpdateManyInput
    >;
    where?: CostItemWhereInput;
  };

  /**
   * CostItem upsert
   */
  export type CostItemUpsertArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * The filter to search for the CostItem to update in case it exists.
     *
     **/
    where: CostItemWhereUniqueInput;
    /**
     * In case the CostItem found by the `where` argument doesn't exist, create a new CostItem with this data.
     *
     **/
    create: XOR<CostItemCreateInput, CostItemUncheckedCreateInput>;
    /**
     * In case the CostItem was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<CostItemUpdateInput, CostItemUncheckedUpdateInput>;
  };

  /**
   * CostItem delete
   */
  export type CostItemDeleteArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
    /**
     * Filter which CostItem to delete.
     *
     **/
    where: CostItemWhereUniqueInput;
  };

  /**
   * CostItem deleteMany
   */
  export type CostItemDeleteManyArgs = {
    where?: CostItemWhereInput;
  };

  /**
   * CostItem without action
   */
  export type CostItemArgs = {
    /**
     * Select specific fields to fetch from the CostItem
     *
     **/
    select?: CostItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: CostItemInclude | null;
  };

  /**
   * Model Receipt
   */

  export type AggregateReceipt = {
    _count: ReceiptCountAggregateOutputType | null;
    _avg: ReceiptAvgAggregateOutputType | null;
    _sum: ReceiptSumAggregateOutputType | null;
    _min: ReceiptMinAggregateOutputType | null;
    _max: ReceiptMaxAggregateOutputType | null;
  };

  export type ReceiptAvgAggregateOutputType = {
    amount: number | null;
    amountCovered: number | null;
  };

  export type ReceiptSumAggregateOutputType = {
    amount: number | null;
    amountCovered: number | null;
  };

  export type ReceiptMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    userId: string | null;
    costItemId: string | null;
    covered: boolean | null;
    amount: number | null;
    date: Date | null;
    amountCovered: number | null;
  };

  export type ReceiptMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    userId: string | null;
    costItemId: string | null;
    covered: boolean | null;
    amount: number | null;
    date: Date | null;
    amountCovered: number | null;
  };

  export type ReceiptCountAggregateOutputType = {
    id: number;
    createdAt: number;
    userId: number;
    costItemId: number;
    covered: number;
    amount: number;
    date: number;
    amountCovered: number;
    _all: number;
  };

  export type ReceiptAvgAggregateInputType = {
    amount?: true;
    amountCovered?: true;
  };

  export type ReceiptSumAggregateInputType = {
    amount?: true;
    amountCovered?: true;
  };

  export type ReceiptMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    userId?: true;
    costItemId?: true;
    covered?: true;
    amount?: true;
    date?: true;
    amountCovered?: true;
  };

  export type ReceiptMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    userId?: true;
    costItemId?: true;
    covered?: true;
    amount?: true;
    date?: true;
    amountCovered?: true;
  };

  export type ReceiptCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    userId?: true;
    costItemId?: true;
    covered?: true;
    amount?: true;
    date?: true;
    amountCovered?: true;
    _all?: true;
  };

  export type ReceiptAggregateArgs = {
    /**
     * Filter which Receipt to aggregate.
     *
     **/
    where?: ReceiptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Receipts to fetch.
     *
     **/
    orderBy?: Enumerable<ReceiptOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: ReceiptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Receipts from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Receipts.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Receipts
     **/
    _count?: true | ReceiptCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ReceiptAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ReceiptSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ReceiptMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ReceiptMaxAggregateInputType;
  };

  export type GetReceiptAggregateType<T extends ReceiptAggregateArgs> = {
    [P in keyof T & keyof AggregateReceipt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceipt[P]>
      : GetScalarType<T[P], AggregateReceipt[P]>;
  };

  export type ReceiptGroupByArgs = {
    where?: ReceiptWhereInput;
    orderBy?: Enumerable<ReceiptOrderByWithAggregationInput>;
    by: Array<ReceiptScalarFieldEnum>;
    having?: ReceiptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReceiptCountAggregateInputType | true;
    _avg?: ReceiptAvgAggregateInputType;
    _sum?: ReceiptSumAggregateInputType;
    _min?: ReceiptMinAggregateInputType;
    _max?: ReceiptMaxAggregateInputType;
  };

  export type ReceiptGroupByOutputType = {
    id: string;
    createdAt: Date;
    userId: string;
    costItemId: string;
    covered: boolean;
    amount: number;
    date: Date;
    amountCovered: number;
    _count: ReceiptCountAggregateOutputType | null;
    _avg: ReceiptAvgAggregateOutputType | null;
    _sum: ReceiptSumAggregateOutputType | null;
    _min: ReceiptMinAggregateOutputType | null;
    _max: ReceiptMaxAggregateOutputType | null;
  };

  type GetReceiptGroupByPayload<T extends ReceiptGroupByArgs> = Promise<
    Array<
      PickArray<ReceiptGroupByOutputType, T['by']> &
        {
          [P in keyof T & keyof ReceiptGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReceiptGroupByOutputType[P]>
            : GetScalarType<T[P], ReceiptGroupByOutputType[P]>;
        }
    >
  >;

  export type ReceiptSelect = {
    id?: boolean;
    createdAt?: boolean;
    user?: boolean | UserArgs;
    userId?: boolean;
    costItem?: boolean | CostItemArgs;
    costItemId?: boolean;
    covered?: boolean;
    amount?: boolean;
    date?: boolean;
    amountCovered?: boolean;
  };

  export type ReceiptInclude = {
    user?: boolean | UserArgs;
    costItem?: boolean | CostItemArgs;
  };

  export type ReceiptGetPayload<
    S extends boolean | null | undefined | ReceiptArgs,
    U = keyof S
  > = S extends true
    ? Receipt
    : S extends undefined
    ? never
    : S extends ReceiptArgs | ReceiptFindManyArgs
    ? 'include' extends U
      ? Receipt &
          {
            [P in TrueKeys<S['include']>]: P extends 'user'
              ? UserGetPayload<S['include'][P]>
              : P extends 'costItem'
              ? CostItemGetPayload<S['include'][P]>
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof Receipt
            ? Receipt[P]
            : P extends 'user'
            ? UserGetPayload<S['select'][P]>
            : P extends 'costItem'
            ? CostItemGetPayload<S['select'][P]>
            : never;
        }
      : Receipt
    : Receipt;

  type ReceiptCountArgs = Merge<
    Omit<ReceiptFindManyArgs, 'select' | 'include'> & {
      select?: ReceiptCountAggregateInputType | true;
    }
  >;

  export interface ReceiptDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Receipt that matches the filter.
     * @param {ReceiptFindUniqueArgs} args - Arguments to find a Receipt
     * @example
     * // Get one Receipt
     * const receipt = await prisma.receipt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends ReceiptFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, ReceiptFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'Receipt'
    > extends True
      ? CheckSelect<
          T,
          Prisma__ReceiptClient<Receipt>,
          Prisma__ReceiptClient<ReceiptGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__ReceiptClient<Receipt | null>,
          Prisma__ReceiptClient<ReceiptGetPayload<T> | null>
        >;

    /**
     * Find the first Receipt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptFindFirstArgs} args - Arguments to find a Receipt
     * @example
     * // Get one Receipt
     * const receipt = await prisma.receipt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends ReceiptFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, ReceiptFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'Receipt'
    > extends True
      ? CheckSelect<
          T,
          Prisma__ReceiptClient<Receipt>,
          Prisma__ReceiptClient<ReceiptGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__ReceiptClient<Receipt | null>,
          Prisma__ReceiptClient<ReceiptGetPayload<T> | null>
        >;

    /**
     * Find zero or more Receipts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Receipts
     * const receipts = await prisma.receipt.findMany()
     *
     * // Get first 10 Receipts
     * const receipts = await prisma.receipt.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const receiptWithIdOnly = await prisma.receipt.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends ReceiptFindManyArgs>(
      args?: SelectSubset<T, ReceiptFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<Receipt>>,
      PrismaPromise<Array<ReceiptGetPayload<T>>>
    >;

    /**
     * Create a Receipt.
     * @param {ReceiptCreateArgs} args - Arguments to create a Receipt.
     * @example
     * // Create one Receipt
     * const Receipt = await prisma.receipt.create({
     *   data: {
     *     // ... data to create a Receipt
     *   }
     * })
     *
     **/
    create<T extends ReceiptCreateArgs>(
      args: SelectSubset<T, ReceiptCreateArgs>
    ): CheckSelect<
      T,
      Prisma__ReceiptClient<Receipt>,
      Prisma__ReceiptClient<ReceiptGetPayload<T>>
    >;

    /**
     * Create many Receipts.
     *     @param {ReceiptCreateManyArgs} args - Arguments to create many Receipts.
     *     @example
     *     // Create many Receipts
     *     const receipt = await prisma.receipt.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends ReceiptCreateManyArgs>(
      args?: SelectSubset<T, ReceiptCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Receipt.
     * @param {ReceiptDeleteArgs} args - Arguments to delete one Receipt.
     * @example
     * // Delete one Receipt
     * const Receipt = await prisma.receipt.delete({
     *   where: {
     *     // ... filter to delete one Receipt
     *   }
     * })
     *
     **/
    delete<T extends ReceiptDeleteArgs>(
      args: SelectSubset<T, ReceiptDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__ReceiptClient<Receipt>,
      Prisma__ReceiptClient<ReceiptGetPayload<T>>
    >;

    /**
     * Update one Receipt.
     * @param {ReceiptUpdateArgs} args - Arguments to update one Receipt.
     * @example
     * // Update one Receipt
     * const receipt = await prisma.receipt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends ReceiptUpdateArgs>(
      args: SelectSubset<T, ReceiptUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__ReceiptClient<Receipt>,
      Prisma__ReceiptClient<ReceiptGetPayload<T>>
    >;

    /**
     * Delete zero or more Receipts.
     * @param {ReceiptDeleteManyArgs} args - Arguments to filter Receipts to delete.
     * @example
     * // Delete a few Receipts
     * const { count } = await prisma.receipt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends ReceiptDeleteManyArgs>(
      args?: SelectSubset<T, ReceiptDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Receipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Receipts
     * const receipt = await prisma.receipt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends ReceiptUpdateManyArgs>(
      args: SelectSubset<T, ReceiptUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Receipt.
     * @param {ReceiptUpsertArgs} args - Arguments to update or create a Receipt.
     * @example
     * // Update or create a Receipt
     * const receipt = await prisma.receipt.upsert({
     *   create: {
     *     // ... data to create a Receipt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Receipt we want to update
     *   }
     * })
     **/
    upsert<T extends ReceiptUpsertArgs>(
      args: SelectSubset<T, ReceiptUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__ReceiptClient<Receipt>,
      Prisma__ReceiptClient<ReceiptGetPayload<T>>
    >;

    /**
     * Count the number of Receipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptCountArgs} args - Arguments to filter Receipts to count.
     * @example
     * // Count the number of Receipts
     * const count = await prisma.receipt.count({
     *   where: {
     *     // ... the filter for the Receipts we want to count
     *   }
     * })
     **/
    count<T extends ReceiptCountArgs>(
      args?: Subset<T, ReceiptCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReceiptCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Receipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ReceiptAggregateArgs>(
      args: Subset<T, ReceiptAggregateArgs>
    ): PrismaPromise<GetReceiptAggregateType<T>>;

    /**
     * Group by Receipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ReceiptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReceiptGroupByArgs['orderBy'] }
        : { orderBy?: ReceiptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, ReceiptGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetReceiptGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Receipt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ReceiptClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs = {}>(
      args?: Subset<T, UserArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User | null>,
      Prisma__UserClient<UserGetPayload<T> | null>
    >;

    costItem<T extends CostItemArgs = {}>(
      args?: Subset<T, CostItemArgs>
    ): CheckSelect<
      T,
      Prisma__CostItemClient<CostItem | null>,
      Prisma__CostItemClient<CostItemGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Receipt findUnique
   */
  export type ReceiptFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * Throw an Error if a Receipt can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Receipt to fetch.
     *
     **/
    where: ReceiptWhereUniqueInput;
  };

  /**
   * Receipt findFirst
   */
  export type ReceiptFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * Throw an Error if a Receipt can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Receipt to fetch.
     *
     **/
    where?: ReceiptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Receipts to fetch.
     *
     **/
    orderBy?: Enumerable<ReceiptOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Receipts.
     *
     **/
    cursor?: ReceiptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Receipts from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Receipts.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Receipts.
     *
     **/
    distinct?: Enumerable<ReceiptScalarFieldEnum>;
  };

  /**
   * Receipt findMany
   */
  export type ReceiptFindManyArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * Filter, which Receipts to fetch.
     *
     **/
    where?: ReceiptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Receipts to fetch.
     *
     **/
    orderBy?: Enumerable<ReceiptOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Receipts.
     *
     **/
    cursor?: ReceiptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Receipts from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Receipts.
     *
     **/
    skip?: number;
    distinct?: Enumerable<ReceiptScalarFieldEnum>;
  };

  /**
   * Receipt create
   */
  export type ReceiptCreateArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * The data needed to create a Receipt.
     *
     **/
    data: XOR<ReceiptCreateInput, ReceiptUncheckedCreateInput>;
  };

  /**
   * Receipt createMany
   */
  export type ReceiptCreateManyArgs = {
    data: Enumerable<ReceiptCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Receipt update
   */
  export type ReceiptUpdateArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * The data needed to update a Receipt.
     *
     **/
    data: XOR<ReceiptUpdateInput, ReceiptUncheckedUpdateInput>;
    /**
     * Choose, which Receipt to update.
     *
     **/
    where: ReceiptWhereUniqueInput;
  };

  /**
   * Receipt updateMany
   */
  export type ReceiptUpdateManyArgs = {
    data: XOR<ReceiptUpdateManyMutationInput, ReceiptUncheckedUpdateManyInput>;
    where?: ReceiptWhereInput;
  };

  /**
   * Receipt upsert
   */
  export type ReceiptUpsertArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * The filter to search for the Receipt to update in case it exists.
     *
     **/
    where: ReceiptWhereUniqueInput;
    /**
     * In case the Receipt found by the `where` argument doesn't exist, create a new Receipt with this data.
     *
     **/
    create: XOR<ReceiptCreateInput, ReceiptUncheckedCreateInput>;
    /**
     * In case the Receipt was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<ReceiptUpdateInput, ReceiptUncheckedUpdateInput>;
  };

  /**
   * Receipt delete
   */
  export type ReceiptDeleteArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
    /**
     * Filter which Receipt to delete.
     *
     **/
    where: ReceiptWhereUniqueInput;
  };

  /**
   * Receipt deleteMany
   */
  export type ReceiptDeleteManyArgs = {
    where?: ReceiptWhereInput;
  };

  /**
   * Receipt without action
   */
  export type ReceiptArgs = {
    /**
     * Select specific fields to fetch from the Receipt
     *
     **/
    select?: ReceiptSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ReceiptInclude | null;
  };

  /**
   * Model PhotoShare
   */

  export type AggregatePhotoShare = {
    _count: PhotoShareCountAggregateOutputType | null;
    _min: PhotoShareMinAggregateOutputType | null;
    _max: PhotoShareMaxAggregateOutputType | null;
  };

  export type PhotoShareMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    eventId: string | null;
  };

  export type PhotoShareMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    eventId: string | null;
  };

  export type PhotoShareCountAggregateOutputType = {
    id: number;
    createdAt: number;
    eventId: number;
    _all: number;
  };

  export type PhotoShareMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
  };

  export type PhotoShareMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
  };

  export type PhotoShareCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    _all?: true;
  };

  export type PhotoShareAggregateArgs = {
    /**
     * Filter which PhotoShare to aggregate.
     *
     **/
    where?: PhotoShareWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PhotoShares to fetch.
     *
     **/
    orderBy?: Enumerable<PhotoShareOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: PhotoShareWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PhotoShares from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PhotoShares.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PhotoShares
     **/
    _count?: true | PhotoShareCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PhotoShareMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PhotoShareMaxAggregateInputType;
  };

  export type GetPhotoShareAggregateType<T extends PhotoShareAggregateArgs> = {
    [P in keyof T & keyof AggregatePhotoShare]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhotoShare[P]>
      : GetScalarType<T[P], AggregatePhotoShare[P]>;
  };

  export type PhotoShareGroupByArgs = {
    where?: PhotoShareWhereInput;
    orderBy?: Enumerable<PhotoShareOrderByWithAggregationInput>;
    by: Array<PhotoShareScalarFieldEnum>;
    having?: PhotoShareScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PhotoShareCountAggregateInputType | true;
    _min?: PhotoShareMinAggregateInputType;
    _max?: PhotoShareMaxAggregateInputType;
  };

  export type PhotoShareGroupByOutputType = {
    id: string;
    createdAt: Date;
    eventId: string;
    _count: PhotoShareCountAggregateOutputType | null;
    _min: PhotoShareMinAggregateOutputType | null;
    _max: PhotoShareMaxAggregateOutputType | null;
  };

  type GetPhotoShareGroupByPayload<T extends PhotoShareGroupByArgs> = Promise<
    Array<
      PickArray<PhotoShareGroupByOutputType, T['by']> &
        {
          [P in keyof T & keyof PhotoShareGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoShareGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoShareGroupByOutputType[P]>;
        }
    >
  >;

  export type PhotoShareSelect = {
    id?: boolean;
    createdAt?: boolean;
    event?: boolean | TumiEventArgs;
    eventId?: boolean;
  };

  export type PhotoShareInclude = {
    event?: boolean | TumiEventArgs;
  };

  export type PhotoShareGetPayload<
    S extends boolean | null | undefined | PhotoShareArgs,
    U = keyof S
  > = S extends true
    ? PhotoShare
    : S extends undefined
    ? never
    : S extends PhotoShareArgs | PhotoShareFindManyArgs
    ? 'include' extends U
      ? PhotoShare &
          {
            [P in TrueKeys<S['include']>]: P extends 'event'
              ? TumiEventGetPayload<S['include'][P]>
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof PhotoShare
            ? PhotoShare[P]
            : P extends 'event'
            ? TumiEventGetPayload<S['select'][P]>
            : never;
        }
      : PhotoShare
    : PhotoShare;

  type PhotoShareCountArgs = Merge<
    Omit<PhotoShareFindManyArgs, 'select' | 'include'> & {
      select?: PhotoShareCountAggregateInputType | true;
    }
  >;

  export interface PhotoShareDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one PhotoShare that matches the filter.
     * @param {PhotoShareFindUniqueArgs} args - Arguments to find a PhotoShare
     * @example
     * // Get one PhotoShare
     * const photoShare = await prisma.photoShare.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends PhotoShareFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, PhotoShareFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'PhotoShare'
    > extends True
      ? CheckSelect<
          T,
          Prisma__PhotoShareClient<PhotoShare>,
          Prisma__PhotoShareClient<PhotoShareGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__PhotoShareClient<PhotoShare | null>,
          Prisma__PhotoShareClient<PhotoShareGetPayload<T> | null>
        >;

    /**
     * Find the first PhotoShare that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoShareFindFirstArgs} args - Arguments to find a PhotoShare
     * @example
     * // Get one PhotoShare
     * const photoShare = await prisma.photoShare.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends PhotoShareFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, PhotoShareFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'PhotoShare'
    > extends True
      ? CheckSelect<
          T,
          Prisma__PhotoShareClient<PhotoShare>,
          Prisma__PhotoShareClient<PhotoShareGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__PhotoShareClient<PhotoShare | null>,
          Prisma__PhotoShareClient<PhotoShareGetPayload<T> | null>
        >;

    /**
     * Find zero or more PhotoShares that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoShareFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PhotoShares
     * const photoShares = await prisma.photoShare.findMany()
     *
     * // Get first 10 PhotoShares
     * const photoShares = await prisma.photoShare.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const photoShareWithIdOnly = await prisma.photoShare.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends PhotoShareFindManyArgs>(
      args?: SelectSubset<T, PhotoShareFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<PhotoShare>>,
      PrismaPromise<Array<PhotoShareGetPayload<T>>>
    >;

    /**
     * Create a PhotoShare.
     * @param {PhotoShareCreateArgs} args - Arguments to create a PhotoShare.
     * @example
     * // Create one PhotoShare
     * const PhotoShare = await prisma.photoShare.create({
     *   data: {
     *     // ... data to create a PhotoShare
     *   }
     * })
     *
     **/
    create<T extends PhotoShareCreateArgs>(
      args: SelectSubset<T, PhotoShareCreateArgs>
    ): CheckSelect<
      T,
      Prisma__PhotoShareClient<PhotoShare>,
      Prisma__PhotoShareClient<PhotoShareGetPayload<T>>
    >;

    /**
     * Create many PhotoShares.
     *     @param {PhotoShareCreateManyArgs} args - Arguments to create many PhotoShares.
     *     @example
     *     // Create many PhotoShares
     *     const photoShare = await prisma.photoShare.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends PhotoShareCreateManyArgs>(
      args?: SelectSubset<T, PhotoShareCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a PhotoShare.
     * @param {PhotoShareDeleteArgs} args - Arguments to delete one PhotoShare.
     * @example
     * // Delete one PhotoShare
     * const PhotoShare = await prisma.photoShare.delete({
     *   where: {
     *     // ... filter to delete one PhotoShare
     *   }
     * })
     *
     **/
    delete<T extends PhotoShareDeleteArgs>(
      args: SelectSubset<T, PhotoShareDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__PhotoShareClient<PhotoShare>,
      Prisma__PhotoShareClient<PhotoShareGetPayload<T>>
    >;

    /**
     * Update one PhotoShare.
     * @param {PhotoShareUpdateArgs} args - Arguments to update one PhotoShare.
     * @example
     * // Update one PhotoShare
     * const photoShare = await prisma.photoShare.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends PhotoShareUpdateArgs>(
      args: SelectSubset<T, PhotoShareUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__PhotoShareClient<PhotoShare>,
      Prisma__PhotoShareClient<PhotoShareGetPayload<T>>
    >;

    /**
     * Delete zero or more PhotoShares.
     * @param {PhotoShareDeleteManyArgs} args - Arguments to filter PhotoShares to delete.
     * @example
     * // Delete a few PhotoShares
     * const { count } = await prisma.photoShare.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends PhotoShareDeleteManyArgs>(
      args?: SelectSubset<T, PhotoShareDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more PhotoShares.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoShareUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PhotoShares
     * const photoShare = await prisma.photoShare.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends PhotoShareUpdateManyArgs>(
      args: SelectSubset<T, PhotoShareUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one PhotoShare.
     * @param {PhotoShareUpsertArgs} args - Arguments to update or create a PhotoShare.
     * @example
     * // Update or create a PhotoShare
     * const photoShare = await prisma.photoShare.upsert({
     *   create: {
     *     // ... data to create a PhotoShare
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PhotoShare we want to update
     *   }
     * })
     **/
    upsert<T extends PhotoShareUpsertArgs>(
      args: SelectSubset<T, PhotoShareUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__PhotoShareClient<PhotoShare>,
      Prisma__PhotoShareClient<PhotoShareGetPayload<T>>
    >;

    /**
     * Count the number of PhotoShares.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoShareCountArgs} args - Arguments to filter PhotoShares to count.
     * @example
     * // Count the number of PhotoShares
     * const count = await prisma.photoShare.count({
     *   where: {
     *     // ... the filter for the PhotoShares we want to count
     *   }
     * })
     **/
    count<T extends PhotoShareCountArgs>(
      args?: Subset<T, PhotoShareCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoShareCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a PhotoShare.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoShareAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PhotoShareAggregateArgs>(
      args: Subset<T, PhotoShareAggregateArgs>
    ): PrismaPromise<GetPhotoShareAggregateType<T>>;

    /**
     * Group by PhotoShare.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoShareGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PhotoShareGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoShareGroupByArgs['orderBy'] }
        : { orderBy?: PhotoShareGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, PhotoShareGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPhotoShareGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PhotoShare.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PhotoShareClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    event<T extends TumiEventArgs = {}>(
      args?: Subset<T, TumiEventArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent | null>,
      Prisma__TumiEventClient<TumiEventGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * PhotoShare findUnique
   */
  export type PhotoShareFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * Throw an Error if a PhotoShare can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which PhotoShare to fetch.
     *
     **/
    where: PhotoShareWhereUniqueInput;
  };

  /**
   * PhotoShare findFirst
   */
  export type PhotoShareFindFirstArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * Throw an Error if a PhotoShare can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which PhotoShare to fetch.
     *
     **/
    where?: PhotoShareWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PhotoShares to fetch.
     *
     **/
    orderBy?: Enumerable<PhotoShareOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PhotoShares.
     *
     **/
    cursor?: PhotoShareWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PhotoShares from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PhotoShares.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PhotoShares.
     *
     **/
    distinct?: Enumerable<PhotoShareScalarFieldEnum>;
  };

  /**
   * PhotoShare findMany
   */
  export type PhotoShareFindManyArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * Filter, which PhotoShares to fetch.
     *
     **/
    where?: PhotoShareWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PhotoShares to fetch.
     *
     **/
    orderBy?: Enumerable<PhotoShareOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PhotoShares.
     *
     **/
    cursor?: PhotoShareWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PhotoShares from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PhotoShares.
     *
     **/
    skip?: number;
    distinct?: Enumerable<PhotoShareScalarFieldEnum>;
  };

  /**
   * PhotoShare create
   */
  export type PhotoShareCreateArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * The data needed to create a PhotoShare.
     *
     **/
    data: XOR<PhotoShareCreateInput, PhotoShareUncheckedCreateInput>;
  };

  /**
   * PhotoShare createMany
   */
  export type PhotoShareCreateManyArgs = {
    data: Enumerable<PhotoShareCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * PhotoShare update
   */
  export type PhotoShareUpdateArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * The data needed to update a PhotoShare.
     *
     **/
    data: XOR<PhotoShareUpdateInput, PhotoShareUncheckedUpdateInput>;
    /**
     * Choose, which PhotoShare to update.
     *
     **/
    where: PhotoShareWhereUniqueInput;
  };

  /**
   * PhotoShare updateMany
   */
  export type PhotoShareUpdateManyArgs = {
    data: XOR<
      PhotoShareUpdateManyMutationInput,
      PhotoShareUncheckedUpdateManyInput
    >;
    where?: PhotoShareWhereInput;
  };

  /**
   * PhotoShare upsert
   */
  export type PhotoShareUpsertArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * The filter to search for the PhotoShare to update in case it exists.
     *
     **/
    where: PhotoShareWhereUniqueInput;
    /**
     * In case the PhotoShare found by the `where` argument doesn't exist, create a new PhotoShare with this data.
     *
     **/
    create: XOR<PhotoShareCreateInput, PhotoShareUncheckedCreateInput>;
    /**
     * In case the PhotoShare was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<PhotoShareUpdateInput, PhotoShareUncheckedUpdateInput>;
  };

  /**
   * PhotoShare delete
   */
  export type PhotoShareDeleteArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
    /**
     * Filter which PhotoShare to delete.
     *
     **/
    where: PhotoShareWhereUniqueInput;
  };

  /**
   * PhotoShare deleteMany
   */
  export type PhotoShareDeleteManyArgs = {
    where?: PhotoShareWhereInput;
  };

  /**
   * PhotoShare without action
   */
  export type PhotoShareArgs = {
    /**
     * Select specific fields to fetch from the PhotoShare
     *
     **/
    select?: PhotoShareSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: PhotoShareInclude | null;
  };

  /**
   * Model EventRegistration
   */

  export type AggregateEventRegistration = {
    _count: EventRegistrationCountAggregateOutputType | null;
    _min: EventRegistrationMinAggregateOutputType | null;
    _max: EventRegistrationMaxAggregateOutputType | null;
  };

  export type EventRegistrationMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    type: RegistrationType | null;
    userId: string | null;
    eventId: string | null;
  };

  export type EventRegistrationMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    type: RegistrationType | null;
    userId: string | null;
    eventId: string | null;
  };

  export type EventRegistrationCountAggregateOutputType = {
    id: number;
    createdAt: number;
    type: number;
    userId: number;
    eventId: number;
    _all: number;
  };

  export type EventRegistrationMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    type?: true;
    userId?: true;
    eventId?: true;
  };

  export type EventRegistrationMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    type?: true;
    userId?: true;
    eventId?: true;
  };

  export type EventRegistrationCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    type?: true;
    userId?: true;
    eventId?: true;
    _all?: true;
  };

  export type EventRegistrationAggregateArgs = {
    /**
     * Filter which EventRegistration to aggregate.
     *
     **/
    where?: EventRegistrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventRegistrations to fetch.
     *
     **/
    orderBy?: Enumerable<EventRegistrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: EventRegistrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventRegistrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventRegistrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventRegistrations
     **/
    _count?: true | EventRegistrationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventRegistrationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventRegistrationMaxAggregateInputType;
  };

  export type GetEventRegistrationAggregateType<
    T extends EventRegistrationAggregateArgs
  > = {
    [P in keyof T & keyof AggregateEventRegistration]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventRegistration[P]>
      : GetScalarType<T[P], AggregateEventRegistration[P]>;
  };

  export type EventRegistrationGroupByArgs = {
    where?: EventRegistrationWhereInput;
    orderBy?: Enumerable<EventRegistrationOrderByWithAggregationInput>;
    by: Array<EventRegistrationScalarFieldEnum>;
    having?: EventRegistrationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventRegistrationCountAggregateInputType | true;
    _min?: EventRegistrationMinAggregateInputType;
    _max?: EventRegistrationMaxAggregateInputType;
  };

  export type EventRegistrationGroupByOutputType = {
    id: string;
    createdAt: Date;
    type: RegistrationType;
    userId: string;
    eventId: string;
    _count: EventRegistrationCountAggregateOutputType | null;
    _min: EventRegistrationMinAggregateOutputType | null;
    _max: EventRegistrationMaxAggregateOutputType | null;
  };

  type GetEventRegistrationGroupByPayload<
    T extends EventRegistrationGroupByArgs
  > = Promise<
    Array<
      PickArray<EventRegistrationGroupByOutputType, T['by']> &
        {
          [P in keyof T &
            keyof EventRegistrationGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventRegistrationGroupByOutputType[P]>
            : GetScalarType<T[P], EventRegistrationGroupByOutputType[P]>;
        }
    >
  >;

  export type EventRegistrationSelect = {
    id?: boolean;
    createdAt?: boolean;
    type?: boolean;
    user?: boolean | UserArgs;
    userId?: boolean;
    event?: boolean | TumiEventArgs;
    eventId?: boolean;
  };

  export type EventRegistrationInclude = {
    user?: boolean | UserArgs;
    event?: boolean | TumiEventArgs;
  };

  export type EventRegistrationGetPayload<
    S extends boolean | null | undefined | EventRegistrationArgs,
    U = keyof S
  > = S extends true
    ? EventRegistration
    : S extends undefined
    ? never
    : S extends EventRegistrationArgs | EventRegistrationFindManyArgs
    ? 'include' extends U
      ? EventRegistration &
          {
            [P in TrueKeys<S['include']>]: P extends 'user'
              ? UserGetPayload<S['include'][P]>
              : P extends 'event'
              ? TumiEventGetPayload<S['include'][P]>
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof EventRegistration
            ? EventRegistration[P]
            : P extends 'user'
            ? UserGetPayload<S['select'][P]>
            : P extends 'event'
            ? TumiEventGetPayload<S['select'][P]>
            : never;
        }
      : EventRegistration
    : EventRegistration;

  type EventRegistrationCountArgs = Merge<
    Omit<EventRegistrationFindManyArgs, 'select' | 'include'> & {
      select?: EventRegistrationCountAggregateInputType | true;
    }
  >;

  export interface EventRegistrationDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one EventRegistration that matches the filter.
     * @param {EventRegistrationFindUniqueArgs} args - Arguments to find a EventRegistration
     * @example
     * // Get one EventRegistration
     * const eventRegistration = await prisma.eventRegistration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends EventRegistrationFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, EventRegistrationFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'EventRegistration'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventRegistrationClient<EventRegistration>,
          Prisma__EventRegistrationClient<EventRegistrationGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventRegistrationClient<EventRegistration | null>,
          Prisma__EventRegistrationClient<EventRegistrationGetPayload<T> | null>
        >;

    /**
     * Find the first EventRegistration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRegistrationFindFirstArgs} args - Arguments to find a EventRegistration
     * @example
     * // Get one EventRegistration
     * const eventRegistration = await prisma.eventRegistration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends EventRegistrationFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, EventRegistrationFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'EventRegistration'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventRegistrationClient<EventRegistration>,
          Prisma__EventRegistrationClient<EventRegistrationGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventRegistrationClient<EventRegistration | null>,
          Prisma__EventRegistrationClient<EventRegistrationGetPayload<T> | null>
        >;

    /**
     * Find zero or more EventRegistrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRegistrationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventRegistrations
     * const eventRegistrations = await prisma.eventRegistration.findMany()
     *
     * // Get first 10 EventRegistrations
     * const eventRegistrations = await prisma.eventRegistration.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventRegistrationWithIdOnly = await prisma.eventRegistration.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends EventRegistrationFindManyArgs>(
      args?: SelectSubset<T, EventRegistrationFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventRegistration>>,
      PrismaPromise<Array<EventRegistrationGetPayload<T>>>
    >;

    /**
     * Create a EventRegistration.
     * @param {EventRegistrationCreateArgs} args - Arguments to create a EventRegistration.
     * @example
     * // Create one EventRegistration
     * const EventRegistration = await prisma.eventRegistration.create({
     *   data: {
     *     // ... data to create a EventRegistration
     *   }
     * })
     *
     **/
    create<T extends EventRegistrationCreateArgs>(
      args: SelectSubset<T, EventRegistrationCreateArgs>
    ): CheckSelect<
      T,
      Prisma__EventRegistrationClient<EventRegistration>,
      Prisma__EventRegistrationClient<EventRegistrationGetPayload<T>>
    >;

    /**
     * Create many EventRegistrations.
     *     @param {EventRegistrationCreateManyArgs} args - Arguments to create many EventRegistrations.
     *     @example
     *     // Create many EventRegistrations
     *     const eventRegistration = await prisma.eventRegistration.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends EventRegistrationCreateManyArgs>(
      args?: SelectSubset<T, EventRegistrationCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a EventRegistration.
     * @param {EventRegistrationDeleteArgs} args - Arguments to delete one EventRegistration.
     * @example
     * // Delete one EventRegistration
     * const EventRegistration = await prisma.eventRegistration.delete({
     *   where: {
     *     // ... filter to delete one EventRegistration
     *   }
     * })
     *
     **/
    delete<T extends EventRegistrationDeleteArgs>(
      args: SelectSubset<T, EventRegistrationDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__EventRegistrationClient<EventRegistration>,
      Prisma__EventRegistrationClient<EventRegistrationGetPayload<T>>
    >;

    /**
     * Update one EventRegistration.
     * @param {EventRegistrationUpdateArgs} args - Arguments to update one EventRegistration.
     * @example
     * // Update one EventRegistration
     * const eventRegistration = await prisma.eventRegistration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends EventRegistrationUpdateArgs>(
      args: SelectSubset<T, EventRegistrationUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__EventRegistrationClient<EventRegistration>,
      Prisma__EventRegistrationClient<EventRegistrationGetPayload<T>>
    >;

    /**
     * Delete zero or more EventRegistrations.
     * @param {EventRegistrationDeleteManyArgs} args - Arguments to filter EventRegistrations to delete.
     * @example
     * // Delete a few EventRegistrations
     * const { count } = await prisma.eventRegistration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends EventRegistrationDeleteManyArgs>(
      args?: SelectSubset<T, EventRegistrationDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventRegistrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRegistrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventRegistrations
     * const eventRegistration = await prisma.eventRegistration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends EventRegistrationUpdateManyArgs>(
      args: SelectSubset<T, EventRegistrationUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one EventRegistration.
     * @param {EventRegistrationUpsertArgs} args - Arguments to update or create a EventRegistration.
     * @example
     * // Update or create a EventRegistration
     * const eventRegistration = await prisma.eventRegistration.upsert({
     *   create: {
     *     // ... data to create a EventRegistration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventRegistration we want to update
     *   }
     * })
     **/
    upsert<T extends EventRegistrationUpsertArgs>(
      args: SelectSubset<T, EventRegistrationUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__EventRegistrationClient<EventRegistration>,
      Prisma__EventRegistrationClient<EventRegistrationGetPayload<T>>
    >;

    /**
     * Count the number of EventRegistrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRegistrationCountArgs} args - Arguments to filter EventRegistrations to count.
     * @example
     * // Count the number of EventRegistrations
     * const count = await prisma.eventRegistration.count({
     *   where: {
     *     // ... the filter for the EventRegistrations we want to count
     *   }
     * })
     **/
    count<T extends EventRegistrationCountArgs>(
      args?: Subset<T, EventRegistrationCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<
              T['select'],
              EventRegistrationCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EventRegistration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRegistrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventRegistrationAggregateArgs>(
      args: Subset<T, EventRegistrationAggregateArgs>
    ): PrismaPromise<GetEventRegistrationAggregateType<T>>;

    /**
     * Group by EventRegistration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventRegistrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventRegistrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventRegistrationGroupByArgs['orderBy'] }
        : { orderBy?: EventRegistrationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, EventRegistrationGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetEventRegistrationGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventRegistration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventRegistrationClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs = {}>(
      args?: Subset<T, UserArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User | null>,
      Prisma__UserClient<UserGetPayload<T> | null>
    >;

    event<T extends TumiEventArgs = {}>(
      args?: Subset<T, TumiEventArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent | null>,
      Prisma__TumiEventClient<TumiEventGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EventRegistration findUnique
   */
  export type EventRegistrationFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * Throw an Error if a EventRegistration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventRegistration to fetch.
     *
     **/
    where: EventRegistrationWhereUniqueInput;
  };

  /**
   * EventRegistration findFirst
   */
  export type EventRegistrationFindFirstArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * Throw an Error if a EventRegistration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventRegistration to fetch.
     *
     **/
    where?: EventRegistrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventRegistrations to fetch.
     *
     **/
    orderBy?: Enumerable<EventRegistrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventRegistrations.
     *
     **/
    cursor?: EventRegistrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventRegistrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventRegistrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventRegistrations.
     *
     **/
    distinct?: Enumerable<EventRegistrationScalarFieldEnum>;
  };

  /**
   * EventRegistration findMany
   */
  export type EventRegistrationFindManyArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * Filter, which EventRegistrations to fetch.
     *
     **/
    where?: EventRegistrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventRegistrations to fetch.
     *
     **/
    orderBy?: Enumerable<EventRegistrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventRegistrations.
     *
     **/
    cursor?: EventRegistrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventRegistrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventRegistrations.
     *
     **/
    skip?: number;
    distinct?: Enumerable<EventRegistrationScalarFieldEnum>;
  };

  /**
   * EventRegistration create
   */
  export type EventRegistrationCreateArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * The data needed to create a EventRegistration.
     *
     **/
    data: XOR<
      EventRegistrationCreateInput,
      EventRegistrationUncheckedCreateInput
    >;
  };

  /**
   * EventRegistration createMany
   */
  export type EventRegistrationCreateManyArgs = {
    data: Enumerable<EventRegistrationCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * EventRegistration update
   */
  export type EventRegistrationUpdateArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * The data needed to update a EventRegistration.
     *
     **/
    data: XOR<
      EventRegistrationUpdateInput,
      EventRegistrationUncheckedUpdateInput
    >;
    /**
     * Choose, which EventRegistration to update.
     *
     **/
    where: EventRegistrationWhereUniqueInput;
  };

  /**
   * EventRegistration updateMany
   */
  export type EventRegistrationUpdateManyArgs = {
    data: XOR<
      EventRegistrationUpdateManyMutationInput,
      EventRegistrationUncheckedUpdateManyInput
    >;
    where?: EventRegistrationWhereInput;
  };

  /**
   * EventRegistration upsert
   */
  export type EventRegistrationUpsertArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * The filter to search for the EventRegistration to update in case it exists.
     *
     **/
    where: EventRegistrationWhereUniqueInput;
    /**
     * In case the EventRegistration found by the `where` argument doesn't exist, create a new EventRegistration with this data.
     *
     **/
    create: XOR<
      EventRegistrationCreateInput,
      EventRegistrationUncheckedCreateInput
    >;
    /**
     * In case the EventRegistration was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      EventRegistrationUpdateInput,
      EventRegistrationUncheckedUpdateInput
    >;
  };

  /**
   * EventRegistration delete
   */
  export type EventRegistrationDeleteArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
    /**
     * Filter which EventRegistration to delete.
     *
     **/
    where: EventRegistrationWhereUniqueInput;
  };

  /**
   * EventRegistration deleteMany
   */
  export type EventRegistrationDeleteManyArgs = {
    where?: EventRegistrationWhereInput;
  };

  /**
   * EventRegistration without action
   */
  export type EventRegistrationArgs = {
    /**
     * Select specific fields to fetch from the EventRegistration
     *
     **/
    select?: EventRegistrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventRegistrationInclude | null;
  };

  /**
   * Model EventSubmissionItem
   */

  export type AggregateEventSubmissionItem = {
    _count: EventSubmissionItemCountAggregateOutputType | null;
    _min: EventSubmissionItemMinAggregateOutputType | null;
    _max: EventSubmissionItemMaxAggregateOutputType | null;
  };

  export type EventSubmissionItemMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    eventId: string | null;
    required: boolean | null;
    submissionTime: SubmissionTime | null;
  };

  export type EventSubmissionItemMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    eventId: string | null;
    required: boolean | null;
    submissionTime: SubmissionTime | null;
  };

  export type EventSubmissionItemCountAggregateOutputType = {
    id: number;
    createdAt: number;
    eventId: number;
    required: number;
    submissionTime: number;
    _all: number;
  };

  export type EventSubmissionItemMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    required?: true;
    submissionTime?: true;
  };

  export type EventSubmissionItemMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    required?: true;
    submissionTime?: true;
  };

  export type EventSubmissionItemCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    eventId?: true;
    required?: true;
    submissionTime?: true;
    _all?: true;
  };

  export type EventSubmissionItemAggregateArgs = {
    /**
     * Filter which EventSubmissionItem to aggregate.
     *
     **/
    where?: EventSubmissionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventSubmissionItems to fetch.
     *
     **/
    orderBy?: Enumerable<EventSubmissionItemOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: EventSubmissionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventSubmissionItems from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventSubmissionItems.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventSubmissionItems
     **/
    _count?: true | EventSubmissionItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventSubmissionItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventSubmissionItemMaxAggregateInputType;
  };

  export type GetEventSubmissionItemAggregateType<
    T extends EventSubmissionItemAggregateArgs
  > = {
    [P in keyof T & keyof AggregateEventSubmissionItem]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventSubmissionItem[P]>
      : GetScalarType<T[P], AggregateEventSubmissionItem[P]>;
  };

  export type EventSubmissionItemGroupByArgs = {
    where?: EventSubmissionItemWhereInput;
    orderBy?: Enumerable<EventSubmissionItemOrderByWithAggregationInput>;
    by: Array<EventSubmissionItemScalarFieldEnum>;
    having?: EventSubmissionItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventSubmissionItemCountAggregateInputType | true;
    _min?: EventSubmissionItemMinAggregateInputType;
    _max?: EventSubmissionItemMaxAggregateInputType;
  };

  export type EventSubmissionItemGroupByOutputType = {
    id: string;
    createdAt: Date;
    eventId: string;
    required: boolean;
    submissionTime: SubmissionTime;
    _count: EventSubmissionItemCountAggregateOutputType | null;
    _min: EventSubmissionItemMinAggregateOutputType | null;
    _max: EventSubmissionItemMaxAggregateOutputType | null;
  };

  type GetEventSubmissionItemGroupByPayload<
    T extends EventSubmissionItemGroupByArgs
  > = Promise<
    Array<
      PickArray<EventSubmissionItemGroupByOutputType, T['by']> &
        {
          [P in keyof T &
            keyof EventSubmissionItemGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventSubmissionItemGroupByOutputType[P]>
            : GetScalarType<T[P], EventSubmissionItemGroupByOutputType[P]>;
        }
    >
  >;

  export type EventSubmissionItemSelect = {
    id?: boolean;
    createdAt?: boolean;
    event?: boolean | TumiEventArgs;
    eventId?: boolean;
    required?: boolean;
    submissionTime?: boolean;
    submissions?: boolean | EventSubmissionFindManyArgs;
    _count?: boolean | EventSubmissionItemCountOutputTypeArgs;
  };

  export type EventSubmissionItemInclude = {
    event?: boolean | TumiEventArgs;
    submissions?: boolean | EventSubmissionFindManyArgs;
    _count?: boolean | EventSubmissionItemCountOutputTypeArgs;
  };

  export type EventSubmissionItemGetPayload<
    S extends boolean | null | undefined | EventSubmissionItemArgs,
    U = keyof S
  > = S extends true
    ? EventSubmissionItem
    : S extends undefined
    ? never
    : S extends EventSubmissionItemArgs | EventSubmissionItemFindManyArgs
    ? 'include' extends U
      ? EventSubmissionItem &
          {
            [P in TrueKeys<S['include']>]: P extends 'event'
              ? TumiEventGetPayload<S['include'][P]>
              : P extends 'submissions'
              ? Array<EventSubmissionGetPayload<S['include'][P]>>
              : P extends '_count'
              ? EventSubmissionItemCountOutputTypeGetPayload<
                  S['include'][P]
                > | null
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof EventSubmissionItem
            ? EventSubmissionItem[P]
            : P extends 'event'
            ? TumiEventGetPayload<S['select'][P]>
            : P extends 'submissions'
            ? Array<EventSubmissionGetPayload<S['select'][P]>>
            : P extends '_count'
            ? EventSubmissionItemCountOutputTypeGetPayload<
                S['select'][P]
              > | null
            : never;
        }
      : EventSubmissionItem
    : EventSubmissionItem;

  type EventSubmissionItemCountArgs = Merge<
    Omit<EventSubmissionItemFindManyArgs, 'select' | 'include'> & {
      select?: EventSubmissionItemCountAggregateInputType | true;
    }
  >;

  export interface EventSubmissionItemDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one EventSubmissionItem that matches the filter.
     * @param {EventSubmissionItemFindUniqueArgs} args - Arguments to find a EventSubmissionItem
     * @example
     * // Get one EventSubmissionItem
     * const eventSubmissionItem = await prisma.eventSubmissionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends EventSubmissionItemFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, EventSubmissionItemFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'EventSubmissionItem'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventSubmissionItemClient<EventSubmissionItem>,
          Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventSubmissionItemClient<EventSubmissionItem | null>,
          Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T> | null>
        >;

    /**
     * Find the first EventSubmissionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionItemFindFirstArgs} args - Arguments to find a EventSubmissionItem
     * @example
     * // Get one EventSubmissionItem
     * const eventSubmissionItem = await prisma.eventSubmissionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends EventSubmissionItemFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, EventSubmissionItemFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'EventSubmissionItem'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventSubmissionItemClient<EventSubmissionItem>,
          Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventSubmissionItemClient<EventSubmissionItem | null>,
          Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T> | null>
        >;

    /**
     * Find zero or more EventSubmissionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionItemFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventSubmissionItems
     * const eventSubmissionItems = await prisma.eventSubmissionItem.findMany()
     *
     * // Get first 10 EventSubmissionItems
     * const eventSubmissionItems = await prisma.eventSubmissionItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventSubmissionItemWithIdOnly = await prisma.eventSubmissionItem.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends EventSubmissionItemFindManyArgs>(
      args?: SelectSubset<T, EventSubmissionItemFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventSubmissionItem>>,
      PrismaPromise<Array<EventSubmissionItemGetPayload<T>>>
    >;

    /**
     * Create a EventSubmissionItem.
     * @param {EventSubmissionItemCreateArgs} args - Arguments to create a EventSubmissionItem.
     * @example
     * // Create one EventSubmissionItem
     * const EventSubmissionItem = await prisma.eventSubmissionItem.create({
     *   data: {
     *     // ... data to create a EventSubmissionItem
     *   }
     * })
     *
     **/
    create<T extends EventSubmissionItemCreateArgs>(
      args: SelectSubset<T, EventSubmissionItemCreateArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionItemClient<EventSubmissionItem>,
      Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T>>
    >;

    /**
     * Create many EventSubmissionItems.
     *     @param {EventSubmissionItemCreateManyArgs} args - Arguments to create many EventSubmissionItems.
     *     @example
     *     // Create many EventSubmissionItems
     *     const eventSubmissionItem = await prisma.eventSubmissionItem.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends EventSubmissionItemCreateManyArgs>(
      args?: SelectSubset<T, EventSubmissionItemCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a EventSubmissionItem.
     * @param {EventSubmissionItemDeleteArgs} args - Arguments to delete one EventSubmissionItem.
     * @example
     * // Delete one EventSubmissionItem
     * const EventSubmissionItem = await prisma.eventSubmissionItem.delete({
     *   where: {
     *     // ... filter to delete one EventSubmissionItem
     *   }
     * })
     *
     **/
    delete<T extends EventSubmissionItemDeleteArgs>(
      args: SelectSubset<T, EventSubmissionItemDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionItemClient<EventSubmissionItem>,
      Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T>>
    >;

    /**
     * Update one EventSubmissionItem.
     * @param {EventSubmissionItemUpdateArgs} args - Arguments to update one EventSubmissionItem.
     * @example
     * // Update one EventSubmissionItem
     * const eventSubmissionItem = await prisma.eventSubmissionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends EventSubmissionItemUpdateArgs>(
      args: SelectSubset<T, EventSubmissionItemUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionItemClient<EventSubmissionItem>,
      Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T>>
    >;

    /**
     * Delete zero or more EventSubmissionItems.
     * @param {EventSubmissionItemDeleteManyArgs} args - Arguments to filter EventSubmissionItems to delete.
     * @example
     * // Delete a few EventSubmissionItems
     * const { count } = await prisma.eventSubmissionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends EventSubmissionItemDeleteManyArgs>(
      args?: SelectSubset<T, EventSubmissionItemDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventSubmissionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventSubmissionItems
     * const eventSubmissionItem = await prisma.eventSubmissionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends EventSubmissionItemUpdateManyArgs>(
      args: SelectSubset<T, EventSubmissionItemUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one EventSubmissionItem.
     * @param {EventSubmissionItemUpsertArgs} args - Arguments to update or create a EventSubmissionItem.
     * @example
     * // Update or create a EventSubmissionItem
     * const eventSubmissionItem = await prisma.eventSubmissionItem.upsert({
     *   create: {
     *     // ... data to create a EventSubmissionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventSubmissionItem we want to update
     *   }
     * })
     **/
    upsert<T extends EventSubmissionItemUpsertArgs>(
      args: SelectSubset<T, EventSubmissionItemUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionItemClient<EventSubmissionItem>,
      Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T>>
    >;

    /**
     * Count the number of EventSubmissionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionItemCountArgs} args - Arguments to filter EventSubmissionItems to count.
     * @example
     * // Count the number of EventSubmissionItems
     * const count = await prisma.eventSubmissionItem.count({
     *   where: {
     *     // ... the filter for the EventSubmissionItems we want to count
     *   }
     * })
     **/
    count<T extends EventSubmissionItemCountArgs>(
      args?: Subset<T, EventSubmissionItemCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<
              T['select'],
              EventSubmissionItemCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EventSubmissionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventSubmissionItemAggregateArgs>(
      args: Subset<T, EventSubmissionItemAggregateArgs>
    ): PrismaPromise<GetEventSubmissionItemAggregateType<T>>;

    /**
     * Group by EventSubmissionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventSubmissionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventSubmissionItemGroupByArgs['orderBy'] }
        : { orderBy?: EventSubmissionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, EventSubmissionItemGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetEventSubmissionItemGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventSubmissionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventSubmissionItemClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    event<T extends TumiEventArgs = {}>(
      args?: Subset<T, TumiEventArgs>
    ): CheckSelect<
      T,
      Prisma__TumiEventClient<TumiEvent | null>,
      Prisma__TumiEventClient<TumiEventGetPayload<T> | null>
    >;

    submissions<T extends EventSubmissionFindManyArgs = {}>(
      args?: Subset<T, EventSubmissionFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventSubmission>>,
      PrismaPromise<Array<EventSubmissionGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EventSubmissionItem findUnique
   */
  export type EventSubmissionItemFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * Throw an Error if a EventSubmissionItem can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventSubmissionItem to fetch.
     *
     **/
    where: EventSubmissionItemWhereUniqueInput;
  };

  /**
   * EventSubmissionItem findFirst
   */
  export type EventSubmissionItemFindFirstArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * Throw an Error if a EventSubmissionItem can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventSubmissionItem to fetch.
     *
     **/
    where?: EventSubmissionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventSubmissionItems to fetch.
     *
     **/
    orderBy?: Enumerable<EventSubmissionItemOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventSubmissionItems.
     *
     **/
    cursor?: EventSubmissionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventSubmissionItems from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventSubmissionItems.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventSubmissionItems.
     *
     **/
    distinct?: Enumerable<EventSubmissionItemScalarFieldEnum>;
  };

  /**
   * EventSubmissionItem findMany
   */
  export type EventSubmissionItemFindManyArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * Filter, which EventSubmissionItems to fetch.
     *
     **/
    where?: EventSubmissionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventSubmissionItems to fetch.
     *
     **/
    orderBy?: Enumerable<EventSubmissionItemOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventSubmissionItems.
     *
     **/
    cursor?: EventSubmissionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventSubmissionItems from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventSubmissionItems.
     *
     **/
    skip?: number;
    distinct?: Enumerable<EventSubmissionItemScalarFieldEnum>;
  };

  /**
   * EventSubmissionItem create
   */
  export type EventSubmissionItemCreateArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * The data needed to create a EventSubmissionItem.
     *
     **/
    data: XOR<
      EventSubmissionItemCreateInput,
      EventSubmissionItemUncheckedCreateInput
    >;
  };

  /**
   * EventSubmissionItem createMany
   */
  export type EventSubmissionItemCreateManyArgs = {
    data: Enumerable<EventSubmissionItemCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * EventSubmissionItem update
   */
  export type EventSubmissionItemUpdateArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * The data needed to update a EventSubmissionItem.
     *
     **/
    data: XOR<
      EventSubmissionItemUpdateInput,
      EventSubmissionItemUncheckedUpdateInput
    >;
    /**
     * Choose, which EventSubmissionItem to update.
     *
     **/
    where: EventSubmissionItemWhereUniqueInput;
  };

  /**
   * EventSubmissionItem updateMany
   */
  export type EventSubmissionItemUpdateManyArgs = {
    data: XOR<
      EventSubmissionItemUpdateManyMutationInput,
      EventSubmissionItemUncheckedUpdateManyInput
    >;
    where?: EventSubmissionItemWhereInput;
  };

  /**
   * EventSubmissionItem upsert
   */
  export type EventSubmissionItemUpsertArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * The filter to search for the EventSubmissionItem to update in case it exists.
     *
     **/
    where: EventSubmissionItemWhereUniqueInput;
    /**
     * In case the EventSubmissionItem found by the `where` argument doesn't exist, create a new EventSubmissionItem with this data.
     *
     **/
    create: XOR<
      EventSubmissionItemCreateInput,
      EventSubmissionItemUncheckedCreateInput
    >;
    /**
     * In case the EventSubmissionItem was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      EventSubmissionItemUpdateInput,
      EventSubmissionItemUncheckedUpdateInput
    >;
  };

  /**
   * EventSubmissionItem delete
   */
  export type EventSubmissionItemDeleteArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
    /**
     * Filter which EventSubmissionItem to delete.
     *
     **/
    where: EventSubmissionItemWhereUniqueInput;
  };

  /**
   * EventSubmissionItem deleteMany
   */
  export type EventSubmissionItemDeleteManyArgs = {
    where?: EventSubmissionItemWhereInput;
  };

  /**
   * EventSubmissionItem without action
   */
  export type EventSubmissionItemArgs = {
    /**
     * Select specific fields to fetch from the EventSubmissionItem
     *
     **/
    select?: EventSubmissionItemSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionItemInclude | null;
  };

  /**
   * Model EventSubmission
   */

  export type AggregateEventSubmission = {
    _count: EventSubmissionCountAggregateOutputType | null;
    _min: EventSubmissionMinAggregateOutputType | null;
    _max: EventSubmissionMaxAggregateOutputType | null;
  };

  export type EventSubmissionMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    userId: string | null;
    submissionItemId: string | null;
  };

  export type EventSubmissionMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    userId: string | null;
    submissionItemId: string | null;
  };

  export type EventSubmissionCountAggregateOutputType = {
    id: number;
    createdAt: number;
    userId: number;
    submissionItemId: number;
    _all: number;
  };

  export type EventSubmissionMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    userId?: true;
    submissionItemId?: true;
  };

  export type EventSubmissionMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    userId?: true;
    submissionItemId?: true;
  };

  export type EventSubmissionCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    userId?: true;
    submissionItemId?: true;
    _all?: true;
  };

  export type EventSubmissionAggregateArgs = {
    /**
     * Filter which EventSubmission to aggregate.
     *
     **/
    where?: EventSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventSubmissions to fetch.
     *
     **/
    orderBy?: Enumerable<EventSubmissionOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: EventSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventSubmissions from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventSubmissions.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EventSubmissions
     **/
    _count?: true | EventSubmissionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventSubmissionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventSubmissionMaxAggregateInputType;
  };

  export type GetEventSubmissionAggregateType<
    T extends EventSubmissionAggregateArgs
  > = {
    [P in keyof T & keyof AggregateEventSubmission]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventSubmission[P]>
      : GetScalarType<T[P], AggregateEventSubmission[P]>;
  };

  export type EventSubmissionGroupByArgs = {
    where?: EventSubmissionWhereInput;
    orderBy?: Enumerable<EventSubmissionOrderByWithAggregationInput>;
    by: Array<EventSubmissionScalarFieldEnum>;
    having?: EventSubmissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventSubmissionCountAggregateInputType | true;
    _min?: EventSubmissionMinAggregateInputType;
    _max?: EventSubmissionMaxAggregateInputType;
  };

  export type EventSubmissionGroupByOutputType = {
    id: string;
    createdAt: Date;
    userId: string;
    submissionItemId: string;
    _count: EventSubmissionCountAggregateOutputType | null;
    _min: EventSubmissionMinAggregateOutputType | null;
    _max: EventSubmissionMaxAggregateOutputType | null;
  };

  type GetEventSubmissionGroupByPayload<T extends EventSubmissionGroupByArgs> =
    Promise<
      Array<
        PickArray<EventSubmissionGroupByOutputType, T['by']> &
          {
            [P in keyof T &
              keyof EventSubmissionGroupByOutputType]: P extends '_count'
              ? T[P] extends boolean
                ? number
                : GetScalarType<T[P], EventSubmissionGroupByOutputType[P]>
              : GetScalarType<T[P], EventSubmissionGroupByOutputType[P]>;
          }
      >
    >;

  export type EventSubmissionSelect = {
    id?: boolean;
    createdAt?: boolean;
    user?: boolean | UserArgs;
    userId?: boolean;
    submissionItem?: boolean | EventSubmissionItemArgs;
    submissionItemId?: boolean;
  };

  export type EventSubmissionInclude = {
    user?: boolean | UserArgs;
    submissionItem?: boolean | EventSubmissionItemArgs;
  };

  export type EventSubmissionGetPayload<
    S extends boolean | null | undefined | EventSubmissionArgs,
    U = keyof S
  > = S extends true
    ? EventSubmission
    : S extends undefined
    ? never
    : S extends EventSubmissionArgs | EventSubmissionFindManyArgs
    ? 'include' extends U
      ? EventSubmission &
          {
            [P in TrueKeys<S['include']>]: P extends 'user'
              ? UserGetPayload<S['include'][P]>
              : P extends 'submissionItem'
              ? EventSubmissionItemGetPayload<S['include'][P]>
              : never;
          }
      : 'select' extends U
      ? {
          [P in TrueKeys<S['select']>]: P extends keyof EventSubmission
            ? EventSubmission[P]
            : P extends 'user'
            ? UserGetPayload<S['select'][P]>
            : P extends 'submissionItem'
            ? EventSubmissionItemGetPayload<S['select'][P]>
            : never;
        }
      : EventSubmission
    : EventSubmission;

  type EventSubmissionCountArgs = Merge<
    Omit<EventSubmissionFindManyArgs, 'select' | 'include'> & {
      select?: EventSubmissionCountAggregateInputType | true;
    }
  >;

  export interface EventSubmissionDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one EventSubmission that matches the filter.
     * @param {EventSubmissionFindUniqueArgs} args - Arguments to find a EventSubmission
     * @example
     * // Get one EventSubmission
     * const eventSubmission = await prisma.eventSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends EventSubmissionFindUniqueArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args: SelectSubset<T, EventSubmissionFindUniqueArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findUnique',
      'EventSubmission'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventSubmissionClient<EventSubmission>,
          Prisma__EventSubmissionClient<EventSubmissionGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventSubmissionClient<EventSubmission | null>,
          Prisma__EventSubmissionClient<EventSubmissionGetPayload<T> | null>
        >;

    /**
     * Find the first EventSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionFindFirstArgs} args - Arguments to find a EventSubmission
     * @example
     * // Get one EventSubmission
     * const eventSubmission = await prisma.eventSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends EventSubmissionFindFirstArgs,
      LocalRejectSettings = T['rejectOnNotFound'] extends RejectOnNotFound
        ? T['rejectOnNotFound']
        : undefined
    >(
      args?: SelectSubset<T, EventSubmissionFindFirstArgs>
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      'findFirst',
      'EventSubmission'
    > extends True
      ? CheckSelect<
          T,
          Prisma__EventSubmissionClient<EventSubmission>,
          Prisma__EventSubmissionClient<EventSubmissionGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__EventSubmissionClient<EventSubmission | null>,
          Prisma__EventSubmissionClient<EventSubmissionGetPayload<T> | null>
        >;

    /**
     * Find zero or more EventSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventSubmissions
     * const eventSubmissions = await prisma.eventSubmission.findMany()
     *
     * // Get first 10 EventSubmissions
     * const eventSubmissions = await prisma.eventSubmission.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventSubmissionWithIdOnly = await prisma.eventSubmission.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends EventSubmissionFindManyArgs>(
      args?: SelectSubset<T, EventSubmissionFindManyArgs>
    ): CheckSelect<
      T,
      PrismaPromise<Array<EventSubmission>>,
      PrismaPromise<Array<EventSubmissionGetPayload<T>>>
    >;

    /**
     * Create a EventSubmission.
     * @param {EventSubmissionCreateArgs} args - Arguments to create a EventSubmission.
     * @example
     * // Create one EventSubmission
     * const EventSubmission = await prisma.eventSubmission.create({
     *   data: {
     *     // ... data to create a EventSubmission
     *   }
     * })
     *
     **/
    create<T extends EventSubmissionCreateArgs>(
      args: SelectSubset<T, EventSubmissionCreateArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionClient<EventSubmission>,
      Prisma__EventSubmissionClient<EventSubmissionGetPayload<T>>
    >;

    /**
     * Create many EventSubmissions.
     *     @param {EventSubmissionCreateManyArgs} args - Arguments to create many EventSubmissions.
     *     @example
     *     // Create many EventSubmissions
     *     const eventSubmission = await prisma.eventSubmission.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends EventSubmissionCreateManyArgs>(
      args?: SelectSubset<T, EventSubmissionCreateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a EventSubmission.
     * @param {EventSubmissionDeleteArgs} args - Arguments to delete one EventSubmission.
     * @example
     * // Delete one EventSubmission
     * const EventSubmission = await prisma.eventSubmission.delete({
     *   where: {
     *     // ... filter to delete one EventSubmission
     *   }
     * })
     *
     **/
    delete<T extends EventSubmissionDeleteArgs>(
      args: SelectSubset<T, EventSubmissionDeleteArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionClient<EventSubmission>,
      Prisma__EventSubmissionClient<EventSubmissionGetPayload<T>>
    >;

    /**
     * Update one EventSubmission.
     * @param {EventSubmissionUpdateArgs} args - Arguments to update one EventSubmission.
     * @example
     * // Update one EventSubmission
     * const eventSubmission = await prisma.eventSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends EventSubmissionUpdateArgs>(
      args: SelectSubset<T, EventSubmissionUpdateArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionClient<EventSubmission>,
      Prisma__EventSubmissionClient<EventSubmissionGetPayload<T>>
    >;

    /**
     * Delete zero or more EventSubmissions.
     * @param {EventSubmissionDeleteManyArgs} args - Arguments to filter EventSubmissions to delete.
     * @example
     * // Delete a few EventSubmissions
     * const { count } = await prisma.eventSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends EventSubmissionDeleteManyArgs>(
      args?: SelectSubset<T, EventSubmissionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EventSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventSubmissions
     * const eventSubmission = await prisma.eventSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends EventSubmissionUpdateManyArgs>(
      args: SelectSubset<T, EventSubmissionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one EventSubmission.
     * @param {EventSubmissionUpsertArgs} args - Arguments to update or create a EventSubmission.
     * @example
     * // Update or create a EventSubmission
     * const eventSubmission = await prisma.eventSubmission.upsert({
     *   create: {
     *     // ... data to create a EventSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventSubmission we want to update
     *   }
     * })
     **/
    upsert<T extends EventSubmissionUpsertArgs>(
      args: SelectSubset<T, EventSubmissionUpsertArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionClient<EventSubmission>,
      Prisma__EventSubmissionClient<EventSubmissionGetPayload<T>>
    >;

    /**
     * Count the number of EventSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionCountArgs} args - Arguments to filter EventSubmissions to count.
     * @example
     * // Count the number of EventSubmissions
     * const count = await prisma.eventSubmission.count({
     *   where: {
     *     // ... the filter for the EventSubmissions we want to count
     *   }
     * })
     **/
    count<T extends EventSubmissionCountArgs>(
      args?: Subset<T, EventSubmissionCountArgs>
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventSubmissionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EventSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventSubmissionAggregateArgs>(
      args: Subset<T, EventSubmissionAggregateArgs>
    ): PrismaPromise<GetEventSubmissionAggregateType<T>>;

    /**
     * Group by EventSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventSubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: EventSubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  'Field ',
                  P,
                  ` in "having" needs to be provided in "by"`
                ];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields]
    >(
      args: SubsetIntersection<T, EventSubmissionGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetEventSubmissionGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventSubmissionClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: 'query' | 'mutation',
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean
    );
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs = {}>(
      args?: Subset<T, UserArgs>
    ): CheckSelect<
      T,
      Prisma__UserClient<User | null>,
      Prisma__UserClient<UserGetPayload<T> | null>
    >;

    submissionItem<T extends EventSubmissionItemArgs = {}>(
      args?: Subset<T, EventSubmissionItemArgs>
    ): CheckSelect<
      T,
      Prisma__EventSubmissionItemClient<EventSubmissionItem | null>,
      Prisma__EventSubmissionItemClient<EventSubmissionItemGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * EventSubmission findUnique
   */
  export type EventSubmissionFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * Throw an Error if a EventSubmission can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventSubmission to fetch.
     *
     **/
    where: EventSubmissionWhereUniqueInput;
  };

  /**
   * EventSubmission findFirst
   */
  export type EventSubmissionFindFirstArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * Throw an Error if a EventSubmission can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which EventSubmission to fetch.
     *
     **/
    where?: EventSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventSubmissions to fetch.
     *
     **/
    orderBy?: Enumerable<EventSubmissionOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EventSubmissions.
     *
     **/
    cursor?: EventSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventSubmissions from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventSubmissions.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EventSubmissions.
     *
     **/
    distinct?: Enumerable<EventSubmissionScalarFieldEnum>;
  };

  /**
   * EventSubmission findMany
   */
  export type EventSubmissionFindManyArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * Filter, which EventSubmissions to fetch.
     *
     **/
    where?: EventSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EventSubmissions to fetch.
     *
     **/
    orderBy?: Enumerable<EventSubmissionOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EventSubmissions.
     *
     **/
    cursor?: EventSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EventSubmissions from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EventSubmissions.
     *
     **/
    skip?: number;
    distinct?: Enumerable<EventSubmissionScalarFieldEnum>;
  };

  /**
   * EventSubmission create
   */
  export type EventSubmissionCreateArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * The data needed to create a EventSubmission.
     *
     **/
    data: XOR<EventSubmissionCreateInput, EventSubmissionUncheckedCreateInput>;
  };

  /**
   * EventSubmission createMany
   */
  export type EventSubmissionCreateManyArgs = {
    data: Enumerable<EventSubmissionCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * EventSubmission update
   */
  export type EventSubmissionUpdateArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * The data needed to update a EventSubmission.
     *
     **/
    data: XOR<EventSubmissionUpdateInput, EventSubmissionUncheckedUpdateInput>;
    /**
     * Choose, which EventSubmission to update.
     *
     **/
    where: EventSubmissionWhereUniqueInput;
  };

  /**
   * EventSubmission updateMany
   */
  export type EventSubmissionUpdateManyArgs = {
    data: XOR<
      EventSubmissionUpdateManyMutationInput,
      EventSubmissionUncheckedUpdateManyInput
    >;
    where?: EventSubmissionWhereInput;
  };

  /**
   * EventSubmission upsert
   */
  export type EventSubmissionUpsertArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * The filter to search for the EventSubmission to update in case it exists.
     *
     **/
    where: EventSubmissionWhereUniqueInput;
    /**
     * In case the EventSubmission found by the `where` argument doesn't exist, create a new EventSubmission with this data.
     *
     **/
    create: XOR<
      EventSubmissionCreateInput,
      EventSubmissionUncheckedCreateInput
    >;
    /**
     * In case the EventSubmission was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      EventSubmissionUpdateInput,
      EventSubmissionUncheckedUpdateInput
    >;
  };

  /**
   * EventSubmission delete
   */
  export type EventSubmissionDeleteArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
    /**
     * Filter which EventSubmission to delete.
     *
     **/
    where: EventSubmissionWhereUniqueInput;
  };

  /**
   * EventSubmission deleteMany
   */
  export type EventSubmissionDeleteManyArgs = {
    where?: EventSubmissionWhereInput;
  };

  /**
   * EventSubmission without action
   */
  export type EventSubmissionArgs = {
    /**
     * Select specific fields to fetch from the EventSubmission
     *
     **/
    select?: EventSubmissionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: EventSubmissionInclude | null;
  };

  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const TenantScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    name: 'name';
    shortName: 'shortName';
  };

  export type TenantScalarFieldEnum =
    typeof TenantScalarFieldEnum[keyof typeof TenantScalarFieldEnum];

  export const UserScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    authId: 'authId';
    firstName: 'firstName';
    lastName: 'lastName';
    email: 'email';
    email_verified: 'email_verified';
    picture: 'picture';
    birthdate: 'birthdate';
  };

  export type UserScalarFieldEnum =
    typeof UserScalarFieldEnum[keyof typeof UserScalarFieldEnum];

  export const UsersOfTenantsScalarFieldEnum: {
    createdAt: 'createdAt';
    userId: 'userId';
    tenantId: 'tenantId';
    role: 'role';
    status: 'status';
  };

  export type UsersOfTenantsScalarFieldEnum =
    typeof UsersOfTenantsScalarFieldEnum[keyof typeof UsersOfTenantsScalarFieldEnum];

  export const EventOrganizerScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    tenantId: 'tenantId';
    name: 'name';
    text: 'text';
    link: 'link';
  };

  export type EventOrganizerScalarFieldEnum =
    typeof EventOrganizerScalarFieldEnum[keyof typeof EventOrganizerScalarFieldEnum];

  export const EventTemplateScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    title: 'title';
    icon: 'icon';
    description: 'description';
    comment: 'comment';
    location: 'location';
    locationId: 'locationId';
    duration: 'duration';
    participantText: 'participantText';
    participantMail: 'participantMail';
    organizerText: 'organizerText';
    finances: 'finances';
    tenantId: 'tenantId';
  };

  export type EventTemplateScalarFieldEnum =
    typeof EventTemplateScalarFieldEnum[keyof typeof EventTemplateScalarFieldEnum];

  export const TumiEventScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    title: 'title';
    icon: 'icon';
    start: 'start';
    end: 'end';
    description: 'description';
    location: 'location';
    locationId: 'locationId';
    participantText: 'participantText';
    participantMail: 'participantMail';
    organizerText: 'organizerText';
    participantLimit: 'participantLimit';
    organizerLimit: 'organizerLimit';
    price: 'price';
    registrationLink: 'registrationLink';
    registrationMode: 'registrationMode';
    publicationState: 'publicationState';
    participantSignup: 'participantSignup';
    organizerSignup: 'organizerSignup';
    eventOrganizerId: 'eventOrganizerId';
    creatorId: 'creatorId';
    eventTemplateId: 'eventTemplateId';
  };

  export type TumiEventScalarFieldEnum =
    typeof TumiEventScalarFieldEnum[keyof typeof TumiEventScalarFieldEnum];

  export const CostItemScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    eventId: 'eventId';
    name: 'name';
    ammount: 'ammount';
  };

  export type CostItemScalarFieldEnum =
    typeof CostItemScalarFieldEnum[keyof typeof CostItemScalarFieldEnum];

  export const ReceiptScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    userId: 'userId';
    costItemId: 'costItemId';
    covered: 'covered';
    amount: 'amount';
    date: 'date';
    amountCovered: 'amountCovered';
  };

  export type ReceiptScalarFieldEnum =
    typeof ReceiptScalarFieldEnum[keyof typeof ReceiptScalarFieldEnum];

  export const PhotoShareScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    eventId: 'eventId';
  };

  export type PhotoShareScalarFieldEnum =
    typeof PhotoShareScalarFieldEnum[keyof typeof PhotoShareScalarFieldEnum];

  export const EventRegistrationScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    type: 'type';
    userId: 'userId';
    eventId: 'eventId';
  };

  export type EventRegistrationScalarFieldEnum =
    typeof EventRegistrationScalarFieldEnum[keyof typeof EventRegistrationScalarFieldEnum];

  export const EventSubmissionItemScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    eventId: 'eventId';
    required: 'required';
    submissionTime: 'submissionTime';
  };

  export type EventSubmissionItemScalarFieldEnum =
    typeof EventSubmissionItemScalarFieldEnum[keyof typeof EventSubmissionItemScalarFieldEnum];

  export const EventSubmissionScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    userId: 'userId';
    submissionItemId: 'submissionItemId';
  };

  export type EventSubmissionScalarFieldEnum =
    typeof EventSubmissionScalarFieldEnum[keyof typeof EventSubmissionScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = typeof SortOrder[keyof typeof SortOrder];

  export const JsonNullValueInput: {
    JsonNull: 'JsonNull';
  };

  export type JsonNullValueInput =
    typeof JsonNullValueInput[keyof typeof JsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = typeof QueryMode[keyof typeof QueryMode];

  export const JsonNullValueFilter: {
    DbNull: 'DbNull';
    JsonNull: 'JsonNull';
    AnyNull: 'AnyNull';
  };

  export type JsonNullValueFilter =
    typeof JsonNullValueFilter[keyof typeof JsonNullValueFilter];

  /**
   * Deep Input Types
   */

  export type TenantWhereInput = {
    AND?: Enumerable<TenantWhereInput>;
    OR?: Enumerable<TenantWhereInput>;
    NOT?: Enumerable<TenantWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    users?: UsersOfTenantsListRelationFilter;
    name?: StringFilter | string;
    shortName?: StringFilter | string;
    eventTemplates?: EventTemplateListRelationFilter;
    organizers?: EventOrganizerListRelationFilter;
  };

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    users?: UsersOfTenantsOrderByRelationAggregateInput;
    name?: SortOrder;
    shortName?: SortOrder;
    eventTemplates?: EventTemplateOrderByRelationAggregateInput;
    organizers?: EventOrganizerOrderByRelationAggregateInput;
  };

  export type TenantWhereUniqueInput = {
    id?: string;
    shortName?: string;
  };

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    name?: SortOrder;
    shortName?: SortOrder;
    _count?: TenantCountOrderByAggregateInput;
    _max?: TenantMaxOrderByAggregateInput;
    _min?: TenantMinOrderByAggregateInput;
  };

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TenantScalarWhereWithAggregatesInput>;
    OR?: Enumerable<TenantScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<TenantScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    name?: StringWithAggregatesFilter | string;
    shortName?: StringWithAggregatesFilter | string;
  };

  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>;
    OR?: Enumerable<UserWhereInput>;
    NOT?: Enumerable<UserWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    authId?: StringFilter | string;
    firstName?: StringFilter | string;
    lastName?: StringFilter | string;
    email?: StringFilter | string;
    email_verified?: BoolFilter | boolean;
    picture?: StringFilter | string;
    birthdate?: DateTimeFilter | Date | string;
    tenants?: UsersOfTenantsListRelationFilter;
    eventSubmissions?: EventSubmissionListRelationFilter;
    eventRegistrations?: EventRegistrationListRelationFilter;
    receipts?: ReceiptListRelationFilter;
    createdEvents?: TumiEventListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    authId?: SortOrder;
    firstName?: SortOrder;
    lastName?: SortOrder;
    email?: SortOrder;
    email_verified?: SortOrder;
    picture?: SortOrder;
    birthdate?: SortOrder;
    tenants?: UsersOfTenantsOrderByRelationAggregateInput;
    eventSubmissions?: EventSubmissionOrderByRelationAggregateInput;
    eventRegistrations?: EventRegistrationOrderByRelationAggregateInput;
    receipts?: ReceiptOrderByRelationAggregateInput;
    createdEvents?: TumiEventOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = {
    id?: string;
    authId?: string;
  };

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    authId?: SortOrder;
    firstName?: SortOrder;
    lastName?: SortOrder;
    email?: SortOrder;
    email_verified?: SortOrder;
    picture?: SortOrder;
    birthdate?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>;
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    authId?: StringWithAggregatesFilter | string;
    firstName?: StringWithAggregatesFilter | string;
    lastName?: StringWithAggregatesFilter | string;
    email?: StringWithAggregatesFilter | string;
    email_verified?: BoolWithAggregatesFilter | boolean;
    picture?: StringWithAggregatesFilter | string;
    birthdate?: DateTimeWithAggregatesFilter | Date | string;
  };

  export type UsersOfTenantsWhereInput = {
    AND?: Enumerable<UsersOfTenantsWhereInput>;
    OR?: Enumerable<UsersOfTenantsWhereInput>;
    NOT?: Enumerable<UsersOfTenantsWhereInput>;
    createdAt?: DateTimeFilter | Date | string;
    user?: XOR<UserRelationFilter, UserWhereInput>;
    userId?: StringFilter | string;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    role?: EnumRoleFilter | Role;
    status?: EnumMembershipStatusFilter | MembershipStatus;
  };

  export type UsersOfTenantsOrderByWithRelationInput = {
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    userId?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    role?: SortOrder;
    status?: SortOrder;
  };

  export type UsersOfTenantsWhereUniqueInput = {
    userId_tenantId?: UsersOfTenantsUserIdTenantIdCompoundUniqueInput;
  };

  export type UsersOfTenantsOrderByWithAggregationInput = {
    createdAt?: SortOrder;
    userId?: SortOrder;
    tenantId?: SortOrder;
    role?: SortOrder;
    status?: SortOrder;
    _count?: UsersOfTenantsCountOrderByAggregateInput;
    _max?: UsersOfTenantsMaxOrderByAggregateInput;
    _min?: UsersOfTenantsMinOrderByAggregateInput;
  };

  export type UsersOfTenantsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UsersOfTenantsScalarWhereWithAggregatesInput>;
    OR?: Enumerable<UsersOfTenantsScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<UsersOfTenantsScalarWhereWithAggregatesInput>;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    userId?: StringWithAggregatesFilter | string;
    tenantId?: StringWithAggregatesFilter | string;
    role?: EnumRoleWithAggregatesFilter | Role;
    status?: EnumMembershipStatusWithAggregatesFilter | MembershipStatus;
  };

  export type EventOrganizerWhereInput = {
    AND?: Enumerable<EventOrganizerWhereInput>;
    OR?: Enumerable<EventOrganizerWhereInput>;
    NOT?: Enumerable<EventOrganizerWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    name?: StringFilter | string;
    text?: StringFilter | string;
    link?: StringNullableFilter | string | null;
    events?: TumiEventListRelationFilter;
  };

  export type EventOrganizerOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    name?: SortOrder;
    text?: SortOrder;
    link?: SortOrder;
    events?: TumiEventOrderByRelationAggregateInput;
  };

  export type EventOrganizerWhereUniqueInput = {
    id?: string;
  };

  export type EventOrganizerOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    tenantId?: SortOrder;
    name?: SortOrder;
    text?: SortOrder;
    link?: SortOrder;
    _count?: EventOrganizerCountOrderByAggregateInput;
    _max?: EventOrganizerMaxOrderByAggregateInput;
    _min?: EventOrganizerMinOrderByAggregateInput;
  };

  export type EventOrganizerScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventOrganizerScalarWhereWithAggregatesInput>;
    OR?: Enumerable<EventOrganizerScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<EventOrganizerScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    tenantId?: StringWithAggregatesFilter | string;
    name?: StringWithAggregatesFilter | string;
    text?: StringWithAggregatesFilter | string;
    link?: StringNullableWithAggregatesFilter | string | null;
  };

  export type EventTemplateWhereInput = {
    AND?: Enumerable<EventTemplateWhereInput>;
    OR?: Enumerable<EventTemplateWhereInput>;
    NOT?: Enumerable<EventTemplateWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    title?: StringFilter | string;
    icon?: StringFilter | string;
    description?: StringFilter | string;
    comment?: StringFilter | string;
    location?: StringFilter | string;
    locationId?: StringFilter | string;
    duration?: DecimalFilter | Decimal | number | string;
    participantText?: StringFilter | string;
    participantMail?: StringFilter | string;
    organizerText?: StringFilter | string;
    finances?: JsonFilter;
    eventInstances?: TumiEventListRelationFilter;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
  };

  export type EventTemplateOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    comment?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    duration?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    finances?: SortOrder;
    eventInstances?: TumiEventOrderByRelationAggregateInput;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
  };

  export type EventTemplateWhereUniqueInput = {
    id?: string;
  };

  export type EventTemplateOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    comment?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    duration?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    finances?: SortOrder;
    tenantId?: SortOrder;
    _count?: EventTemplateCountOrderByAggregateInput;
    _avg?: EventTemplateAvgOrderByAggregateInput;
    _max?: EventTemplateMaxOrderByAggregateInput;
    _min?: EventTemplateMinOrderByAggregateInput;
    _sum?: EventTemplateSumOrderByAggregateInput;
  };

  export type EventTemplateScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventTemplateScalarWhereWithAggregatesInput>;
    OR?: Enumerable<EventTemplateScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<EventTemplateScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    title?: StringWithAggregatesFilter | string;
    icon?: StringWithAggregatesFilter | string;
    description?: StringWithAggregatesFilter | string;
    comment?: StringWithAggregatesFilter | string;
    location?: StringWithAggregatesFilter | string;
    locationId?: StringWithAggregatesFilter | string;
    duration?: DecimalWithAggregatesFilter | Decimal | number | string;
    participantText?: StringWithAggregatesFilter | string;
    participantMail?: StringWithAggregatesFilter | string;
    organizerText?: StringWithAggregatesFilter | string;
    finances?: JsonWithAggregatesFilter;
    tenantId?: StringWithAggregatesFilter | string;
  };

  export type TumiEventWhereInput = {
    AND?: Enumerable<TumiEventWhereInput>;
    OR?: Enumerable<TumiEventWhereInput>;
    NOT?: Enumerable<TumiEventWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    title?: StringFilter | string;
    icon?: StringFilter | string;
    start?: DateTimeFilter | Date | string;
    end?: DateTimeFilter | Date | string;
    description?: StringFilter | string;
    location?: StringFilter | string;
    locationId?: StringFilter | string;
    participantText?: StringFilter | string;
    participantMail?: StringFilter | string;
    organizerText?: StringFilter | string;
    participantLimit?: IntFilter | number;
    organizerLimit?: IntFilter | number;
    price?: DecimalNullableFilter | Decimal | number | string | null;
    registrationLink?: StringNullableFilter | string | null;
    registrationMode?: EnumRegistrationModeFilter | RegistrationMode;
    publicationState?: EnumPublicationStateFilter | PublicationState;
    participantSignup?: EnumMembershipStatusNullableListFilter;
    organizerSignup?: EnumMembershipStatusNullableListFilter;
    submissionItems?: EventSubmissionItemListRelationFilter;
    registrations?: EventRegistrationListRelationFilter;
    costItems?: CostItemListRelationFilter;
    photoShare?: XOR<PhotoShareRelationFilter, PhotoShareWhereInput> | null;
    organizer?: XOR<EventOrganizerRelationFilter, EventOrganizerWhereInput>;
    eventOrganizerId?: StringFilter | string;
    createdBy?: XOR<UserRelationFilter, UserWhereInput>;
    creatorId?: StringFilter | string;
    eventTemplate?: XOR<EventTemplateRelationFilter, EventTemplateWhereInput>;
    eventTemplateId?: StringFilter | string;
  };

  export type TumiEventOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    start?: SortOrder;
    end?: SortOrder;
    description?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
    registrationLink?: SortOrder;
    registrationMode?: SortOrder;
    publicationState?: SortOrder;
    participantSignup?: SortOrder;
    organizerSignup?: SortOrder;
    submissionItems?: EventSubmissionItemOrderByRelationAggregateInput;
    registrations?: EventRegistrationOrderByRelationAggregateInput;
    costItems?: CostItemOrderByRelationAggregateInput;
    photoShare?: PhotoShareOrderByWithRelationInput;
    organizer?: EventOrganizerOrderByWithRelationInput;
    eventOrganizerId?: SortOrder;
    createdBy?: UserOrderByWithRelationInput;
    creatorId?: SortOrder;
    eventTemplate?: EventTemplateOrderByWithRelationInput;
    eventTemplateId?: SortOrder;
  };

  export type TumiEventWhereUniqueInput = {
    id?: string;
  };

  export type TumiEventOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    start?: SortOrder;
    end?: SortOrder;
    description?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
    registrationLink?: SortOrder;
    registrationMode?: SortOrder;
    publicationState?: SortOrder;
    participantSignup?: SortOrder;
    organizerSignup?: SortOrder;
    eventOrganizerId?: SortOrder;
    creatorId?: SortOrder;
    eventTemplateId?: SortOrder;
    _count?: TumiEventCountOrderByAggregateInput;
    _avg?: TumiEventAvgOrderByAggregateInput;
    _max?: TumiEventMaxOrderByAggregateInput;
    _min?: TumiEventMinOrderByAggregateInput;
    _sum?: TumiEventSumOrderByAggregateInput;
  };

  export type TumiEventScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TumiEventScalarWhereWithAggregatesInput>;
    OR?: Enumerable<TumiEventScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<TumiEventScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    title?: StringWithAggregatesFilter | string;
    icon?: StringWithAggregatesFilter | string;
    start?: DateTimeWithAggregatesFilter | Date | string;
    end?: DateTimeWithAggregatesFilter | Date | string;
    description?: StringWithAggregatesFilter | string;
    location?: StringWithAggregatesFilter | string;
    locationId?: StringWithAggregatesFilter | string;
    participantText?: StringWithAggregatesFilter | string;
    participantMail?: StringWithAggregatesFilter | string;
    organizerText?: StringWithAggregatesFilter | string;
    participantLimit?: IntWithAggregatesFilter | number;
    organizerLimit?: IntWithAggregatesFilter | number;
    price?:
      | DecimalNullableWithAggregatesFilter
      | Decimal
      | number
      | string
      | null;
    registrationLink?: StringNullableWithAggregatesFilter | string | null;
    registrationMode?:
      | EnumRegistrationModeWithAggregatesFilter
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateWithAggregatesFilter
      | PublicationState;
    participantSignup?: EnumMembershipStatusNullableListFilter;
    organizerSignup?: EnumMembershipStatusNullableListFilter;
    eventOrganizerId?: StringWithAggregatesFilter | string;
    creatorId?: StringWithAggregatesFilter | string;
    eventTemplateId?: StringWithAggregatesFilter | string;
  };

  export type CostItemWhereInput = {
    AND?: Enumerable<CostItemWhereInput>;
    OR?: Enumerable<CostItemWhereInput>;
    NOT?: Enumerable<CostItemWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    event?: XOR<TumiEventRelationFilter, TumiEventWhereInput>;
    eventId?: StringFilter | string;
    name?: StringFilter | string;
    ammount?: DecimalFilter | Decimal | number | string;
    receipts?: ReceiptListRelationFilter;
  };

  export type CostItemOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    event?: TumiEventOrderByWithRelationInput;
    eventId?: SortOrder;
    name?: SortOrder;
    ammount?: SortOrder;
    receipts?: ReceiptOrderByRelationAggregateInput;
  };

  export type CostItemWhereUniqueInput = {
    id?: string;
  };

  export type CostItemOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    name?: SortOrder;
    ammount?: SortOrder;
    _count?: CostItemCountOrderByAggregateInput;
    _avg?: CostItemAvgOrderByAggregateInput;
    _max?: CostItemMaxOrderByAggregateInput;
    _min?: CostItemMinOrderByAggregateInput;
    _sum?: CostItemSumOrderByAggregateInput;
  };

  export type CostItemScalarWhereWithAggregatesInput = {
    AND?: Enumerable<CostItemScalarWhereWithAggregatesInput>;
    OR?: Enumerable<CostItemScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<CostItemScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    eventId?: StringWithAggregatesFilter | string;
    name?: StringWithAggregatesFilter | string;
    ammount?: DecimalWithAggregatesFilter | Decimal | number | string;
  };

  export type ReceiptWhereInput = {
    AND?: Enumerable<ReceiptWhereInput>;
    OR?: Enumerable<ReceiptWhereInput>;
    NOT?: Enumerable<ReceiptWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    user?: XOR<UserRelationFilter, UserWhereInput>;
    userId?: StringFilter | string;
    costItem?: XOR<CostItemRelationFilter, CostItemWhereInput>;
    costItemId?: StringFilter | string;
    covered?: BoolFilter | boolean;
    amount?: IntFilter | number;
    date?: DateTimeFilter | Date | string;
    amountCovered?: IntFilter | number;
  };

  export type ReceiptOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    userId?: SortOrder;
    costItem?: CostItemOrderByWithRelationInput;
    costItemId?: SortOrder;
    covered?: SortOrder;
    amount?: SortOrder;
    date?: SortOrder;
    amountCovered?: SortOrder;
  };

  export type ReceiptWhereUniqueInput = {
    id?: string;
  };

  export type ReceiptOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    costItemId?: SortOrder;
    covered?: SortOrder;
    amount?: SortOrder;
    date?: SortOrder;
    amountCovered?: SortOrder;
    _count?: ReceiptCountOrderByAggregateInput;
    _avg?: ReceiptAvgOrderByAggregateInput;
    _max?: ReceiptMaxOrderByAggregateInput;
    _min?: ReceiptMinOrderByAggregateInput;
    _sum?: ReceiptSumOrderByAggregateInput;
  };

  export type ReceiptScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ReceiptScalarWhereWithAggregatesInput>;
    OR?: Enumerable<ReceiptScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<ReceiptScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    userId?: StringWithAggregatesFilter | string;
    costItemId?: StringWithAggregatesFilter | string;
    covered?: BoolWithAggregatesFilter | boolean;
    amount?: IntWithAggregatesFilter | number;
    date?: DateTimeWithAggregatesFilter | Date | string;
    amountCovered?: IntWithAggregatesFilter | number;
  };

  export type PhotoShareWhereInput = {
    AND?: Enumerable<PhotoShareWhereInput>;
    OR?: Enumerable<PhotoShareWhereInput>;
    NOT?: Enumerable<PhotoShareWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    event?: XOR<TumiEventRelationFilter, TumiEventWhereInput>;
    eventId?: StringFilter | string;
  };

  export type PhotoShareOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    event?: TumiEventOrderByWithRelationInput;
    eventId?: SortOrder;
  };

  export type PhotoShareWhereUniqueInput = {
    id?: string;
  };

  export type PhotoShareOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    _count?: PhotoShareCountOrderByAggregateInput;
    _max?: PhotoShareMaxOrderByAggregateInput;
    _min?: PhotoShareMinOrderByAggregateInput;
  };

  export type PhotoShareScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PhotoShareScalarWhereWithAggregatesInput>;
    OR?: Enumerable<PhotoShareScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<PhotoShareScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    eventId?: StringWithAggregatesFilter | string;
  };

  export type EventRegistrationWhereInput = {
    AND?: Enumerable<EventRegistrationWhereInput>;
    OR?: Enumerable<EventRegistrationWhereInput>;
    NOT?: Enumerable<EventRegistrationWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    type?: EnumRegistrationTypeFilter | RegistrationType;
    user?: XOR<UserRelationFilter, UserWhereInput>;
    userId?: StringFilter | string;
    event?: XOR<TumiEventRelationFilter, TumiEventWhereInput>;
    eventId?: StringFilter | string;
  };

  export type EventRegistrationOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    type?: SortOrder;
    user?: UserOrderByWithRelationInput;
    userId?: SortOrder;
    event?: TumiEventOrderByWithRelationInput;
    eventId?: SortOrder;
  };

  export type EventRegistrationWhereUniqueInput = {
    id?: string;
    userId_eventId?: EventRegistrationUserIdEventIdCompoundUniqueInput;
  };

  export type EventRegistrationOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    type?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
    _count?: EventRegistrationCountOrderByAggregateInput;
    _max?: EventRegistrationMaxOrderByAggregateInput;
    _min?: EventRegistrationMinOrderByAggregateInput;
  };

  export type EventRegistrationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventRegistrationScalarWhereWithAggregatesInput>;
    OR?: Enumerable<EventRegistrationScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<EventRegistrationScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    type?: EnumRegistrationTypeWithAggregatesFilter | RegistrationType;
    userId?: StringWithAggregatesFilter | string;
    eventId?: StringWithAggregatesFilter | string;
  };

  export type EventSubmissionItemWhereInput = {
    AND?: Enumerable<EventSubmissionItemWhereInput>;
    OR?: Enumerable<EventSubmissionItemWhereInput>;
    NOT?: Enumerable<EventSubmissionItemWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    event?: XOR<TumiEventRelationFilter, TumiEventWhereInput>;
    eventId?: StringFilter | string;
    required?: BoolFilter | boolean;
    submissionTime?: EnumSubmissionTimeFilter | SubmissionTime;
    submissions?: EventSubmissionListRelationFilter;
  };

  export type EventSubmissionItemOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    event?: TumiEventOrderByWithRelationInput;
    eventId?: SortOrder;
    required?: SortOrder;
    submissionTime?: SortOrder;
    submissions?: EventSubmissionOrderByRelationAggregateInput;
  };

  export type EventSubmissionItemWhereUniqueInput = {
    id?: string;
  };

  export type EventSubmissionItemOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    required?: SortOrder;
    submissionTime?: SortOrder;
    _count?: EventSubmissionItemCountOrderByAggregateInput;
    _max?: EventSubmissionItemMaxOrderByAggregateInput;
    _min?: EventSubmissionItemMinOrderByAggregateInput;
  };

  export type EventSubmissionItemScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventSubmissionItemScalarWhereWithAggregatesInput>;
    OR?: Enumerable<EventSubmissionItemScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<EventSubmissionItemScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    eventId?: StringWithAggregatesFilter | string;
    required?: BoolWithAggregatesFilter | boolean;
    submissionTime?: EnumSubmissionTimeWithAggregatesFilter | SubmissionTime;
  };

  export type EventSubmissionWhereInput = {
    AND?: Enumerable<EventSubmissionWhereInput>;
    OR?: Enumerable<EventSubmissionWhereInput>;
    NOT?: Enumerable<EventSubmissionWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    user?: XOR<UserRelationFilter, UserWhereInput>;
    userId?: StringFilter | string;
    submissionItem?: XOR<
      EventSubmissionItemRelationFilter,
      EventSubmissionItemWhereInput
    >;
    submissionItemId?: StringFilter | string;
  };

  export type EventSubmissionOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    userId?: SortOrder;
    submissionItem?: EventSubmissionItemOrderByWithRelationInput;
    submissionItemId?: SortOrder;
  };

  export type EventSubmissionWhereUniqueInput = {
    id?: string;
  };

  export type EventSubmissionOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    submissionItemId?: SortOrder;
    _count?: EventSubmissionCountOrderByAggregateInput;
    _max?: EventSubmissionMaxOrderByAggregateInput;
    _min?: EventSubmissionMinOrderByAggregateInput;
  };

  export type EventSubmissionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventSubmissionScalarWhereWithAggregatesInput>;
    OR?: Enumerable<EventSubmissionScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<EventSubmissionScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    userId?: StringWithAggregatesFilter | string;
    submissionItemId?: StringWithAggregatesFilter | string;
  };

  export type TenantCreateInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    users?: UsersOfTenantsCreateNestedManyWithoutTenantInput;
    eventTemplates?: EventTemplateCreateNestedManyWithoutTenantInput;
    organizers?: EventOrganizerCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    users?: UsersOfTenantsUncheckedCreateNestedManyWithoutTenantInput;
    eventTemplates?: EventTemplateUncheckedCreateNestedManyWithoutTenantInput;
    organizers?: EventOrganizerUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    users?: UsersOfTenantsUpdateManyWithoutTenantInput;
    eventTemplates?: EventTemplateUpdateManyWithoutTenantInput;
    organizers?: EventOrganizerUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    users?: UsersOfTenantsUncheckedUpdateManyWithoutTenantInput;
    eventTemplates?: EventTemplateUncheckedUpdateManyWithoutTenantInput;
    organizers?: EventOrganizerUncheckedUpdateManyWithoutTenantInput;
  };

  export type TenantCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
  };

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
  };

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
  };

  export type UserCreateInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationCreateNestedManyWithoutUserInput;
    receipts?: ReceiptCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventCreateNestedManyWithoutCreatedByInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsUncheckedCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedCreateNestedManyWithoutUserInput;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedCreateNestedManyWithoutCreatedByInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUpdateManyWithoutUserInput;
    receipts?: ReceiptUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUpdateManyWithoutCreatedByInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUncheckedUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedUpdateManyWithoutUserInput;
    receipts?: ReceiptUncheckedUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedUpdateManyWithoutCreatedByInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UsersOfTenantsCreateInput = {
    createdAt?: Date | string;
    role?: Role;
    status?: MembershipStatus;
    user: UserCreateNestedOneWithoutTenantsInput;
    tenant: TenantCreateNestedOneWithoutUsersInput;
  };

  export type UsersOfTenantsUncheckedCreateInput = {
    createdAt?: Date | string;
    userId: string;
    tenantId: string;
    role?: Role;
    status?: MembershipStatus;
  };

  export type UsersOfTenantsUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
    user?: UserUpdateOneRequiredWithoutTenantsInput;
    tenant?: TenantUpdateOneRequiredWithoutUsersInput;
  };

  export type UsersOfTenantsUncheckedUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type UsersOfTenantsCreateManyInput = {
    createdAt?: Date | string;
    userId: string;
    tenantId: string;
    role?: Role;
    status?: MembershipStatus;
  };

  export type UsersOfTenantsUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type UsersOfTenantsUncheckedUpdateManyInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type EventOrganizerCreateInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    text: string;
    link?: string | null;
    tenant: TenantCreateNestedOneWithoutOrganizersInput;
    events?: TumiEventCreateNestedManyWithoutOrganizerInput;
  };

  export type EventOrganizerUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    tenantId: string;
    name: string;
    text: string;
    link?: string | null;
    events?: TumiEventUncheckedCreateNestedManyWithoutOrganizerInput;
  };

  export type EventOrganizerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
    tenant?: TenantUpdateOneRequiredWithoutOrganizersInput;
    events?: TumiEventUpdateManyWithoutOrganizerInput;
  };

  export type EventOrganizerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
    events?: TumiEventUncheckedUpdateManyWithoutOrganizerInput;
  };

  export type EventOrganizerCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    tenantId: string;
    name: string;
    text: string;
    link?: string | null;
  };

  export type EventOrganizerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type EventOrganizerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type EventTemplateCreateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    eventInstances?: TumiEventCreateNestedManyWithoutEventTemplateInput;
    tenant: TenantCreateNestedOneWithoutEventTemplatesInput;
  };

  export type EventTemplateUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    tenantId: string;
    eventInstances?: TumiEventUncheckedCreateNestedManyWithoutEventTemplateInput;
  };

  export type EventTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    eventInstances?: TumiEventUpdateManyWithoutEventTemplateInput;
    tenant?: TenantUpdateOneRequiredWithoutEventTemplatesInput;
  };

  export type EventTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    tenantId?: StringFieldUpdateOperationsInput | string;
    eventInstances?: TumiEventUncheckedUpdateManyWithoutEventTemplateInput;
  };

  export type EventTemplateCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    tenantId: string;
  };

  export type EventTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
  };

  export type EventTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type TumiEventCreateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type TumiEventCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateManyparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateManyorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type TumiEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type TumiEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type CostItemCreateInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    ammount: Decimal | number | string;
    event: TumiEventCreateNestedOneWithoutCostItemsInput;
    receipts?: ReceiptCreateNestedManyWithoutCostItemInput;
  };

  export type CostItemUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
    name: string;
    ammount: Decimal | number | string;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutCostItemInput;
  };

  export type CostItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    event?: TumiEventUpdateOneRequiredWithoutCostItemsInput;
    receipts?: ReceiptUpdateManyWithoutCostItemInput;
  };

  export type CostItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    receipts?: ReceiptUncheckedUpdateManyWithoutCostItemInput;
  };

  export type CostItemCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
    name: string;
    ammount: Decimal | number | string;
  };

  export type CostItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
  };

  export type CostItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
  };

  export type ReceiptCreateInput = {
    id?: string;
    createdAt?: Date | string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
    user: UserCreateNestedOneWithoutReceiptsInput;
    costItem: CostItemCreateNestedOneWithoutReceiptsInput;
  };

  export type ReceiptUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
    costItemId: string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
  };

  export type ReceiptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutReceiptsInput;
    costItem?: CostItemUpdateOneRequiredWithoutReceiptsInput;
  };

  export type ReceiptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    costItemId?: StringFieldUpdateOperationsInput | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
  };

  export type ReceiptCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
    costItemId: string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
  };

  export type ReceiptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
  };

  export type ReceiptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    costItemId?: StringFieldUpdateOperationsInput | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
  };

  export type PhotoShareCreateInput = {
    id?: string;
    createdAt?: Date | string;
    event: TumiEventCreateNestedOneWithoutPhotoShareInput;
  };

  export type PhotoShareUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
  };

  export type PhotoShareUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    event?: TumiEventUpdateOneRequiredWithoutPhotoShareInput;
  };

  export type PhotoShareUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
  };

  export type PhotoShareCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
  };

  export type PhotoShareUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PhotoShareUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventRegistrationCreateInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    user: UserCreateNestedOneWithoutEventRegistrationsInput;
    event: TumiEventCreateNestedOneWithoutRegistrationsInput;
  };

  export type EventRegistrationUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    userId: string;
    eventId: string;
  };

  export type EventRegistrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    user?: UserUpdateOneRequiredWithoutEventRegistrationsInput;
    event?: TumiEventUpdateOneRequiredWithoutRegistrationsInput;
  };

  export type EventRegistrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    userId?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventRegistrationCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    userId: string;
    eventId: string;
  };

  export type EventRegistrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
  };

  export type EventRegistrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    userId?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventSubmissionItemCreateInput = {
    id?: string;
    createdAt?: Date | string;
    required: boolean;
    submissionTime: SubmissionTime;
    event: TumiEventCreateNestedOneWithoutSubmissionItemsInput;
    submissions?: EventSubmissionCreateNestedManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
    required: boolean;
    submissionTime: SubmissionTime;
    submissions?: EventSubmissionUncheckedCreateNestedManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
    event?: TumiEventUpdateOneRequiredWithoutSubmissionItemsInput;
    submissions?: EventSubmissionUpdateManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
    submissions?: EventSubmissionUncheckedUpdateManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
    required: boolean;
    submissionTime: SubmissionTime;
  };

  export type EventSubmissionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
  };

  export type EventSubmissionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
  };

  export type EventSubmissionCreateInput = {
    id?: string;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutEventSubmissionsInput;
    submissionItem: EventSubmissionItemCreateNestedOneWithoutSubmissionsInput;
  };

  export type EventSubmissionUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
    submissionItemId: string;
  };

  export type EventSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutEventSubmissionsInput;
    submissionItem?: EventSubmissionItemUpdateOneRequiredWithoutSubmissionsInput;
  };

  export type EventSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    submissionItemId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventSubmissionCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
    submissionItemId: string;
  };

  export type EventSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    submissionItemId?: StringFieldUpdateOperationsInput | string;
  };

  export type StringFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringFilter | string;
  };

  export type DateTimeFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeFilter | Date | string;
  };

  export type UsersOfTenantsListRelationFilter = {
    every?: UsersOfTenantsWhereInput;
    some?: UsersOfTenantsWhereInput;
    none?: UsersOfTenantsWhereInput;
  };

  export type EventTemplateListRelationFilter = {
    every?: EventTemplateWhereInput;
    some?: EventTemplateWhereInput;
    none?: EventTemplateWhereInput;
  };

  export type EventOrganizerListRelationFilter = {
    every?: EventOrganizerWhereInput;
    some?: EventOrganizerWhereInput;
    none?: EventOrganizerWhereInput;
  };

  export type UsersOfTenantsOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type EventTemplateOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type EventOrganizerOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    name?: SortOrder;
    shortName?: SortOrder;
  };

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    name?: SortOrder;
    shortName?: SortOrder;
  };

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    name?: SortOrder;
    shortName?: SortOrder;
  };

  export type StringWithAggregatesFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter | string;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
  };

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeWithAggregatesFilter | Date | string;
    _count?: NestedIntFilter;
    _min?: NestedDateTimeFilter;
    _max?: NestedDateTimeFilter;
  };

  export type BoolFilter = {
    equals?: boolean;
    not?: NestedBoolFilter | boolean;
  };

  export type EventSubmissionListRelationFilter = {
    every?: EventSubmissionWhereInput;
    some?: EventSubmissionWhereInput;
    none?: EventSubmissionWhereInput;
  };

  export type EventRegistrationListRelationFilter = {
    every?: EventRegistrationWhereInput;
    some?: EventRegistrationWhereInput;
    none?: EventRegistrationWhereInput;
  };

  export type ReceiptListRelationFilter = {
    every?: ReceiptWhereInput;
    some?: ReceiptWhereInput;
    none?: ReceiptWhereInput;
  };

  export type TumiEventListRelationFilter = {
    every?: TumiEventWhereInput;
    some?: TumiEventWhereInput;
    none?: TumiEventWhereInput;
  };

  export type EventSubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type EventRegistrationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ReceiptOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TumiEventOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    authId?: SortOrder;
    firstName?: SortOrder;
    lastName?: SortOrder;
    email?: SortOrder;
    email_verified?: SortOrder;
    picture?: SortOrder;
    birthdate?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    authId?: SortOrder;
    firstName?: SortOrder;
    lastName?: SortOrder;
    email?: SortOrder;
    email_verified?: SortOrder;
    picture?: SortOrder;
    birthdate?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    authId?: SortOrder;
    firstName?: SortOrder;
    lastName?: SortOrder;
    email?: SortOrder;
    email_verified?: SortOrder;
    picture?: SortOrder;
    birthdate?: SortOrder;
  };

  export type BoolWithAggregatesFilter = {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter | boolean;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
  };

  export type UserRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type TenantRelationFilter = {
    is?: TenantWhereInput;
    isNot?: TenantWhereInput;
  };

  export type EnumRoleFilter = {
    equals?: Role;
    in?: Enumerable<Role>;
    notIn?: Enumerable<Role>;
    not?: NestedEnumRoleFilter | Role;
  };

  export type EnumMembershipStatusFilter = {
    equals?: MembershipStatus;
    in?: Enumerable<MembershipStatus>;
    notIn?: Enumerable<MembershipStatus>;
    not?: NestedEnumMembershipStatusFilter | MembershipStatus;
  };

  export type UsersOfTenantsUserIdTenantIdCompoundUniqueInput = {
    userId: string;
    tenantId: string;
  };

  export type UsersOfTenantsCountOrderByAggregateInput = {
    createdAt?: SortOrder;
    userId?: SortOrder;
    tenantId?: SortOrder;
    role?: SortOrder;
    status?: SortOrder;
  };

  export type UsersOfTenantsMaxOrderByAggregateInput = {
    createdAt?: SortOrder;
    userId?: SortOrder;
    tenantId?: SortOrder;
    role?: SortOrder;
    status?: SortOrder;
  };

  export type UsersOfTenantsMinOrderByAggregateInput = {
    createdAt?: SortOrder;
    userId?: SortOrder;
    tenantId?: SortOrder;
    role?: SortOrder;
    status?: SortOrder;
  };

  export type EnumRoleWithAggregatesFilter = {
    equals?: Role;
    in?: Enumerable<Role>;
    notIn?: Enumerable<Role>;
    not?: NestedEnumRoleWithAggregatesFilter | Role;
    _count?: NestedIntFilter;
    _min?: NestedEnumRoleFilter;
    _max?: NestedEnumRoleFilter;
  };

  export type EnumMembershipStatusWithAggregatesFilter = {
    equals?: MembershipStatus;
    in?: Enumerable<MembershipStatus>;
    notIn?: Enumerable<MembershipStatus>;
    not?: NestedEnumMembershipStatusWithAggregatesFilter | MembershipStatus;
    _count?: NestedIntFilter;
    _min?: NestedEnumMembershipStatusFilter;
    _max?: NestedEnumMembershipStatusFilter;
  };

  export type StringNullableFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringNullableFilter | string | null;
  };

  export type EventOrganizerCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    tenantId?: SortOrder;
    name?: SortOrder;
    text?: SortOrder;
    link?: SortOrder;
  };

  export type EventOrganizerMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    tenantId?: SortOrder;
    name?: SortOrder;
    text?: SortOrder;
    link?: SortOrder;
  };

  export type EventOrganizerMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    tenantId?: SortOrder;
    name?: SortOrder;
    text?: SortOrder;
    link?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter | string | null;
    _count?: NestedIntNullableFilter;
    _min?: NestedStringNullableFilter;
    _max?: NestedStringNullableFilter;
  };

  export type DecimalFilter = {
    equals?: Decimal | number | string;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?: NestedDecimalFilter | Decimal | number | string;
  };
  export type JsonFilter =
    | PatchUndefined<
        Either<
          Required<JsonFilterBase>,
          Exclude<keyof Required<JsonFilterBase>, 'path'>
        >,
        Required<JsonFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase>, 'path'>>;

  export type JsonFilterBase = {
    equals?: JsonNullValueFilter | InputJsonValue;
    not?: JsonNullValueFilter | InputJsonValue;
  };

  export type EventTemplateCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    comment?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    duration?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    finances?: SortOrder;
    tenantId?: SortOrder;
  };

  export type EventTemplateAvgOrderByAggregateInput = {
    duration?: SortOrder;
  };

  export type EventTemplateMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    comment?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    duration?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    tenantId?: SortOrder;
  };

  export type EventTemplateMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    description?: SortOrder;
    comment?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    duration?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    tenantId?: SortOrder;
  };

  export type EventTemplateSumOrderByAggregateInput = {
    duration?: SortOrder;
  };

  export type DecimalWithAggregatesFilter = {
    equals?: Decimal | number | string;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?: NestedDecimalWithAggregatesFilter | Decimal | number | string;
    _count?: NestedIntFilter;
    _avg?: NestedDecimalFilter;
    _sum?: NestedDecimalFilter;
    _min?: NestedDecimalFilter;
    _max?: NestedDecimalFilter;
  };
  export type JsonWithAggregatesFilter =
    | PatchUndefined<
        Either<
          Required<JsonWithAggregatesFilterBase>,
          Exclude<keyof Required<JsonWithAggregatesFilterBase>, 'path'>
        >,
        Required<JsonWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase>, 'path'>>;

  export type JsonWithAggregatesFilterBase = {
    equals?: JsonNullValueFilter | InputJsonValue;
    not?: JsonNullValueFilter | InputJsonValue;
    _count?: NestedIntFilter;
    _min?: NestedJsonFilter;
    _max?: NestedJsonFilter;
  };

  export type IntFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntFilter | number;
  };

  export type DecimalNullableFilter = {
    equals?: Decimal | number | string | null;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null;
    notIn?:
      | Enumerable<Decimal>
      | Enumerable<number>
      | Enumerable<string>
      | null;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?: NestedDecimalNullableFilter | Decimal | number | string | null;
  };

  export type EnumRegistrationModeFilter = {
    equals?: RegistrationMode;
    in?: Enumerable<RegistrationMode>;
    notIn?: Enumerable<RegistrationMode>;
    not?: NestedEnumRegistrationModeFilter | RegistrationMode;
  };

  export type EnumPublicationStateFilter = {
    equals?: PublicationState;
    in?: Enumerable<PublicationState>;
    notIn?: Enumerable<PublicationState>;
    not?: NestedEnumPublicationStateFilter | PublicationState;
  };

  export type EnumMembershipStatusNullableListFilter = {
    equals?: Enumerable<MembershipStatus> | null;
    has?: MembershipStatus | null;
    hasEvery?: Enumerable<MembershipStatus>;
    hasSome?: Enumerable<MembershipStatus>;
    isEmpty?: boolean;
  };

  export type EventSubmissionItemListRelationFilter = {
    every?: EventSubmissionItemWhereInput;
    some?: EventSubmissionItemWhereInput;
    none?: EventSubmissionItemWhereInput;
  };

  export type CostItemListRelationFilter = {
    every?: CostItemWhereInput;
    some?: CostItemWhereInput;
    none?: CostItemWhereInput;
  };

  export type PhotoShareRelationFilter = {
    is?: PhotoShareWhereInput | null;
    isNot?: PhotoShareWhereInput | null;
  };

  export type EventOrganizerRelationFilter = {
    is?: EventOrganizerWhereInput;
    isNot?: EventOrganizerWhereInput;
  };

  export type EventTemplateRelationFilter = {
    is?: EventTemplateWhereInput;
    isNot?: EventTemplateWhereInput;
  };

  export type EventSubmissionItemOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CostItemOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TumiEventCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    start?: SortOrder;
    end?: SortOrder;
    description?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
    registrationLink?: SortOrder;
    registrationMode?: SortOrder;
    publicationState?: SortOrder;
    participantSignup?: SortOrder;
    organizerSignup?: SortOrder;
    eventOrganizerId?: SortOrder;
    creatorId?: SortOrder;
    eventTemplateId?: SortOrder;
  };

  export type TumiEventAvgOrderByAggregateInput = {
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
  };

  export type TumiEventMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    start?: SortOrder;
    end?: SortOrder;
    description?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
    registrationLink?: SortOrder;
    registrationMode?: SortOrder;
    publicationState?: SortOrder;
    eventOrganizerId?: SortOrder;
    creatorId?: SortOrder;
    eventTemplateId?: SortOrder;
  };

  export type TumiEventMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    title?: SortOrder;
    icon?: SortOrder;
    start?: SortOrder;
    end?: SortOrder;
    description?: SortOrder;
    location?: SortOrder;
    locationId?: SortOrder;
    participantText?: SortOrder;
    participantMail?: SortOrder;
    organizerText?: SortOrder;
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
    registrationLink?: SortOrder;
    registrationMode?: SortOrder;
    publicationState?: SortOrder;
    eventOrganizerId?: SortOrder;
    creatorId?: SortOrder;
    eventTemplateId?: SortOrder;
  };

  export type TumiEventSumOrderByAggregateInput = {
    participantLimit?: SortOrder;
    organizerLimit?: SortOrder;
    price?: SortOrder;
  };

  export type IntWithAggregatesFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntWithAggregatesFilter | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedIntFilter;
    _min?: NestedIntFilter;
    _max?: NestedIntFilter;
  };

  export type DecimalNullableWithAggregatesFilter = {
    equals?: Decimal | number | string | null;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null;
    notIn?:
      | Enumerable<Decimal>
      | Enumerable<number>
      | Enumerable<string>
      | null;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?:
      | NestedDecimalNullableWithAggregatesFilter
      | Decimal
      | number
      | string
      | null;
    _count?: NestedIntNullableFilter;
    _avg?: NestedDecimalNullableFilter;
    _sum?: NestedDecimalNullableFilter;
    _min?: NestedDecimalNullableFilter;
    _max?: NestedDecimalNullableFilter;
  };

  export type EnumRegistrationModeWithAggregatesFilter = {
    equals?: RegistrationMode;
    in?: Enumerable<RegistrationMode>;
    notIn?: Enumerable<RegistrationMode>;
    not?: NestedEnumRegistrationModeWithAggregatesFilter | RegistrationMode;
    _count?: NestedIntFilter;
    _min?: NestedEnumRegistrationModeFilter;
    _max?: NestedEnumRegistrationModeFilter;
  };

  export type EnumPublicationStateWithAggregatesFilter = {
    equals?: PublicationState;
    in?: Enumerable<PublicationState>;
    notIn?: Enumerable<PublicationState>;
    not?: NestedEnumPublicationStateWithAggregatesFilter | PublicationState;
    _count?: NestedIntFilter;
    _min?: NestedEnumPublicationStateFilter;
    _max?: NestedEnumPublicationStateFilter;
  };

  export type TumiEventRelationFilter = {
    is?: TumiEventWhereInput;
    isNot?: TumiEventWhereInput;
  };

  export type CostItemCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    name?: SortOrder;
    ammount?: SortOrder;
  };

  export type CostItemAvgOrderByAggregateInput = {
    ammount?: SortOrder;
  };

  export type CostItemMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    name?: SortOrder;
    ammount?: SortOrder;
  };

  export type CostItemMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    name?: SortOrder;
    ammount?: SortOrder;
  };

  export type CostItemSumOrderByAggregateInput = {
    ammount?: SortOrder;
  };

  export type CostItemRelationFilter = {
    is?: CostItemWhereInput;
    isNot?: CostItemWhereInput;
  };

  export type ReceiptCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    costItemId?: SortOrder;
    covered?: SortOrder;
    amount?: SortOrder;
    date?: SortOrder;
    amountCovered?: SortOrder;
  };

  export type ReceiptAvgOrderByAggregateInput = {
    amount?: SortOrder;
    amountCovered?: SortOrder;
  };

  export type ReceiptMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    costItemId?: SortOrder;
    covered?: SortOrder;
    amount?: SortOrder;
    date?: SortOrder;
    amountCovered?: SortOrder;
  };

  export type ReceiptMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    costItemId?: SortOrder;
    covered?: SortOrder;
    amount?: SortOrder;
    date?: SortOrder;
    amountCovered?: SortOrder;
  };

  export type ReceiptSumOrderByAggregateInput = {
    amount?: SortOrder;
    amountCovered?: SortOrder;
  };

  export type PhotoShareCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
  };

  export type PhotoShareMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
  };

  export type PhotoShareMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
  };

  export type EnumRegistrationTypeFilter = {
    equals?: RegistrationType;
    in?: Enumerable<RegistrationType>;
    notIn?: Enumerable<RegistrationType>;
    not?: NestedEnumRegistrationTypeFilter | RegistrationType;
  };

  export type EventRegistrationUserIdEventIdCompoundUniqueInput = {
    userId: string;
    eventId: string;
  };

  export type EventRegistrationCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    type?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
  };

  export type EventRegistrationMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    type?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
  };

  export type EventRegistrationMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    type?: SortOrder;
    userId?: SortOrder;
    eventId?: SortOrder;
  };

  export type EnumRegistrationTypeWithAggregatesFilter = {
    equals?: RegistrationType;
    in?: Enumerable<RegistrationType>;
    notIn?: Enumerable<RegistrationType>;
    not?: NestedEnumRegistrationTypeWithAggregatesFilter | RegistrationType;
    _count?: NestedIntFilter;
    _min?: NestedEnumRegistrationTypeFilter;
    _max?: NestedEnumRegistrationTypeFilter;
  };

  export type EnumSubmissionTimeFilter = {
    equals?: SubmissionTime;
    in?: Enumerable<SubmissionTime>;
    notIn?: Enumerable<SubmissionTime>;
    not?: NestedEnumSubmissionTimeFilter | SubmissionTime;
  };

  export type EventSubmissionItemCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    required?: SortOrder;
    submissionTime?: SortOrder;
  };

  export type EventSubmissionItemMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    required?: SortOrder;
    submissionTime?: SortOrder;
  };

  export type EventSubmissionItemMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    eventId?: SortOrder;
    required?: SortOrder;
    submissionTime?: SortOrder;
  };

  export type EnumSubmissionTimeWithAggregatesFilter = {
    equals?: SubmissionTime;
    in?: Enumerable<SubmissionTime>;
    notIn?: Enumerable<SubmissionTime>;
    not?: NestedEnumSubmissionTimeWithAggregatesFilter | SubmissionTime;
    _count?: NestedIntFilter;
    _min?: NestedEnumSubmissionTimeFilter;
    _max?: NestedEnumSubmissionTimeFilter;
  };

  export type EventSubmissionItemRelationFilter = {
    is?: EventSubmissionItemWhereInput;
    isNot?: EventSubmissionItemWhereInput;
  };

  export type EventSubmissionCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    submissionItemId?: SortOrder;
  };

  export type EventSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    submissionItemId?: SortOrder;
  };

  export type EventSubmissionMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    submissionItemId?: SortOrder;
  };

  export type UsersOfTenantsCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutTenantInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutTenantInput>;
    createMany?: UsersOfTenantsCreateManyTenantInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
  };

  export type EventTemplateCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventTemplateCreateWithoutTenantInput>,
      Enumerable<EventTemplateUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventTemplateCreateOrConnectWithoutTenantInput>;
    createMany?: EventTemplateCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventTemplateWhereUniqueInput>;
  };

  export type EventOrganizerCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventOrganizerCreateWithoutTenantInput>,
      Enumerable<EventOrganizerUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventOrganizerCreateOrConnectWithoutTenantInput>;
    createMany?: EventOrganizerCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventOrganizerWhereUniqueInput>;
  };

  export type UsersOfTenantsUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutTenantInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutTenantInput>;
    createMany?: UsersOfTenantsCreateManyTenantInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
  };

  export type EventTemplateUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventTemplateCreateWithoutTenantInput>,
      Enumerable<EventTemplateUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventTemplateCreateOrConnectWithoutTenantInput>;
    createMany?: EventTemplateCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventTemplateWhereUniqueInput>;
  };

  export type EventOrganizerUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventOrganizerCreateWithoutTenantInput>,
      Enumerable<EventOrganizerUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventOrganizerCreateOrConnectWithoutTenantInput>;
    createMany?: EventOrganizerCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventOrganizerWhereUniqueInput>;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type UsersOfTenantsUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutTenantInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<UsersOfTenantsUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: UsersOfTenantsCreateManyTenantInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    set?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    disconnect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    delete?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    update?: Enumerable<UsersOfTenantsUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<UsersOfTenantsUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<UsersOfTenantsScalarWhereInput>;
  };

  export type EventTemplateUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventTemplateCreateWithoutTenantInput>,
      Enumerable<EventTemplateUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventTemplateCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<EventTemplateUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: EventTemplateCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventTemplateWhereUniqueInput>;
    set?: Enumerable<EventTemplateWhereUniqueInput>;
    disconnect?: Enumerable<EventTemplateWhereUniqueInput>;
    delete?: Enumerable<EventTemplateWhereUniqueInput>;
    update?: Enumerable<EventTemplateUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<EventTemplateUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<EventTemplateScalarWhereInput>;
  };

  export type EventOrganizerUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventOrganizerCreateWithoutTenantInput>,
      Enumerable<EventOrganizerUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventOrganizerCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<EventOrganizerUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: EventOrganizerCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventOrganizerWhereUniqueInput>;
    set?: Enumerable<EventOrganizerWhereUniqueInput>;
    disconnect?: Enumerable<EventOrganizerWhereUniqueInput>;
    delete?: Enumerable<EventOrganizerWhereUniqueInput>;
    update?: Enumerable<EventOrganizerUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<EventOrganizerUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<EventOrganizerScalarWhereInput>;
  };

  export type UsersOfTenantsUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutTenantInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<UsersOfTenantsUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: UsersOfTenantsCreateManyTenantInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    set?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    disconnect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    delete?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    update?: Enumerable<UsersOfTenantsUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<UsersOfTenantsUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<UsersOfTenantsScalarWhereInput>;
  };

  export type EventTemplateUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventTemplateCreateWithoutTenantInput>,
      Enumerable<EventTemplateUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventTemplateCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<EventTemplateUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: EventTemplateCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventTemplateWhereUniqueInput>;
    set?: Enumerable<EventTemplateWhereUniqueInput>;
    disconnect?: Enumerable<EventTemplateWhereUniqueInput>;
    delete?: Enumerable<EventTemplateWhereUniqueInput>;
    update?: Enumerable<EventTemplateUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<EventTemplateUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<EventTemplateScalarWhereInput>;
  };

  export type EventOrganizerUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<EventOrganizerCreateWithoutTenantInput>,
      Enumerable<EventOrganizerUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<EventOrganizerCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<EventOrganizerUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: EventOrganizerCreateManyTenantInputEnvelope;
    connect?: Enumerable<EventOrganizerWhereUniqueInput>;
    set?: Enumerable<EventOrganizerWhereUniqueInput>;
    disconnect?: Enumerable<EventOrganizerWhereUniqueInput>;
    delete?: Enumerable<EventOrganizerWhereUniqueInput>;
    update?: Enumerable<EventOrganizerUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<EventOrganizerUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<EventOrganizerScalarWhereInput>;
  };

  export type UsersOfTenantsCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutUserInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutUserInput>;
    createMany?: UsersOfTenantsCreateManyUserInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
  };

  export type EventSubmissionCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutUserInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutUserInput>;
    createMany?: EventSubmissionCreateManyUserInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
  };

  export type EventRegistrationCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutUserInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutUserInput>;
    createMany?: EventRegistrationCreateManyUserInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
  };

  export type ReceiptCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutUserInput>,
      Enumerable<ReceiptUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutUserInput>;
    createMany?: ReceiptCreateManyUserInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
  };

  export type TumiEventCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutCreatedByInput>,
      Enumerable<TumiEventUncheckedCreateWithoutCreatedByInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutCreatedByInput>;
    createMany?: TumiEventCreateManyCreatedByInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
  };

  export type UsersOfTenantsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutUserInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutUserInput>;
    createMany?: UsersOfTenantsCreateManyUserInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
  };

  export type EventSubmissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutUserInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutUserInput>;
    createMany?: EventSubmissionCreateManyUserInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
  };

  export type EventRegistrationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutUserInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutUserInput>;
    createMany?: EventRegistrationCreateManyUserInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
  };

  export type ReceiptUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutUserInput>,
      Enumerable<ReceiptUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutUserInput>;
    createMany?: ReceiptCreateManyUserInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
  };

  export type TumiEventUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutCreatedByInput>,
      Enumerable<TumiEventUncheckedCreateWithoutCreatedByInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutCreatedByInput>;
    createMany?: TumiEventCreateManyCreatedByInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type UsersOfTenantsUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutUserInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<UsersOfTenantsUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: UsersOfTenantsCreateManyUserInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    set?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    disconnect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    delete?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    update?: Enumerable<UsersOfTenantsUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<UsersOfTenantsUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<UsersOfTenantsScalarWhereInput>;
  };

  export type EventSubmissionUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutUserInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<EventSubmissionUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: EventSubmissionCreateManyUserInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
    set?: Enumerable<EventSubmissionWhereUniqueInput>;
    disconnect?: Enumerable<EventSubmissionWhereUniqueInput>;
    delete?: Enumerable<EventSubmissionWhereUniqueInput>;
    update?: Enumerable<EventSubmissionUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<EventSubmissionUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<EventSubmissionScalarWhereInput>;
  };

  export type EventRegistrationUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutUserInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<EventRegistrationUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: EventRegistrationCreateManyUserInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
    set?: Enumerable<EventRegistrationWhereUniqueInput>;
    disconnect?: Enumerable<EventRegistrationWhereUniqueInput>;
    delete?: Enumerable<EventRegistrationWhereUniqueInput>;
    update?: Enumerable<EventRegistrationUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<EventRegistrationUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<EventRegistrationScalarWhereInput>;
  };

  export type ReceiptUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutUserInput>,
      Enumerable<ReceiptUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<ReceiptUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: ReceiptCreateManyUserInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
    set?: Enumerable<ReceiptWhereUniqueInput>;
    disconnect?: Enumerable<ReceiptWhereUniqueInput>;
    delete?: Enumerable<ReceiptWhereUniqueInput>;
    update?: Enumerable<ReceiptUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<ReceiptUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<ReceiptScalarWhereInput>;
  };

  export type TumiEventUpdateManyWithoutCreatedByInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutCreatedByInput>,
      Enumerable<TumiEventUncheckedCreateWithoutCreatedByInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutCreatedByInput>;
    upsert?: Enumerable<TumiEventUpsertWithWhereUniqueWithoutCreatedByInput>;
    createMany?: TumiEventCreateManyCreatedByInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
    set?: Enumerable<TumiEventWhereUniqueInput>;
    disconnect?: Enumerable<TumiEventWhereUniqueInput>;
    delete?: Enumerable<TumiEventWhereUniqueInput>;
    update?: Enumerable<TumiEventUpdateWithWhereUniqueWithoutCreatedByInput>;
    updateMany?: Enumerable<TumiEventUpdateManyWithWhereWithoutCreatedByInput>;
    deleteMany?: Enumerable<TumiEventScalarWhereInput>;
  };

  export type UsersOfTenantsUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<UsersOfTenantsCreateWithoutUserInput>,
      Enumerable<UsersOfTenantsUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<UsersOfTenantsCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<UsersOfTenantsUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: UsersOfTenantsCreateManyUserInputEnvelope;
    connect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    set?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    disconnect?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    delete?: Enumerable<UsersOfTenantsWhereUniqueInput>;
    update?: Enumerable<UsersOfTenantsUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<UsersOfTenantsUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<UsersOfTenantsScalarWhereInput>;
  };

  export type EventSubmissionUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutUserInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<EventSubmissionUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: EventSubmissionCreateManyUserInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
    set?: Enumerable<EventSubmissionWhereUniqueInput>;
    disconnect?: Enumerable<EventSubmissionWhereUniqueInput>;
    delete?: Enumerable<EventSubmissionWhereUniqueInput>;
    update?: Enumerable<EventSubmissionUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<EventSubmissionUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<EventSubmissionScalarWhereInput>;
  };

  export type EventRegistrationUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutUserInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<EventRegistrationUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: EventRegistrationCreateManyUserInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
    set?: Enumerable<EventRegistrationWhereUniqueInput>;
    disconnect?: Enumerable<EventRegistrationWhereUniqueInput>;
    delete?: Enumerable<EventRegistrationWhereUniqueInput>;
    update?: Enumerable<EventRegistrationUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<EventRegistrationUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<EventRegistrationScalarWhereInput>;
  };

  export type ReceiptUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutUserInput>,
      Enumerable<ReceiptUncheckedCreateWithoutUserInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutUserInput>;
    upsert?: Enumerable<ReceiptUpsertWithWhereUniqueWithoutUserInput>;
    createMany?: ReceiptCreateManyUserInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
    set?: Enumerable<ReceiptWhereUniqueInput>;
    disconnect?: Enumerable<ReceiptWhereUniqueInput>;
    delete?: Enumerable<ReceiptWhereUniqueInput>;
    update?: Enumerable<ReceiptUpdateWithWhereUniqueWithoutUserInput>;
    updateMany?: Enumerable<ReceiptUpdateManyWithWhereWithoutUserInput>;
    deleteMany?: Enumerable<ReceiptScalarWhereInput>;
  };

  export type TumiEventUncheckedUpdateManyWithoutCreatedByInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutCreatedByInput>,
      Enumerable<TumiEventUncheckedCreateWithoutCreatedByInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutCreatedByInput>;
    upsert?: Enumerable<TumiEventUpsertWithWhereUniqueWithoutCreatedByInput>;
    createMany?: TumiEventCreateManyCreatedByInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
    set?: Enumerable<TumiEventWhereUniqueInput>;
    disconnect?: Enumerable<TumiEventWhereUniqueInput>;
    delete?: Enumerable<TumiEventWhereUniqueInput>;
    update?: Enumerable<TumiEventUpdateWithWhereUniqueWithoutCreatedByInput>;
    updateMany?: Enumerable<TumiEventUpdateManyWithWhereWithoutCreatedByInput>;
    deleteMany?: Enumerable<TumiEventScalarWhereInput>;
  };

  export type UserCreateNestedOneWithoutTenantsInput = {
    create?: XOR<
      UserCreateWithoutTenantsInput,
      UserUncheckedCreateWithoutTenantsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutTenantsInput;
    connect?: UserWhereUniqueInput;
  };

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<
      TenantCreateWithoutUsersInput,
      TenantUncheckedCreateWithoutUsersInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput;
    connect?: TenantWhereUniqueInput;
  };

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: Role;
  };

  export type EnumMembershipStatusFieldUpdateOperationsInput = {
    set?: MembershipStatus;
  };

  export type UserUpdateOneRequiredWithoutTenantsInput = {
    create?: XOR<
      UserCreateWithoutTenantsInput,
      UserUncheckedCreateWithoutTenantsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutTenantsInput;
    upsert?: UserUpsertWithoutTenantsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      UserUpdateWithoutTenantsInput,
      UserUncheckedUpdateWithoutTenantsInput
    >;
  };

  export type TenantUpdateOneRequiredWithoutUsersInput = {
    create?: XOR<
      TenantCreateWithoutUsersInput,
      TenantUncheckedCreateWithoutUsersInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput;
    upsert?: TenantUpsertWithoutUsersInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutUsersInput,
      TenantUncheckedUpdateWithoutUsersInput
    >;
  };

  export type TenantCreateNestedOneWithoutOrganizersInput = {
    create?: XOR<
      TenantCreateWithoutOrganizersInput,
      TenantUncheckedCreateWithoutOrganizersInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutOrganizersInput;
    connect?: TenantWhereUniqueInput;
  };

  export type TumiEventCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutOrganizerInput>,
      Enumerable<TumiEventUncheckedCreateWithoutOrganizerInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutOrganizerInput>;
    createMany?: TumiEventCreateManyOrganizerInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
  };

  export type TumiEventUncheckedCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutOrganizerInput>,
      Enumerable<TumiEventUncheckedCreateWithoutOrganizerInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutOrganizerInput>;
    createMany?: TumiEventCreateManyOrganizerInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type TenantUpdateOneRequiredWithoutOrganizersInput = {
    create?: XOR<
      TenantCreateWithoutOrganizersInput,
      TenantUncheckedCreateWithoutOrganizersInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutOrganizersInput;
    upsert?: TenantUpsertWithoutOrganizersInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutOrganizersInput,
      TenantUncheckedUpdateWithoutOrganizersInput
    >;
  };

  export type TumiEventUpdateManyWithoutOrganizerInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutOrganizerInput>,
      Enumerable<TumiEventUncheckedCreateWithoutOrganizerInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutOrganizerInput>;
    upsert?: Enumerable<TumiEventUpsertWithWhereUniqueWithoutOrganizerInput>;
    createMany?: TumiEventCreateManyOrganizerInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
    set?: Enumerable<TumiEventWhereUniqueInput>;
    disconnect?: Enumerable<TumiEventWhereUniqueInput>;
    delete?: Enumerable<TumiEventWhereUniqueInput>;
    update?: Enumerable<TumiEventUpdateWithWhereUniqueWithoutOrganizerInput>;
    updateMany?: Enumerable<TumiEventUpdateManyWithWhereWithoutOrganizerInput>;
    deleteMany?: Enumerable<TumiEventScalarWhereInput>;
  };

  export type TumiEventUncheckedUpdateManyWithoutOrganizerInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutOrganizerInput>,
      Enumerable<TumiEventUncheckedCreateWithoutOrganizerInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutOrganizerInput>;
    upsert?: Enumerable<TumiEventUpsertWithWhereUniqueWithoutOrganizerInput>;
    createMany?: TumiEventCreateManyOrganizerInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
    set?: Enumerable<TumiEventWhereUniqueInput>;
    disconnect?: Enumerable<TumiEventWhereUniqueInput>;
    delete?: Enumerable<TumiEventWhereUniqueInput>;
    update?: Enumerable<TumiEventUpdateWithWhereUniqueWithoutOrganizerInput>;
    updateMany?: Enumerable<TumiEventUpdateManyWithWhereWithoutOrganizerInput>;
    deleteMany?: Enumerable<TumiEventScalarWhereInput>;
  };

  export type TumiEventCreateNestedManyWithoutEventTemplateInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutEventTemplateInput>,
      Enumerable<TumiEventUncheckedCreateWithoutEventTemplateInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutEventTemplateInput>;
    createMany?: TumiEventCreateManyEventTemplateInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
  };

  export type TenantCreateNestedOneWithoutEventTemplatesInput = {
    create?: XOR<
      TenantCreateWithoutEventTemplatesInput,
      TenantUncheckedCreateWithoutEventTemplatesInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutEventTemplatesInput;
    connect?: TenantWhereUniqueInput;
  };

  export type TumiEventUncheckedCreateNestedManyWithoutEventTemplateInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutEventTemplateInput>,
      Enumerable<TumiEventUncheckedCreateWithoutEventTemplateInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutEventTemplateInput>;
    createMany?: TumiEventCreateManyEventTemplateInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
  };

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | number | string;
    increment?: Decimal | number | string;
    decrement?: Decimal | number | string;
    multiply?: Decimal | number | string;
    divide?: Decimal | number | string;
  };

  export type TumiEventUpdateManyWithoutEventTemplateInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutEventTemplateInput>,
      Enumerable<TumiEventUncheckedCreateWithoutEventTemplateInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutEventTemplateInput>;
    upsert?: Enumerable<TumiEventUpsertWithWhereUniqueWithoutEventTemplateInput>;
    createMany?: TumiEventCreateManyEventTemplateInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
    set?: Enumerable<TumiEventWhereUniqueInput>;
    disconnect?: Enumerable<TumiEventWhereUniqueInput>;
    delete?: Enumerable<TumiEventWhereUniqueInput>;
    update?: Enumerable<TumiEventUpdateWithWhereUniqueWithoutEventTemplateInput>;
    updateMany?: Enumerable<TumiEventUpdateManyWithWhereWithoutEventTemplateInput>;
    deleteMany?: Enumerable<TumiEventScalarWhereInput>;
  };

  export type TenantUpdateOneRequiredWithoutEventTemplatesInput = {
    create?: XOR<
      TenantCreateWithoutEventTemplatesInput,
      TenantUncheckedCreateWithoutEventTemplatesInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutEventTemplatesInput;
    upsert?: TenantUpsertWithoutEventTemplatesInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutEventTemplatesInput,
      TenantUncheckedUpdateWithoutEventTemplatesInput
    >;
  };

  export type TumiEventUncheckedUpdateManyWithoutEventTemplateInput = {
    create?: XOR<
      Enumerable<TumiEventCreateWithoutEventTemplateInput>,
      Enumerable<TumiEventUncheckedCreateWithoutEventTemplateInput>
    >;
    connectOrCreate?: Enumerable<TumiEventCreateOrConnectWithoutEventTemplateInput>;
    upsert?: Enumerable<TumiEventUpsertWithWhereUniqueWithoutEventTemplateInput>;
    createMany?: TumiEventCreateManyEventTemplateInputEnvelope;
    connect?: Enumerable<TumiEventWhereUniqueInput>;
    set?: Enumerable<TumiEventWhereUniqueInput>;
    disconnect?: Enumerable<TumiEventWhereUniqueInput>;
    delete?: Enumerable<TumiEventWhereUniqueInput>;
    update?: Enumerable<TumiEventUpdateWithWhereUniqueWithoutEventTemplateInput>;
    updateMany?: Enumerable<TumiEventUpdateManyWithWhereWithoutEventTemplateInput>;
    deleteMany?: Enumerable<TumiEventScalarWhereInput>;
  };

  export type TumiEventCreateparticipantSignupInput = {
    set: Enumerable<MembershipStatus>;
  };

  export type TumiEventCreateorganizerSignupInput = {
    set: Enumerable<MembershipStatus>;
  };

  export type EventSubmissionItemCreateNestedManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventSubmissionItemCreateWithoutEventInput>,
      Enumerable<EventSubmissionItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionItemCreateOrConnectWithoutEventInput>;
    createMany?: EventSubmissionItemCreateManyEventInputEnvelope;
    connect?: Enumerable<EventSubmissionItemWhereUniqueInput>;
  };

  export type EventRegistrationCreateNestedManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutEventInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutEventInput>;
    createMany?: EventRegistrationCreateManyEventInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
  };

  export type CostItemCreateNestedManyWithoutEventInput = {
    create?: XOR<
      Enumerable<CostItemCreateWithoutEventInput>,
      Enumerable<CostItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<CostItemCreateOrConnectWithoutEventInput>;
    createMany?: CostItemCreateManyEventInputEnvelope;
    connect?: Enumerable<CostItemWhereUniqueInput>;
  };

  export type PhotoShareCreateNestedOneWithoutEventInput = {
    create?: XOR<
      PhotoShareCreateWithoutEventInput,
      PhotoShareUncheckedCreateWithoutEventInput
    >;
    connectOrCreate?: PhotoShareCreateOrConnectWithoutEventInput;
    connect?: PhotoShareWhereUniqueInput;
  };

  export type EventOrganizerCreateNestedOneWithoutEventsInput = {
    create?: XOR<
      EventOrganizerCreateWithoutEventsInput,
      EventOrganizerUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: EventOrganizerCreateOrConnectWithoutEventsInput;
    connect?: EventOrganizerWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutCreatedEventsInput = {
    create?: XOR<
      UserCreateWithoutCreatedEventsInput,
      UserUncheckedCreateWithoutCreatedEventsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutCreatedEventsInput;
    connect?: UserWhereUniqueInput;
  };

  export type EventTemplateCreateNestedOneWithoutEventInstancesInput = {
    create?: XOR<
      EventTemplateCreateWithoutEventInstancesInput,
      EventTemplateUncheckedCreateWithoutEventInstancesInput
    >;
    connectOrCreate?: EventTemplateCreateOrConnectWithoutEventInstancesInput;
    connect?: EventTemplateWhereUniqueInput;
  };

  export type EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventSubmissionItemCreateWithoutEventInput>,
      Enumerable<EventSubmissionItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionItemCreateOrConnectWithoutEventInput>;
    createMany?: EventSubmissionItemCreateManyEventInputEnvelope;
    connect?: Enumerable<EventSubmissionItemWhereUniqueInput>;
  };

  export type EventRegistrationUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutEventInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutEventInput>;
    createMany?: EventRegistrationCreateManyEventInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
  };

  export type CostItemUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<
      Enumerable<CostItemCreateWithoutEventInput>,
      Enumerable<CostItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<CostItemCreateOrConnectWithoutEventInput>;
    createMany?: CostItemCreateManyEventInputEnvelope;
    connect?: Enumerable<CostItemWhereUniqueInput>;
  };

  export type PhotoShareUncheckedCreateNestedOneWithoutEventInput = {
    create?: XOR<
      PhotoShareCreateWithoutEventInput,
      PhotoShareUncheckedCreateWithoutEventInput
    >;
    connectOrCreate?: PhotoShareCreateOrConnectWithoutEventInput;
    connect?: PhotoShareWhereUniqueInput;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | number | string | null;
    increment?: Decimal | number | string;
    decrement?: Decimal | number | string;
    multiply?: Decimal | number | string;
    divide?: Decimal | number | string;
  };

  export type EnumRegistrationModeFieldUpdateOperationsInput = {
    set?: RegistrationMode;
  };

  export type EnumPublicationStateFieldUpdateOperationsInput = {
    set?: PublicationState;
  };

  export type TumiEventUpdateparticipantSignupInput = {
    set?: Enumerable<MembershipStatus>;
    push?: Enumerable<MembershipStatus>;
  };

  export type TumiEventUpdateorganizerSignupInput = {
    set?: Enumerable<MembershipStatus>;
    push?: Enumerable<MembershipStatus>;
  };

  export type EventSubmissionItemUpdateManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventSubmissionItemCreateWithoutEventInput>,
      Enumerable<EventSubmissionItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionItemCreateOrConnectWithoutEventInput>;
    upsert?: Enumerable<EventSubmissionItemUpsertWithWhereUniqueWithoutEventInput>;
    createMany?: EventSubmissionItemCreateManyEventInputEnvelope;
    connect?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    set?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    disconnect?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    delete?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    update?: Enumerable<EventSubmissionItemUpdateWithWhereUniqueWithoutEventInput>;
    updateMany?: Enumerable<EventSubmissionItemUpdateManyWithWhereWithoutEventInput>;
    deleteMany?: Enumerable<EventSubmissionItemScalarWhereInput>;
  };

  export type EventRegistrationUpdateManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutEventInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutEventInput>;
    upsert?: Enumerable<EventRegistrationUpsertWithWhereUniqueWithoutEventInput>;
    createMany?: EventRegistrationCreateManyEventInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
    set?: Enumerable<EventRegistrationWhereUniqueInput>;
    disconnect?: Enumerable<EventRegistrationWhereUniqueInput>;
    delete?: Enumerable<EventRegistrationWhereUniqueInput>;
    update?: Enumerable<EventRegistrationUpdateWithWhereUniqueWithoutEventInput>;
    updateMany?: Enumerable<EventRegistrationUpdateManyWithWhereWithoutEventInput>;
    deleteMany?: Enumerable<EventRegistrationScalarWhereInput>;
  };

  export type CostItemUpdateManyWithoutEventInput = {
    create?: XOR<
      Enumerable<CostItemCreateWithoutEventInput>,
      Enumerable<CostItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<CostItemCreateOrConnectWithoutEventInput>;
    upsert?: Enumerable<CostItemUpsertWithWhereUniqueWithoutEventInput>;
    createMany?: CostItemCreateManyEventInputEnvelope;
    connect?: Enumerable<CostItemWhereUniqueInput>;
    set?: Enumerable<CostItemWhereUniqueInput>;
    disconnect?: Enumerable<CostItemWhereUniqueInput>;
    delete?: Enumerable<CostItemWhereUniqueInput>;
    update?: Enumerable<CostItemUpdateWithWhereUniqueWithoutEventInput>;
    updateMany?: Enumerable<CostItemUpdateManyWithWhereWithoutEventInput>;
    deleteMany?: Enumerable<CostItemScalarWhereInput>;
  };

  export type PhotoShareUpdateOneWithoutEventInput = {
    create?: XOR<
      PhotoShareCreateWithoutEventInput,
      PhotoShareUncheckedCreateWithoutEventInput
    >;
    connectOrCreate?: PhotoShareCreateOrConnectWithoutEventInput;
    upsert?: PhotoShareUpsertWithoutEventInput;
    connect?: PhotoShareWhereUniqueInput;
    disconnect?: boolean;
    delete?: boolean;
    update?: XOR<
      PhotoShareUpdateWithoutEventInput,
      PhotoShareUncheckedUpdateWithoutEventInput
    >;
  };

  export type EventOrganizerUpdateOneRequiredWithoutEventsInput = {
    create?: XOR<
      EventOrganizerCreateWithoutEventsInput,
      EventOrganizerUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: EventOrganizerCreateOrConnectWithoutEventsInput;
    upsert?: EventOrganizerUpsertWithoutEventsInput;
    connect?: EventOrganizerWhereUniqueInput;
    update?: XOR<
      EventOrganizerUpdateWithoutEventsInput,
      EventOrganizerUncheckedUpdateWithoutEventsInput
    >;
  };

  export type UserUpdateOneRequiredWithoutCreatedEventsInput = {
    create?: XOR<
      UserCreateWithoutCreatedEventsInput,
      UserUncheckedCreateWithoutCreatedEventsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutCreatedEventsInput;
    upsert?: UserUpsertWithoutCreatedEventsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      UserUpdateWithoutCreatedEventsInput,
      UserUncheckedUpdateWithoutCreatedEventsInput
    >;
  };

  export type EventTemplateUpdateOneRequiredWithoutEventInstancesInput = {
    create?: XOR<
      EventTemplateCreateWithoutEventInstancesInput,
      EventTemplateUncheckedCreateWithoutEventInstancesInput
    >;
    connectOrCreate?: EventTemplateCreateOrConnectWithoutEventInstancesInput;
    upsert?: EventTemplateUpsertWithoutEventInstancesInput;
    connect?: EventTemplateWhereUniqueInput;
    update?: XOR<
      EventTemplateUpdateWithoutEventInstancesInput,
      EventTemplateUncheckedUpdateWithoutEventInstancesInput
    >;
  };

  export type EventSubmissionItemUncheckedUpdateManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventSubmissionItemCreateWithoutEventInput>,
      Enumerable<EventSubmissionItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionItemCreateOrConnectWithoutEventInput>;
    upsert?: Enumerable<EventSubmissionItemUpsertWithWhereUniqueWithoutEventInput>;
    createMany?: EventSubmissionItemCreateManyEventInputEnvelope;
    connect?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    set?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    disconnect?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    delete?: Enumerable<EventSubmissionItemWhereUniqueInput>;
    update?: Enumerable<EventSubmissionItemUpdateWithWhereUniqueWithoutEventInput>;
    updateMany?: Enumerable<EventSubmissionItemUpdateManyWithWhereWithoutEventInput>;
    deleteMany?: Enumerable<EventSubmissionItemScalarWhereInput>;
  };

  export type EventRegistrationUncheckedUpdateManyWithoutEventInput = {
    create?: XOR<
      Enumerable<EventRegistrationCreateWithoutEventInput>,
      Enumerable<EventRegistrationUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<EventRegistrationCreateOrConnectWithoutEventInput>;
    upsert?: Enumerable<EventRegistrationUpsertWithWhereUniqueWithoutEventInput>;
    createMany?: EventRegistrationCreateManyEventInputEnvelope;
    connect?: Enumerable<EventRegistrationWhereUniqueInput>;
    set?: Enumerable<EventRegistrationWhereUniqueInput>;
    disconnect?: Enumerable<EventRegistrationWhereUniqueInput>;
    delete?: Enumerable<EventRegistrationWhereUniqueInput>;
    update?: Enumerable<EventRegistrationUpdateWithWhereUniqueWithoutEventInput>;
    updateMany?: Enumerable<EventRegistrationUpdateManyWithWhereWithoutEventInput>;
    deleteMany?: Enumerable<EventRegistrationScalarWhereInput>;
  };

  export type CostItemUncheckedUpdateManyWithoutEventInput = {
    create?: XOR<
      Enumerable<CostItemCreateWithoutEventInput>,
      Enumerable<CostItemUncheckedCreateWithoutEventInput>
    >;
    connectOrCreate?: Enumerable<CostItemCreateOrConnectWithoutEventInput>;
    upsert?: Enumerable<CostItemUpsertWithWhereUniqueWithoutEventInput>;
    createMany?: CostItemCreateManyEventInputEnvelope;
    connect?: Enumerable<CostItemWhereUniqueInput>;
    set?: Enumerable<CostItemWhereUniqueInput>;
    disconnect?: Enumerable<CostItemWhereUniqueInput>;
    delete?: Enumerable<CostItemWhereUniqueInput>;
    update?: Enumerable<CostItemUpdateWithWhereUniqueWithoutEventInput>;
    updateMany?: Enumerable<CostItemUpdateManyWithWhereWithoutEventInput>;
    deleteMany?: Enumerable<CostItemScalarWhereInput>;
  };

  export type PhotoShareUncheckedUpdateOneWithoutEventInput = {
    create?: XOR<
      PhotoShareCreateWithoutEventInput,
      PhotoShareUncheckedCreateWithoutEventInput
    >;
    connectOrCreate?: PhotoShareCreateOrConnectWithoutEventInput;
    upsert?: PhotoShareUpsertWithoutEventInput;
    connect?: PhotoShareWhereUniqueInput;
    disconnect?: boolean;
    delete?: boolean;
    update?: XOR<
      PhotoShareUpdateWithoutEventInput,
      PhotoShareUncheckedUpdateWithoutEventInput
    >;
  };

  export type TumiEventCreateManyparticipantSignupInput = {
    set: Enumerable<MembershipStatus>;
  };

  export type TumiEventCreateManyorganizerSignupInput = {
    set: Enumerable<MembershipStatus>;
  };

  export type TumiEventCreateNestedOneWithoutCostItemsInput = {
    create?: XOR<
      TumiEventCreateWithoutCostItemsInput,
      TumiEventUncheckedCreateWithoutCostItemsInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutCostItemsInput;
    connect?: TumiEventWhereUniqueInput;
  };

  export type ReceiptCreateNestedManyWithoutCostItemInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutCostItemInput>,
      Enumerable<ReceiptUncheckedCreateWithoutCostItemInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutCostItemInput>;
    createMany?: ReceiptCreateManyCostItemInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
  };

  export type ReceiptUncheckedCreateNestedManyWithoutCostItemInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutCostItemInput>,
      Enumerable<ReceiptUncheckedCreateWithoutCostItemInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutCostItemInput>;
    createMany?: ReceiptCreateManyCostItemInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
  };

  export type TumiEventUpdateOneRequiredWithoutCostItemsInput = {
    create?: XOR<
      TumiEventCreateWithoutCostItemsInput,
      TumiEventUncheckedCreateWithoutCostItemsInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutCostItemsInput;
    upsert?: TumiEventUpsertWithoutCostItemsInput;
    connect?: TumiEventWhereUniqueInput;
    update?: XOR<
      TumiEventUpdateWithoutCostItemsInput,
      TumiEventUncheckedUpdateWithoutCostItemsInput
    >;
  };

  export type ReceiptUpdateManyWithoutCostItemInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutCostItemInput>,
      Enumerable<ReceiptUncheckedCreateWithoutCostItemInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutCostItemInput>;
    upsert?: Enumerable<ReceiptUpsertWithWhereUniqueWithoutCostItemInput>;
    createMany?: ReceiptCreateManyCostItemInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
    set?: Enumerable<ReceiptWhereUniqueInput>;
    disconnect?: Enumerable<ReceiptWhereUniqueInput>;
    delete?: Enumerable<ReceiptWhereUniqueInput>;
    update?: Enumerable<ReceiptUpdateWithWhereUniqueWithoutCostItemInput>;
    updateMany?: Enumerable<ReceiptUpdateManyWithWhereWithoutCostItemInput>;
    deleteMany?: Enumerable<ReceiptScalarWhereInput>;
  };

  export type ReceiptUncheckedUpdateManyWithoutCostItemInput = {
    create?: XOR<
      Enumerable<ReceiptCreateWithoutCostItemInput>,
      Enumerable<ReceiptUncheckedCreateWithoutCostItemInput>
    >;
    connectOrCreate?: Enumerable<ReceiptCreateOrConnectWithoutCostItemInput>;
    upsert?: Enumerable<ReceiptUpsertWithWhereUniqueWithoutCostItemInput>;
    createMany?: ReceiptCreateManyCostItemInputEnvelope;
    connect?: Enumerable<ReceiptWhereUniqueInput>;
    set?: Enumerable<ReceiptWhereUniqueInput>;
    disconnect?: Enumerable<ReceiptWhereUniqueInput>;
    delete?: Enumerable<ReceiptWhereUniqueInput>;
    update?: Enumerable<ReceiptUpdateWithWhereUniqueWithoutCostItemInput>;
    updateMany?: Enumerable<ReceiptUpdateManyWithWhereWithoutCostItemInput>;
    deleteMany?: Enumerable<ReceiptScalarWhereInput>;
  };

  export type UserCreateNestedOneWithoutReceiptsInput = {
    create?: XOR<
      UserCreateWithoutReceiptsInput,
      UserUncheckedCreateWithoutReceiptsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutReceiptsInput;
    connect?: UserWhereUniqueInput;
  };

  export type CostItemCreateNestedOneWithoutReceiptsInput = {
    create?: XOR<
      CostItemCreateWithoutReceiptsInput,
      CostItemUncheckedCreateWithoutReceiptsInput
    >;
    connectOrCreate?: CostItemCreateOrConnectWithoutReceiptsInput;
    connect?: CostItemWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutReceiptsInput = {
    create?: XOR<
      UserCreateWithoutReceiptsInput,
      UserUncheckedCreateWithoutReceiptsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutReceiptsInput;
    upsert?: UserUpsertWithoutReceiptsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      UserUpdateWithoutReceiptsInput,
      UserUncheckedUpdateWithoutReceiptsInput
    >;
  };

  export type CostItemUpdateOneRequiredWithoutReceiptsInput = {
    create?: XOR<
      CostItemCreateWithoutReceiptsInput,
      CostItemUncheckedCreateWithoutReceiptsInput
    >;
    connectOrCreate?: CostItemCreateOrConnectWithoutReceiptsInput;
    upsert?: CostItemUpsertWithoutReceiptsInput;
    connect?: CostItemWhereUniqueInput;
    update?: XOR<
      CostItemUpdateWithoutReceiptsInput,
      CostItemUncheckedUpdateWithoutReceiptsInput
    >;
  };

  export type TumiEventCreateNestedOneWithoutPhotoShareInput = {
    create?: XOR<
      TumiEventCreateWithoutPhotoShareInput,
      TumiEventUncheckedCreateWithoutPhotoShareInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutPhotoShareInput;
    connect?: TumiEventWhereUniqueInput;
  };

  export type TumiEventUpdateOneRequiredWithoutPhotoShareInput = {
    create?: XOR<
      TumiEventCreateWithoutPhotoShareInput,
      TumiEventUncheckedCreateWithoutPhotoShareInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutPhotoShareInput;
    upsert?: TumiEventUpsertWithoutPhotoShareInput;
    connect?: TumiEventWhereUniqueInput;
    update?: XOR<
      TumiEventUpdateWithoutPhotoShareInput,
      TumiEventUncheckedUpdateWithoutPhotoShareInput
    >;
  };

  export type UserCreateNestedOneWithoutEventRegistrationsInput = {
    create?: XOR<
      UserCreateWithoutEventRegistrationsInput,
      UserUncheckedCreateWithoutEventRegistrationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEventRegistrationsInput;
    connect?: UserWhereUniqueInput;
  };

  export type TumiEventCreateNestedOneWithoutRegistrationsInput = {
    create?: XOR<
      TumiEventCreateWithoutRegistrationsInput,
      TumiEventUncheckedCreateWithoutRegistrationsInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutRegistrationsInput;
    connect?: TumiEventWhereUniqueInput;
  };

  export type EnumRegistrationTypeFieldUpdateOperationsInput = {
    set?: RegistrationType;
  };

  export type UserUpdateOneRequiredWithoutEventRegistrationsInput = {
    create?: XOR<
      UserCreateWithoutEventRegistrationsInput,
      UserUncheckedCreateWithoutEventRegistrationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEventRegistrationsInput;
    upsert?: UserUpsertWithoutEventRegistrationsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      UserUpdateWithoutEventRegistrationsInput,
      UserUncheckedUpdateWithoutEventRegistrationsInput
    >;
  };

  export type TumiEventUpdateOneRequiredWithoutRegistrationsInput = {
    create?: XOR<
      TumiEventCreateWithoutRegistrationsInput,
      TumiEventUncheckedCreateWithoutRegistrationsInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutRegistrationsInput;
    upsert?: TumiEventUpsertWithoutRegistrationsInput;
    connect?: TumiEventWhereUniqueInput;
    update?: XOR<
      TumiEventUpdateWithoutRegistrationsInput,
      TumiEventUncheckedUpdateWithoutRegistrationsInput
    >;
  };

  export type TumiEventCreateNestedOneWithoutSubmissionItemsInput = {
    create?: XOR<
      TumiEventCreateWithoutSubmissionItemsInput,
      TumiEventUncheckedCreateWithoutSubmissionItemsInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutSubmissionItemsInput;
    connect?: TumiEventWhereUniqueInput;
  };

  export type EventSubmissionCreateNestedManyWithoutSubmissionItemInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutSubmissionItemInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutSubmissionItemInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutSubmissionItemInput>;
    createMany?: EventSubmissionCreateManySubmissionItemInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
  };

  export type EventSubmissionUncheckedCreateNestedManyWithoutSubmissionItemInput =
    {
      create?: XOR<
        Enumerable<EventSubmissionCreateWithoutSubmissionItemInput>,
        Enumerable<EventSubmissionUncheckedCreateWithoutSubmissionItemInput>
      >;
      connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutSubmissionItemInput>;
      createMany?: EventSubmissionCreateManySubmissionItemInputEnvelope;
      connect?: Enumerable<EventSubmissionWhereUniqueInput>;
    };

  export type EnumSubmissionTimeFieldUpdateOperationsInput = {
    set?: SubmissionTime;
  };

  export type TumiEventUpdateOneRequiredWithoutSubmissionItemsInput = {
    create?: XOR<
      TumiEventCreateWithoutSubmissionItemsInput,
      TumiEventUncheckedCreateWithoutSubmissionItemsInput
    >;
    connectOrCreate?: TumiEventCreateOrConnectWithoutSubmissionItemsInput;
    upsert?: TumiEventUpsertWithoutSubmissionItemsInput;
    connect?: TumiEventWhereUniqueInput;
    update?: XOR<
      TumiEventUpdateWithoutSubmissionItemsInput,
      TumiEventUncheckedUpdateWithoutSubmissionItemsInput
    >;
  };

  export type EventSubmissionUpdateManyWithoutSubmissionItemInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutSubmissionItemInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutSubmissionItemInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutSubmissionItemInput>;
    upsert?: Enumerable<EventSubmissionUpsertWithWhereUniqueWithoutSubmissionItemInput>;
    createMany?: EventSubmissionCreateManySubmissionItemInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
    set?: Enumerable<EventSubmissionWhereUniqueInput>;
    disconnect?: Enumerable<EventSubmissionWhereUniqueInput>;
    delete?: Enumerable<EventSubmissionWhereUniqueInput>;
    update?: Enumerable<EventSubmissionUpdateWithWhereUniqueWithoutSubmissionItemInput>;
    updateMany?: Enumerable<EventSubmissionUpdateManyWithWhereWithoutSubmissionItemInput>;
    deleteMany?: Enumerable<EventSubmissionScalarWhereInput>;
  };

  export type EventSubmissionUncheckedUpdateManyWithoutSubmissionItemInput = {
    create?: XOR<
      Enumerable<EventSubmissionCreateWithoutSubmissionItemInput>,
      Enumerable<EventSubmissionUncheckedCreateWithoutSubmissionItemInput>
    >;
    connectOrCreate?: Enumerable<EventSubmissionCreateOrConnectWithoutSubmissionItemInput>;
    upsert?: Enumerable<EventSubmissionUpsertWithWhereUniqueWithoutSubmissionItemInput>;
    createMany?: EventSubmissionCreateManySubmissionItemInputEnvelope;
    connect?: Enumerable<EventSubmissionWhereUniqueInput>;
    set?: Enumerable<EventSubmissionWhereUniqueInput>;
    disconnect?: Enumerable<EventSubmissionWhereUniqueInput>;
    delete?: Enumerable<EventSubmissionWhereUniqueInput>;
    update?: Enumerable<EventSubmissionUpdateWithWhereUniqueWithoutSubmissionItemInput>;
    updateMany?: Enumerable<EventSubmissionUpdateManyWithWhereWithoutSubmissionItemInput>;
    deleteMany?: Enumerable<EventSubmissionScalarWhereInput>;
  };

  export type UserCreateNestedOneWithoutEventSubmissionsInput = {
    create?: XOR<
      UserCreateWithoutEventSubmissionsInput,
      UserUncheckedCreateWithoutEventSubmissionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEventSubmissionsInput;
    connect?: UserWhereUniqueInput;
  };

  export type EventSubmissionItemCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<
      EventSubmissionItemCreateWithoutSubmissionsInput,
      EventSubmissionItemUncheckedCreateWithoutSubmissionsInput
    >;
    connectOrCreate?: EventSubmissionItemCreateOrConnectWithoutSubmissionsInput;
    connect?: EventSubmissionItemWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutEventSubmissionsInput = {
    create?: XOR<
      UserCreateWithoutEventSubmissionsInput,
      UserUncheckedCreateWithoutEventSubmissionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEventSubmissionsInput;
    upsert?: UserUpsertWithoutEventSubmissionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      UserUpdateWithoutEventSubmissionsInput,
      UserUncheckedUpdateWithoutEventSubmissionsInput
    >;
  };

  export type EventSubmissionItemUpdateOneRequiredWithoutSubmissionsInput = {
    create?: XOR<
      EventSubmissionItemCreateWithoutSubmissionsInput,
      EventSubmissionItemUncheckedCreateWithoutSubmissionsInput
    >;
    connectOrCreate?: EventSubmissionItemCreateOrConnectWithoutSubmissionsInput;
    upsert?: EventSubmissionItemUpsertWithoutSubmissionsInput;
    connect?: EventSubmissionItemWhereUniqueInput;
    update?: XOR<
      EventSubmissionItemUpdateWithoutSubmissionsInput,
      EventSubmissionItemUncheckedUpdateWithoutSubmissionsInput
    >;
  };

  export type NestedStringFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringFilter | string;
  };

  export type NestedDateTimeFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeFilter | Date | string;
  };

  export type NestedStringWithAggregatesFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringWithAggregatesFilter | string;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
  };

  export type NestedIntFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntFilter | number;
  };

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeWithAggregatesFilter | Date | string;
    _count?: NestedIntFilter;
    _min?: NestedDateTimeFilter;
    _max?: NestedDateTimeFilter;
  };

  export type NestedBoolFilter = {
    equals?: boolean;
    not?: NestedBoolFilter | boolean;
  };

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter | boolean;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
  };

  export type NestedEnumRoleFilter = {
    equals?: Role;
    in?: Enumerable<Role>;
    notIn?: Enumerable<Role>;
    not?: NestedEnumRoleFilter | Role;
  };

  export type NestedEnumMembershipStatusFilter = {
    equals?: MembershipStatus;
    in?: Enumerable<MembershipStatus>;
    notIn?: Enumerable<MembershipStatus>;
    not?: NestedEnumMembershipStatusFilter | MembershipStatus;
  };

  export type NestedEnumRoleWithAggregatesFilter = {
    equals?: Role;
    in?: Enumerable<Role>;
    notIn?: Enumerable<Role>;
    not?: NestedEnumRoleWithAggregatesFilter | Role;
    _count?: NestedIntFilter;
    _min?: NestedEnumRoleFilter;
    _max?: NestedEnumRoleFilter;
  };

  export type NestedEnumMembershipStatusWithAggregatesFilter = {
    equals?: MembershipStatus;
    in?: Enumerable<MembershipStatus>;
    notIn?: Enumerable<MembershipStatus>;
    not?: NestedEnumMembershipStatusWithAggregatesFilter | MembershipStatus;
    _count?: NestedIntFilter;
    _min?: NestedEnumMembershipStatusFilter;
    _max?: NestedEnumMembershipStatusFilter;
  };

  export type NestedStringNullableFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringNullableFilter | string | null;
  };

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringNullableWithAggregatesFilter | string | null;
    _count?: NestedIntNullableFilter;
    _min?: NestedStringNullableFilter;
    _max?: NestedStringNullableFilter;
  };

  export type NestedIntNullableFilter = {
    equals?: number | null;
    in?: Enumerable<number> | null;
    notIn?: Enumerable<number> | null;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntNullableFilter | number | null;
  };

  export type NestedDecimalFilter = {
    equals?: Decimal | number | string;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?: NestedDecimalFilter | Decimal | number | string;
  };

  export type NestedDecimalWithAggregatesFilter = {
    equals?: Decimal | number | string;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    notIn?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string>;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?: NestedDecimalWithAggregatesFilter | Decimal | number | string;
    _count?: NestedIntFilter;
    _avg?: NestedDecimalFilter;
    _sum?: NestedDecimalFilter;
    _min?: NestedDecimalFilter;
    _max?: NestedDecimalFilter;
  };
  export type NestedJsonFilter =
    | PatchUndefined<
        Either<
          Required<NestedJsonFilterBase>,
          Exclude<keyof Required<NestedJsonFilterBase>, 'path'>
        >,
        Required<NestedJsonFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase>, 'path'>>;

  export type NestedJsonFilterBase = {
    equals?: JsonNullValueFilter | InputJsonValue;
    not?: JsonNullValueFilter | InputJsonValue;
  };

  export type NestedDecimalNullableFilter = {
    equals?: Decimal | number | string | null;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null;
    notIn?:
      | Enumerable<Decimal>
      | Enumerable<number>
      | Enumerable<string>
      | null;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?: NestedDecimalNullableFilter | Decimal | number | string | null;
  };

  export type NestedEnumRegistrationModeFilter = {
    equals?: RegistrationMode;
    in?: Enumerable<RegistrationMode>;
    notIn?: Enumerable<RegistrationMode>;
    not?: NestedEnumRegistrationModeFilter | RegistrationMode;
  };

  export type NestedEnumPublicationStateFilter = {
    equals?: PublicationState;
    in?: Enumerable<PublicationState>;
    notIn?: Enumerable<PublicationState>;
    not?: NestedEnumPublicationStateFilter | PublicationState;
  };

  export type NestedIntWithAggregatesFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntWithAggregatesFilter | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedIntFilter;
    _min?: NestedIntFilter;
    _max?: NestedIntFilter;
  };

  export type NestedFloatFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedFloatFilter | number;
  };

  export type NestedDecimalNullableWithAggregatesFilter = {
    equals?: Decimal | number | string | null;
    in?: Enumerable<Decimal> | Enumerable<number> | Enumerable<string> | null;
    notIn?:
      | Enumerable<Decimal>
      | Enumerable<number>
      | Enumerable<string>
      | null;
    lt?: Decimal | number | string;
    lte?: Decimal | number | string;
    gt?: Decimal | number | string;
    gte?: Decimal | number | string;
    not?:
      | NestedDecimalNullableWithAggregatesFilter
      | Decimal
      | number
      | string
      | null;
    _count?: NestedIntNullableFilter;
    _avg?: NestedDecimalNullableFilter;
    _sum?: NestedDecimalNullableFilter;
    _min?: NestedDecimalNullableFilter;
    _max?: NestedDecimalNullableFilter;
  };

  export type NestedEnumRegistrationModeWithAggregatesFilter = {
    equals?: RegistrationMode;
    in?: Enumerable<RegistrationMode>;
    notIn?: Enumerable<RegistrationMode>;
    not?: NestedEnumRegistrationModeWithAggregatesFilter | RegistrationMode;
    _count?: NestedIntFilter;
    _min?: NestedEnumRegistrationModeFilter;
    _max?: NestedEnumRegistrationModeFilter;
  };

  export type NestedEnumPublicationStateWithAggregatesFilter = {
    equals?: PublicationState;
    in?: Enumerable<PublicationState>;
    notIn?: Enumerable<PublicationState>;
    not?: NestedEnumPublicationStateWithAggregatesFilter | PublicationState;
    _count?: NestedIntFilter;
    _min?: NestedEnumPublicationStateFilter;
    _max?: NestedEnumPublicationStateFilter;
  };

  export type NestedEnumRegistrationTypeFilter = {
    equals?: RegistrationType;
    in?: Enumerable<RegistrationType>;
    notIn?: Enumerable<RegistrationType>;
    not?: NestedEnumRegistrationTypeFilter | RegistrationType;
  };

  export type NestedEnumRegistrationTypeWithAggregatesFilter = {
    equals?: RegistrationType;
    in?: Enumerable<RegistrationType>;
    notIn?: Enumerable<RegistrationType>;
    not?: NestedEnumRegistrationTypeWithAggregatesFilter | RegistrationType;
    _count?: NestedIntFilter;
    _min?: NestedEnumRegistrationTypeFilter;
    _max?: NestedEnumRegistrationTypeFilter;
  };

  export type NestedEnumSubmissionTimeFilter = {
    equals?: SubmissionTime;
    in?: Enumerable<SubmissionTime>;
    notIn?: Enumerable<SubmissionTime>;
    not?: NestedEnumSubmissionTimeFilter | SubmissionTime;
  };

  export type NestedEnumSubmissionTimeWithAggregatesFilter = {
    equals?: SubmissionTime;
    in?: Enumerable<SubmissionTime>;
    notIn?: Enumerable<SubmissionTime>;
    not?: NestedEnumSubmissionTimeWithAggregatesFilter | SubmissionTime;
    _count?: NestedIntFilter;
    _min?: NestedEnumSubmissionTimeFilter;
    _max?: NestedEnumSubmissionTimeFilter;
  };

  export type UsersOfTenantsCreateWithoutTenantInput = {
    createdAt?: Date | string;
    role?: Role;
    status?: MembershipStatus;
    user: UserCreateNestedOneWithoutTenantsInput;
  };

  export type UsersOfTenantsUncheckedCreateWithoutTenantInput = {
    createdAt?: Date | string;
    userId: string;
    role?: Role;
    status?: MembershipStatus;
  };

  export type UsersOfTenantsCreateOrConnectWithoutTenantInput = {
    where: UsersOfTenantsWhereUniqueInput;
    create: XOR<
      UsersOfTenantsCreateWithoutTenantInput,
      UsersOfTenantsUncheckedCreateWithoutTenantInput
    >;
  };

  export type UsersOfTenantsCreateManyTenantInputEnvelope = {
    data: Enumerable<UsersOfTenantsCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type EventTemplateCreateWithoutTenantInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    eventInstances?: TumiEventCreateNestedManyWithoutEventTemplateInput;
  };

  export type EventTemplateUncheckedCreateWithoutTenantInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    eventInstances?: TumiEventUncheckedCreateNestedManyWithoutEventTemplateInput;
  };

  export type EventTemplateCreateOrConnectWithoutTenantInput = {
    where: EventTemplateWhereUniqueInput;
    create: XOR<
      EventTemplateCreateWithoutTenantInput,
      EventTemplateUncheckedCreateWithoutTenantInput
    >;
  };

  export type EventTemplateCreateManyTenantInputEnvelope = {
    data: Enumerable<EventTemplateCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type EventOrganizerCreateWithoutTenantInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    text: string;
    link?: string | null;
    events?: TumiEventCreateNestedManyWithoutOrganizerInput;
  };

  export type EventOrganizerUncheckedCreateWithoutTenantInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    text: string;
    link?: string | null;
    events?: TumiEventUncheckedCreateNestedManyWithoutOrganizerInput;
  };

  export type EventOrganizerCreateOrConnectWithoutTenantInput = {
    where: EventOrganizerWhereUniqueInput;
    create: XOR<
      EventOrganizerCreateWithoutTenantInput,
      EventOrganizerUncheckedCreateWithoutTenantInput
    >;
  };

  export type EventOrganizerCreateManyTenantInputEnvelope = {
    data: Enumerable<EventOrganizerCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type UsersOfTenantsUpsertWithWhereUniqueWithoutTenantInput = {
    where: UsersOfTenantsWhereUniqueInput;
    update: XOR<
      UsersOfTenantsUpdateWithoutTenantInput,
      UsersOfTenantsUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      UsersOfTenantsCreateWithoutTenantInput,
      UsersOfTenantsUncheckedCreateWithoutTenantInput
    >;
  };

  export type UsersOfTenantsUpdateWithWhereUniqueWithoutTenantInput = {
    where: UsersOfTenantsWhereUniqueInput;
    data: XOR<
      UsersOfTenantsUpdateWithoutTenantInput,
      UsersOfTenantsUncheckedUpdateWithoutTenantInput
    >;
  };

  export type UsersOfTenantsUpdateManyWithWhereWithoutTenantInput = {
    where: UsersOfTenantsScalarWhereInput;
    data: XOR<
      UsersOfTenantsUpdateManyMutationInput,
      UsersOfTenantsUncheckedUpdateManyWithoutUsersInput
    >;
  };

  export type UsersOfTenantsScalarWhereInput = {
    AND?: Enumerable<UsersOfTenantsScalarWhereInput>;
    OR?: Enumerable<UsersOfTenantsScalarWhereInput>;
    NOT?: Enumerable<UsersOfTenantsScalarWhereInput>;
    createdAt?: DateTimeFilter | Date | string;
    userId?: StringFilter | string;
    tenantId?: StringFilter | string;
    role?: EnumRoleFilter | Role;
    status?: EnumMembershipStatusFilter | MembershipStatus;
  };

  export type EventTemplateUpsertWithWhereUniqueWithoutTenantInput = {
    where: EventTemplateWhereUniqueInput;
    update: XOR<
      EventTemplateUpdateWithoutTenantInput,
      EventTemplateUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      EventTemplateCreateWithoutTenantInput,
      EventTemplateUncheckedCreateWithoutTenantInput
    >;
  };

  export type EventTemplateUpdateWithWhereUniqueWithoutTenantInput = {
    where: EventTemplateWhereUniqueInput;
    data: XOR<
      EventTemplateUpdateWithoutTenantInput,
      EventTemplateUncheckedUpdateWithoutTenantInput
    >;
  };

  export type EventTemplateUpdateManyWithWhereWithoutTenantInput = {
    where: EventTemplateScalarWhereInput;
    data: XOR<
      EventTemplateUpdateManyMutationInput,
      EventTemplateUncheckedUpdateManyWithoutEventTemplatesInput
    >;
  };

  export type EventTemplateScalarWhereInput = {
    AND?: Enumerable<EventTemplateScalarWhereInput>;
    OR?: Enumerable<EventTemplateScalarWhereInput>;
    NOT?: Enumerable<EventTemplateScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    title?: StringFilter | string;
    icon?: StringFilter | string;
    description?: StringFilter | string;
    comment?: StringFilter | string;
    location?: StringFilter | string;
    locationId?: StringFilter | string;
    duration?: DecimalFilter | Decimal | number | string;
    participantText?: StringFilter | string;
    participantMail?: StringFilter | string;
    organizerText?: StringFilter | string;
    finances?: JsonFilter;
    tenantId?: StringFilter | string;
  };

  export type EventOrganizerUpsertWithWhereUniqueWithoutTenantInput = {
    where: EventOrganizerWhereUniqueInput;
    update: XOR<
      EventOrganizerUpdateWithoutTenantInput,
      EventOrganizerUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      EventOrganizerCreateWithoutTenantInput,
      EventOrganizerUncheckedCreateWithoutTenantInput
    >;
  };

  export type EventOrganizerUpdateWithWhereUniqueWithoutTenantInput = {
    where: EventOrganizerWhereUniqueInput;
    data: XOR<
      EventOrganizerUpdateWithoutTenantInput,
      EventOrganizerUncheckedUpdateWithoutTenantInput
    >;
  };

  export type EventOrganizerUpdateManyWithWhereWithoutTenantInput = {
    where: EventOrganizerScalarWhereInput;
    data: XOR<
      EventOrganizerUpdateManyMutationInput,
      EventOrganizerUncheckedUpdateManyWithoutOrganizersInput
    >;
  };

  export type EventOrganizerScalarWhereInput = {
    AND?: Enumerable<EventOrganizerScalarWhereInput>;
    OR?: Enumerable<EventOrganizerScalarWhereInput>;
    NOT?: Enumerable<EventOrganizerScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    tenantId?: StringFilter | string;
    name?: StringFilter | string;
    text?: StringFilter | string;
    link?: StringNullableFilter | string | null;
  };

  export type UsersOfTenantsCreateWithoutUserInput = {
    createdAt?: Date | string;
    role?: Role;
    status?: MembershipStatus;
    tenant: TenantCreateNestedOneWithoutUsersInput;
  };

  export type UsersOfTenantsUncheckedCreateWithoutUserInput = {
    createdAt?: Date | string;
    tenantId: string;
    role?: Role;
    status?: MembershipStatus;
  };

  export type UsersOfTenantsCreateOrConnectWithoutUserInput = {
    where: UsersOfTenantsWhereUniqueInput;
    create: XOR<
      UsersOfTenantsCreateWithoutUserInput,
      UsersOfTenantsUncheckedCreateWithoutUserInput
    >;
  };

  export type UsersOfTenantsCreateManyUserInputEnvelope = {
    data: Enumerable<UsersOfTenantsCreateManyUserInput>;
    skipDuplicates?: boolean;
  };

  export type EventSubmissionCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    submissionItem: EventSubmissionItemCreateNestedOneWithoutSubmissionsInput;
  };

  export type EventSubmissionUncheckedCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    submissionItemId: string;
  };

  export type EventSubmissionCreateOrConnectWithoutUserInput = {
    where: EventSubmissionWhereUniqueInput;
    create: XOR<
      EventSubmissionCreateWithoutUserInput,
      EventSubmissionUncheckedCreateWithoutUserInput
    >;
  };

  export type EventSubmissionCreateManyUserInputEnvelope = {
    data: Enumerable<EventSubmissionCreateManyUserInput>;
    skipDuplicates?: boolean;
  };

  export type EventRegistrationCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    event: TumiEventCreateNestedOneWithoutRegistrationsInput;
  };

  export type EventRegistrationUncheckedCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    eventId: string;
  };

  export type EventRegistrationCreateOrConnectWithoutUserInput = {
    where: EventRegistrationWhereUniqueInput;
    create: XOR<
      EventRegistrationCreateWithoutUserInput,
      EventRegistrationUncheckedCreateWithoutUserInput
    >;
  };

  export type EventRegistrationCreateManyUserInputEnvelope = {
    data: Enumerable<EventRegistrationCreateManyUserInput>;
    skipDuplicates?: boolean;
  };

  export type ReceiptCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
    costItem: CostItemCreateNestedOneWithoutReceiptsInput;
  };

  export type ReceiptUncheckedCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    costItemId: string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
  };

  export type ReceiptCreateOrConnectWithoutUserInput = {
    where: ReceiptWhereUniqueInput;
    create: XOR<
      ReceiptCreateWithoutUserInput,
      ReceiptUncheckedCreateWithoutUserInput
    >;
  };

  export type ReceiptCreateManyUserInputEnvelope = {
    data: Enumerable<ReceiptCreateManyUserInput>;
    skipDuplicates?: boolean;
  };

  export type TumiEventCreateWithoutCreatedByInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutCreatedByInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutCreatedByInput,
      TumiEventUncheckedCreateWithoutCreatedByInput
    >;
  };

  export type TumiEventCreateManyCreatedByInputEnvelope = {
    data: Enumerable<TumiEventCreateManyCreatedByInput>;
    skipDuplicates?: boolean;
  };

  export type UsersOfTenantsUpsertWithWhereUniqueWithoutUserInput = {
    where: UsersOfTenantsWhereUniqueInput;
    update: XOR<
      UsersOfTenantsUpdateWithoutUserInput,
      UsersOfTenantsUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      UsersOfTenantsCreateWithoutUserInput,
      UsersOfTenantsUncheckedCreateWithoutUserInput
    >;
  };

  export type UsersOfTenantsUpdateWithWhereUniqueWithoutUserInput = {
    where: UsersOfTenantsWhereUniqueInput;
    data: XOR<
      UsersOfTenantsUpdateWithoutUserInput,
      UsersOfTenantsUncheckedUpdateWithoutUserInput
    >;
  };

  export type UsersOfTenantsUpdateManyWithWhereWithoutUserInput = {
    where: UsersOfTenantsScalarWhereInput;
    data: XOR<
      UsersOfTenantsUpdateManyMutationInput,
      UsersOfTenantsUncheckedUpdateManyWithoutTenantsInput
    >;
  };

  export type EventSubmissionUpsertWithWhereUniqueWithoutUserInput = {
    where: EventSubmissionWhereUniqueInput;
    update: XOR<
      EventSubmissionUpdateWithoutUserInput,
      EventSubmissionUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      EventSubmissionCreateWithoutUserInput,
      EventSubmissionUncheckedCreateWithoutUserInput
    >;
  };

  export type EventSubmissionUpdateWithWhereUniqueWithoutUserInput = {
    where: EventSubmissionWhereUniqueInput;
    data: XOR<
      EventSubmissionUpdateWithoutUserInput,
      EventSubmissionUncheckedUpdateWithoutUserInput
    >;
  };

  export type EventSubmissionUpdateManyWithWhereWithoutUserInput = {
    where: EventSubmissionScalarWhereInput;
    data: XOR<
      EventSubmissionUpdateManyMutationInput,
      EventSubmissionUncheckedUpdateManyWithoutEventSubmissionsInput
    >;
  };

  export type EventSubmissionScalarWhereInput = {
    AND?: Enumerable<EventSubmissionScalarWhereInput>;
    OR?: Enumerable<EventSubmissionScalarWhereInput>;
    NOT?: Enumerable<EventSubmissionScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    userId?: StringFilter | string;
    submissionItemId?: StringFilter | string;
  };

  export type EventRegistrationUpsertWithWhereUniqueWithoutUserInput = {
    where: EventRegistrationWhereUniqueInput;
    update: XOR<
      EventRegistrationUpdateWithoutUserInput,
      EventRegistrationUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      EventRegistrationCreateWithoutUserInput,
      EventRegistrationUncheckedCreateWithoutUserInput
    >;
  };

  export type EventRegistrationUpdateWithWhereUniqueWithoutUserInput = {
    where: EventRegistrationWhereUniqueInput;
    data: XOR<
      EventRegistrationUpdateWithoutUserInput,
      EventRegistrationUncheckedUpdateWithoutUserInput
    >;
  };

  export type EventRegistrationUpdateManyWithWhereWithoutUserInput = {
    where: EventRegistrationScalarWhereInput;
    data: XOR<
      EventRegistrationUpdateManyMutationInput,
      EventRegistrationUncheckedUpdateManyWithoutEventRegistrationsInput
    >;
  };

  export type EventRegistrationScalarWhereInput = {
    AND?: Enumerable<EventRegistrationScalarWhereInput>;
    OR?: Enumerable<EventRegistrationScalarWhereInput>;
    NOT?: Enumerable<EventRegistrationScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    type?: EnumRegistrationTypeFilter | RegistrationType;
    userId?: StringFilter | string;
    eventId?: StringFilter | string;
  };

  export type ReceiptUpsertWithWhereUniqueWithoutUserInput = {
    where: ReceiptWhereUniqueInput;
    update: XOR<
      ReceiptUpdateWithoutUserInput,
      ReceiptUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ReceiptCreateWithoutUserInput,
      ReceiptUncheckedCreateWithoutUserInput
    >;
  };

  export type ReceiptUpdateWithWhereUniqueWithoutUserInput = {
    where: ReceiptWhereUniqueInput;
    data: XOR<
      ReceiptUpdateWithoutUserInput,
      ReceiptUncheckedUpdateWithoutUserInput
    >;
  };

  export type ReceiptUpdateManyWithWhereWithoutUserInput = {
    where: ReceiptScalarWhereInput;
    data: XOR<
      ReceiptUpdateManyMutationInput,
      ReceiptUncheckedUpdateManyWithoutReceiptsInput
    >;
  };

  export type ReceiptScalarWhereInput = {
    AND?: Enumerable<ReceiptScalarWhereInput>;
    OR?: Enumerable<ReceiptScalarWhereInput>;
    NOT?: Enumerable<ReceiptScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    userId?: StringFilter | string;
    costItemId?: StringFilter | string;
    covered?: BoolFilter | boolean;
    amount?: IntFilter | number;
    date?: DateTimeFilter | Date | string;
    amountCovered?: IntFilter | number;
  };

  export type TumiEventUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: TumiEventWhereUniqueInput;
    update: XOR<
      TumiEventUpdateWithoutCreatedByInput,
      TumiEventUncheckedUpdateWithoutCreatedByInput
    >;
    create: XOR<
      TumiEventCreateWithoutCreatedByInput,
      TumiEventUncheckedCreateWithoutCreatedByInput
    >;
  };

  export type TumiEventUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: TumiEventWhereUniqueInput;
    data: XOR<
      TumiEventUpdateWithoutCreatedByInput,
      TumiEventUncheckedUpdateWithoutCreatedByInput
    >;
  };

  export type TumiEventUpdateManyWithWhereWithoutCreatedByInput = {
    where: TumiEventScalarWhereInput;
    data: XOR<
      TumiEventUpdateManyMutationInput,
      TumiEventUncheckedUpdateManyWithoutCreatedEventsInput
    >;
  };

  export type TumiEventScalarWhereInput = {
    AND?: Enumerable<TumiEventScalarWhereInput>;
    OR?: Enumerable<TumiEventScalarWhereInput>;
    NOT?: Enumerable<TumiEventScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    title?: StringFilter | string;
    icon?: StringFilter | string;
    start?: DateTimeFilter | Date | string;
    end?: DateTimeFilter | Date | string;
    description?: StringFilter | string;
    location?: StringFilter | string;
    locationId?: StringFilter | string;
    participantText?: StringFilter | string;
    participantMail?: StringFilter | string;
    organizerText?: StringFilter | string;
    participantLimit?: IntFilter | number;
    organizerLimit?: IntFilter | number;
    price?: DecimalNullableFilter | Decimal | number | string | null;
    registrationLink?: StringNullableFilter | string | null;
    registrationMode?: EnumRegistrationModeFilter | RegistrationMode;
    publicationState?: EnumPublicationStateFilter | PublicationState;
    participantSignup?: EnumMembershipStatusNullableListFilter;
    organizerSignup?: EnumMembershipStatusNullableListFilter;
    eventOrganizerId?: StringFilter | string;
    creatorId?: StringFilter | string;
    eventTemplateId?: StringFilter | string;
  };

  export type UserCreateWithoutTenantsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    eventSubmissions?: EventSubmissionCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationCreateNestedManyWithoutUserInput;
    receipts?: ReceiptCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventCreateNestedManyWithoutCreatedByInput;
  };

  export type UserUncheckedCreateWithoutTenantsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    eventSubmissions?: EventSubmissionUncheckedCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedCreateNestedManyWithoutUserInput;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedCreateNestedManyWithoutCreatedByInput;
  };

  export type UserCreateOrConnectWithoutTenantsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutTenantsInput,
      UserUncheckedCreateWithoutTenantsInput
    >;
  };

  export type TenantCreateWithoutUsersInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    eventTemplates?: EventTemplateCreateNestedManyWithoutTenantInput;
    organizers?: EventOrganizerCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    eventTemplates?: EventTemplateUncheckedCreateNestedManyWithoutTenantInput;
    organizers?: EventOrganizerUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutUsersInput,
      TenantUncheckedCreateWithoutUsersInput
    >;
  };

  export type UserUpsertWithoutTenantsInput = {
    update: XOR<
      UserUpdateWithoutTenantsInput,
      UserUncheckedUpdateWithoutTenantsInput
    >;
    create: XOR<
      UserCreateWithoutTenantsInput,
      UserUncheckedCreateWithoutTenantsInput
    >;
  };

  export type UserUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventSubmissions?: EventSubmissionUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUpdateManyWithoutUserInput;
    receipts?: ReceiptUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUpdateManyWithoutCreatedByInput;
  };

  export type UserUncheckedUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventSubmissions?: EventSubmissionUncheckedUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedUpdateManyWithoutUserInput;
    receipts?: ReceiptUncheckedUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedUpdateManyWithoutCreatedByInput;
  };

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<
      TenantUpdateWithoutUsersInput,
      TenantUncheckedUpdateWithoutUsersInput
    >;
    create: XOR<
      TenantCreateWithoutUsersInput,
      TenantUncheckedCreateWithoutUsersInput
    >;
  };

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    eventTemplates?: EventTemplateUpdateManyWithoutTenantInput;
    organizers?: EventOrganizerUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    eventTemplates?: EventTemplateUncheckedUpdateManyWithoutTenantInput;
    organizers?: EventOrganizerUncheckedUpdateManyWithoutTenantInput;
  };

  export type TenantCreateWithoutOrganizersInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    users?: UsersOfTenantsCreateNestedManyWithoutTenantInput;
    eventTemplates?: EventTemplateCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutOrganizersInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    users?: UsersOfTenantsUncheckedCreateNestedManyWithoutTenantInput;
    eventTemplates?: EventTemplateUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutOrganizersInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutOrganizersInput,
      TenantUncheckedCreateWithoutOrganizersInput
    >;
  };

  export type TumiEventCreateWithoutOrganizerInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateWithoutOrganizerInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutOrganizerInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutOrganizerInput,
      TumiEventUncheckedCreateWithoutOrganizerInput
    >;
  };

  export type TumiEventCreateManyOrganizerInputEnvelope = {
    data: Enumerable<TumiEventCreateManyOrganizerInput>;
    skipDuplicates?: boolean;
  };

  export type TenantUpsertWithoutOrganizersInput = {
    update: XOR<
      TenantUpdateWithoutOrganizersInput,
      TenantUncheckedUpdateWithoutOrganizersInput
    >;
    create: XOR<
      TenantCreateWithoutOrganizersInput,
      TenantUncheckedCreateWithoutOrganizersInput
    >;
  };

  export type TenantUpdateWithoutOrganizersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    users?: UsersOfTenantsUpdateManyWithoutTenantInput;
    eventTemplates?: EventTemplateUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutOrganizersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    users?: UsersOfTenantsUncheckedUpdateManyWithoutTenantInput;
    eventTemplates?: EventTemplateUncheckedUpdateManyWithoutTenantInput;
  };

  export type TumiEventUpsertWithWhereUniqueWithoutOrganizerInput = {
    where: TumiEventWhereUniqueInput;
    update: XOR<
      TumiEventUpdateWithoutOrganizerInput,
      TumiEventUncheckedUpdateWithoutOrganizerInput
    >;
    create: XOR<
      TumiEventCreateWithoutOrganizerInput,
      TumiEventUncheckedCreateWithoutOrganizerInput
    >;
  };

  export type TumiEventUpdateWithWhereUniqueWithoutOrganizerInput = {
    where: TumiEventWhereUniqueInput;
    data: XOR<
      TumiEventUpdateWithoutOrganizerInput,
      TumiEventUncheckedUpdateWithoutOrganizerInput
    >;
  };

  export type TumiEventUpdateManyWithWhereWithoutOrganizerInput = {
    where: TumiEventScalarWhereInput;
    data: XOR<
      TumiEventUpdateManyMutationInput,
      TumiEventUncheckedUpdateManyWithoutEventsInput
    >;
  };

  export type TumiEventCreateWithoutEventTemplateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
  };

  export type TumiEventUncheckedCreateWithoutEventTemplateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutEventTemplateInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutEventTemplateInput,
      TumiEventUncheckedCreateWithoutEventTemplateInput
    >;
  };

  export type TumiEventCreateManyEventTemplateInputEnvelope = {
    data: Enumerable<TumiEventCreateManyEventTemplateInput>;
    skipDuplicates?: boolean;
  };

  export type TenantCreateWithoutEventTemplatesInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    users?: UsersOfTenantsCreateNestedManyWithoutTenantInput;
    organizers?: EventOrganizerCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutEventTemplatesInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    shortName: string;
    users?: UsersOfTenantsUncheckedCreateNestedManyWithoutTenantInput;
    organizers?: EventOrganizerUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutEventTemplatesInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutEventTemplatesInput,
      TenantUncheckedCreateWithoutEventTemplatesInput
    >;
  };

  export type TumiEventUpsertWithWhereUniqueWithoutEventTemplateInput = {
    where: TumiEventWhereUniqueInput;
    update: XOR<
      TumiEventUpdateWithoutEventTemplateInput,
      TumiEventUncheckedUpdateWithoutEventTemplateInput
    >;
    create: XOR<
      TumiEventCreateWithoutEventTemplateInput,
      TumiEventUncheckedCreateWithoutEventTemplateInput
    >;
  };

  export type TumiEventUpdateWithWhereUniqueWithoutEventTemplateInput = {
    where: TumiEventWhereUniqueInput;
    data: XOR<
      TumiEventUpdateWithoutEventTemplateInput,
      TumiEventUncheckedUpdateWithoutEventTemplateInput
    >;
  };

  export type TumiEventUpdateManyWithWhereWithoutEventTemplateInput = {
    where: TumiEventScalarWhereInput;
    data: XOR<
      TumiEventUpdateManyMutationInput,
      TumiEventUncheckedUpdateManyWithoutEventInstancesInput
    >;
  };

  export type TenantUpsertWithoutEventTemplatesInput = {
    update: XOR<
      TenantUpdateWithoutEventTemplatesInput,
      TenantUncheckedUpdateWithoutEventTemplatesInput
    >;
    create: XOR<
      TenantCreateWithoutEventTemplatesInput,
      TenantUncheckedCreateWithoutEventTemplatesInput
    >;
  };

  export type TenantUpdateWithoutEventTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    users?: UsersOfTenantsUpdateManyWithoutTenantInput;
    organizers?: EventOrganizerUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutEventTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    shortName?: StringFieldUpdateOperationsInput | string;
    users?: UsersOfTenantsUncheckedUpdateManyWithoutTenantInput;
    organizers?: EventOrganizerUncheckedUpdateManyWithoutTenantInput;
  };

  export type EventSubmissionItemCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    required: boolean;
    submissionTime: SubmissionTime;
    submissions?: EventSubmissionCreateNestedManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemUncheckedCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    required: boolean;
    submissionTime: SubmissionTime;
    submissions?: EventSubmissionUncheckedCreateNestedManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemCreateOrConnectWithoutEventInput = {
    where: EventSubmissionItemWhereUniqueInput;
    create: XOR<
      EventSubmissionItemCreateWithoutEventInput,
      EventSubmissionItemUncheckedCreateWithoutEventInput
    >;
  };

  export type EventSubmissionItemCreateManyEventInputEnvelope = {
    data: Enumerable<EventSubmissionItemCreateManyEventInput>;
    skipDuplicates?: boolean;
  };

  export type EventRegistrationCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    user: UserCreateNestedOneWithoutEventRegistrationsInput;
  };

  export type EventRegistrationUncheckedCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    userId: string;
  };

  export type EventRegistrationCreateOrConnectWithoutEventInput = {
    where: EventRegistrationWhereUniqueInput;
    create: XOR<
      EventRegistrationCreateWithoutEventInput,
      EventRegistrationUncheckedCreateWithoutEventInput
    >;
  };

  export type EventRegistrationCreateManyEventInputEnvelope = {
    data: Enumerable<EventRegistrationCreateManyEventInput>;
    skipDuplicates?: boolean;
  };

  export type CostItemCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    ammount: Decimal | number | string;
    receipts?: ReceiptCreateNestedManyWithoutCostItemInput;
  };

  export type CostItemUncheckedCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    ammount: Decimal | number | string;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutCostItemInput;
  };

  export type CostItemCreateOrConnectWithoutEventInput = {
    where: CostItemWhereUniqueInput;
    create: XOR<
      CostItemCreateWithoutEventInput,
      CostItemUncheckedCreateWithoutEventInput
    >;
  };

  export type CostItemCreateManyEventInputEnvelope = {
    data: Enumerable<CostItemCreateManyEventInput>;
    skipDuplicates?: boolean;
  };

  export type PhotoShareCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
  };

  export type PhotoShareUncheckedCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
  };

  export type PhotoShareCreateOrConnectWithoutEventInput = {
    where: PhotoShareWhereUniqueInput;
    create: XOR<
      PhotoShareCreateWithoutEventInput,
      PhotoShareUncheckedCreateWithoutEventInput
    >;
  };

  export type EventOrganizerCreateWithoutEventsInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    text: string;
    link?: string | null;
    tenant: TenantCreateNestedOneWithoutOrganizersInput;
  };

  export type EventOrganizerUncheckedCreateWithoutEventsInput = {
    id?: string;
    createdAt?: Date | string;
    tenantId: string;
    name: string;
    text: string;
    link?: string | null;
  };

  export type EventOrganizerCreateOrConnectWithoutEventsInput = {
    where: EventOrganizerWhereUniqueInput;
    create: XOR<
      EventOrganizerCreateWithoutEventsInput,
      EventOrganizerUncheckedCreateWithoutEventsInput
    >;
  };

  export type UserCreateWithoutCreatedEventsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationCreateNestedManyWithoutUserInput;
    receipts?: ReceiptCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutCreatedEventsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsUncheckedCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedCreateNestedManyWithoutUserInput;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutCreatedEventsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutCreatedEventsInput,
      UserUncheckedCreateWithoutCreatedEventsInput
    >;
  };

  export type EventTemplateCreateWithoutEventInstancesInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    tenant: TenantCreateNestedOneWithoutEventTemplatesInput;
  };

  export type EventTemplateUncheckedCreateWithoutEventInstancesInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
    tenantId: string;
  };

  export type EventTemplateCreateOrConnectWithoutEventInstancesInput = {
    where: EventTemplateWhereUniqueInput;
    create: XOR<
      EventTemplateCreateWithoutEventInstancesInput,
      EventTemplateUncheckedCreateWithoutEventInstancesInput
    >;
  };

  export type EventSubmissionItemUpsertWithWhereUniqueWithoutEventInput = {
    where: EventSubmissionItemWhereUniqueInput;
    update: XOR<
      EventSubmissionItemUpdateWithoutEventInput,
      EventSubmissionItemUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      EventSubmissionItemCreateWithoutEventInput,
      EventSubmissionItemUncheckedCreateWithoutEventInput
    >;
  };

  export type EventSubmissionItemUpdateWithWhereUniqueWithoutEventInput = {
    where: EventSubmissionItemWhereUniqueInput;
    data: XOR<
      EventSubmissionItemUpdateWithoutEventInput,
      EventSubmissionItemUncheckedUpdateWithoutEventInput
    >;
  };

  export type EventSubmissionItemUpdateManyWithWhereWithoutEventInput = {
    where: EventSubmissionItemScalarWhereInput;
    data: XOR<
      EventSubmissionItemUpdateManyMutationInput,
      EventSubmissionItemUncheckedUpdateManyWithoutSubmissionItemsInput
    >;
  };

  export type EventSubmissionItemScalarWhereInput = {
    AND?: Enumerable<EventSubmissionItemScalarWhereInput>;
    OR?: Enumerable<EventSubmissionItemScalarWhereInput>;
    NOT?: Enumerable<EventSubmissionItemScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    eventId?: StringFilter | string;
    required?: BoolFilter | boolean;
    submissionTime?: EnumSubmissionTimeFilter | SubmissionTime;
  };

  export type EventRegistrationUpsertWithWhereUniqueWithoutEventInput = {
    where: EventRegistrationWhereUniqueInput;
    update: XOR<
      EventRegistrationUpdateWithoutEventInput,
      EventRegistrationUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      EventRegistrationCreateWithoutEventInput,
      EventRegistrationUncheckedCreateWithoutEventInput
    >;
  };

  export type EventRegistrationUpdateWithWhereUniqueWithoutEventInput = {
    where: EventRegistrationWhereUniqueInput;
    data: XOR<
      EventRegistrationUpdateWithoutEventInput,
      EventRegistrationUncheckedUpdateWithoutEventInput
    >;
  };

  export type EventRegistrationUpdateManyWithWhereWithoutEventInput = {
    where: EventRegistrationScalarWhereInput;
    data: XOR<
      EventRegistrationUpdateManyMutationInput,
      EventRegistrationUncheckedUpdateManyWithoutRegistrationsInput
    >;
  };

  export type CostItemUpsertWithWhereUniqueWithoutEventInput = {
    where: CostItemWhereUniqueInput;
    update: XOR<
      CostItemUpdateWithoutEventInput,
      CostItemUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      CostItemCreateWithoutEventInput,
      CostItemUncheckedCreateWithoutEventInput
    >;
  };

  export type CostItemUpdateWithWhereUniqueWithoutEventInput = {
    where: CostItemWhereUniqueInput;
    data: XOR<
      CostItemUpdateWithoutEventInput,
      CostItemUncheckedUpdateWithoutEventInput
    >;
  };

  export type CostItemUpdateManyWithWhereWithoutEventInput = {
    where: CostItemScalarWhereInput;
    data: XOR<
      CostItemUpdateManyMutationInput,
      CostItemUncheckedUpdateManyWithoutCostItemsInput
    >;
  };

  export type CostItemScalarWhereInput = {
    AND?: Enumerable<CostItemScalarWhereInput>;
    OR?: Enumerable<CostItemScalarWhereInput>;
    NOT?: Enumerable<CostItemScalarWhereInput>;
    id?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    eventId?: StringFilter | string;
    name?: StringFilter | string;
    ammount?: DecimalFilter | Decimal | number | string;
  };

  export type PhotoShareUpsertWithoutEventInput = {
    update: XOR<
      PhotoShareUpdateWithoutEventInput,
      PhotoShareUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      PhotoShareCreateWithoutEventInput,
      PhotoShareUncheckedCreateWithoutEventInput
    >;
  };

  export type PhotoShareUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PhotoShareUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventOrganizerUpsertWithoutEventsInput = {
    update: XOR<
      EventOrganizerUpdateWithoutEventsInput,
      EventOrganizerUncheckedUpdateWithoutEventsInput
    >;
    create: XOR<
      EventOrganizerCreateWithoutEventsInput,
      EventOrganizerUncheckedCreateWithoutEventsInput
    >;
  };

  export type EventOrganizerUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
    tenant?: TenantUpdateOneRequiredWithoutOrganizersInput;
  };

  export type EventOrganizerUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type UserUpsertWithoutCreatedEventsInput = {
    update: XOR<
      UserUpdateWithoutCreatedEventsInput,
      UserUncheckedUpdateWithoutCreatedEventsInput
    >;
    create: XOR<
      UserCreateWithoutCreatedEventsInput,
      UserUncheckedCreateWithoutCreatedEventsInput
    >;
  };

  export type UserUpdateWithoutCreatedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUpdateManyWithoutUserInput;
    receipts?: ReceiptUpdateManyWithoutUserInput;
  };

  export type UserUncheckedUpdateWithoutCreatedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUncheckedUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedUpdateManyWithoutUserInput;
    receipts?: ReceiptUncheckedUpdateManyWithoutUserInput;
  };

  export type EventTemplateUpsertWithoutEventInstancesInput = {
    update: XOR<
      EventTemplateUpdateWithoutEventInstancesInput,
      EventTemplateUncheckedUpdateWithoutEventInstancesInput
    >;
    create: XOR<
      EventTemplateCreateWithoutEventInstancesInput,
      EventTemplateUncheckedCreateWithoutEventInstancesInput
    >;
  };

  export type EventTemplateUpdateWithoutEventInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    tenant?: TenantUpdateOneRequiredWithoutEventTemplatesInput;
  };

  export type EventTemplateUncheckedUpdateWithoutEventInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type TumiEventCreateWithoutCostItemsInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateWithoutCostItemsInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutCostItemsInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutCostItemsInput,
      TumiEventUncheckedCreateWithoutCostItemsInput
    >;
  };

  export type ReceiptCreateWithoutCostItemInput = {
    id?: string;
    createdAt?: Date | string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
    user: UserCreateNestedOneWithoutReceiptsInput;
  };

  export type ReceiptUncheckedCreateWithoutCostItemInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
  };

  export type ReceiptCreateOrConnectWithoutCostItemInput = {
    where: ReceiptWhereUniqueInput;
    create: XOR<
      ReceiptCreateWithoutCostItemInput,
      ReceiptUncheckedCreateWithoutCostItemInput
    >;
  };

  export type ReceiptCreateManyCostItemInputEnvelope = {
    data: Enumerable<ReceiptCreateManyCostItemInput>;
    skipDuplicates?: boolean;
  };

  export type TumiEventUpsertWithoutCostItemsInput = {
    update: XOR<
      TumiEventUpdateWithoutCostItemsInput,
      TumiEventUncheckedUpdateWithoutCostItemsInput
    >;
    create: XOR<
      TumiEventCreateWithoutCostItemsInput,
      TumiEventUncheckedCreateWithoutCostItemsInput
    >;
  };

  export type TumiEventUpdateWithoutCostItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateWithoutCostItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type ReceiptUpsertWithWhereUniqueWithoutCostItemInput = {
    where: ReceiptWhereUniqueInput;
    update: XOR<
      ReceiptUpdateWithoutCostItemInput,
      ReceiptUncheckedUpdateWithoutCostItemInput
    >;
    create: XOR<
      ReceiptCreateWithoutCostItemInput,
      ReceiptUncheckedCreateWithoutCostItemInput
    >;
  };

  export type ReceiptUpdateWithWhereUniqueWithoutCostItemInput = {
    where: ReceiptWhereUniqueInput;
    data: XOR<
      ReceiptUpdateWithoutCostItemInput,
      ReceiptUncheckedUpdateWithoutCostItemInput
    >;
  };

  export type ReceiptUpdateManyWithWhereWithoutCostItemInput = {
    where: ReceiptScalarWhereInput;
    data: XOR<
      ReceiptUpdateManyMutationInput,
      ReceiptUncheckedUpdateManyWithoutReceiptsInput
    >;
  };

  export type UserCreateWithoutReceiptsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventCreateNestedManyWithoutCreatedByInput;
  };

  export type UserUncheckedCreateWithoutReceiptsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsUncheckedCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedCreateNestedManyWithoutCreatedByInput;
  };

  export type UserCreateOrConnectWithoutReceiptsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutReceiptsInput,
      UserUncheckedCreateWithoutReceiptsInput
    >;
  };

  export type CostItemCreateWithoutReceiptsInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    ammount: Decimal | number | string;
    event: TumiEventCreateNestedOneWithoutCostItemsInput;
  };

  export type CostItemUncheckedCreateWithoutReceiptsInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
    name: string;
    ammount: Decimal | number | string;
  };

  export type CostItemCreateOrConnectWithoutReceiptsInput = {
    where: CostItemWhereUniqueInput;
    create: XOR<
      CostItemCreateWithoutReceiptsInput,
      CostItemUncheckedCreateWithoutReceiptsInput
    >;
  };

  export type UserUpsertWithoutReceiptsInput = {
    update: XOR<
      UserUpdateWithoutReceiptsInput,
      UserUncheckedUpdateWithoutReceiptsInput
    >;
    create: XOR<
      UserCreateWithoutReceiptsInput,
      UserUncheckedCreateWithoutReceiptsInput
    >;
  };

  export type UserUpdateWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUpdateManyWithoutCreatedByInput;
  };

  export type UserUncheckedUpdateWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUncheckedUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedUpdateManyWithoutCreatedByInput;
  };

  export type CostItemUpsertWithoutReceiptsInput = {
    update: XOR<
      CostItemUpdateWithoutReceiptsInput,
      CostItemUncheckedUpdateWithoutReceiptsInput
    >;
    create: XOR<
      CostItemCreateWithoutReceiptsInput,
      CostItemUncheckedCreateWithoutReceiptsInput
    >;
  };

  export type CostItemUpdateWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    event?: TumiEventUpdateOneRequiredWithoutCostItemsInput;
  };

  export type CostItemUncheckedUpdateWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
  };

  export type TumiEventCreateWithoutPhotoShareInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateWithoutPhotoShareInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutPhotoShareInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutPhotoShareInput,
      TumiEventUncheckedCreateWithoutPhotoShareInput
    >;
  };

  export type TumiEventUpsertWithoutPhotoShareInput = {
    update: XOR<
      TumiEventUpdateWithoutPhotoShareInput,
      TumiEventUncheckedUpdateWithoutPhotoShareInput
    >;
    create: XOR<
      TumiEventCreateWithoutPhotoShareInput,
      TumiEventUncheckedCreateWithoutPhotoShareInput
    >;
  };

  export type TumiEventUpdateWithoutPhotoShareInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateWithoutPhotoShareInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
  };

  export type UserCreateWithoutEventRegistrationsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionCreateNestedManyWithoutUserInput;
    receipts?: ReceiptCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventCreateNestedManyWithoutCreatedByInput;
  };

  export type UserUncheckedCreateWithoutEventRegistrationsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsUncheckedCreateNestedManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedCreateNestedManyWithoutUserInput;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedCreateNestedManyWithoutCreatedByInput;
  };

  export type UserCreateOrConnectWithoutEventRegistrationsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutEventRegistrationsInput,
      UserUncheckedCreateWithoutEventRegistrationsInput
    >;
  };

  export type TumiEventCreateWithoutRegistrationsInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateWithoutRegistrationsInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutRegistrationsInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutRegistrationsInput,
      TumiEventUncheckedCreateWithoutRegistrationsInput
    >;
  };

  export type UserUpsertWithoutEventRegistrationsInput = {
    update: XOR<
      UserUpdateWithoutEventRegistrationsInput,
      UserUncheckedUpdateWithoutEventRegistrationsInput
    >;
    create: XOR<
      UserCreateWithoutEventRegistrationsInput,
      UserUncheckedCreateWithoutEventRegistrationsInput
    >;
  };

  export type UserUpdateWithoutEventRegistrationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUpdateManyWithoutUserInput;
    receipts?: ReceiptUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUpdateManyWithoutCreatedByInput;
  };

  export type UserUncheckedUpdateWithoutEventRegistrationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUncheckedUpdateManyWithoutUserInput;
    eventSubmissions?: EventSubmissionUncheckedUpdateManyWithoutUserInput;
    receipts?: ReceiptUncheckedUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedUpdateManyWithoutCreatedByInput;
  };

  export type TumiEventUpsertWithoutRegistrationsInput = {
    update: XOR<
      TumiEventUpdateWithoutRegistrationsInput,
      TumiEventUncheckedUpdateWithoutRegistrationsInput
    >;
    create: XOR<
      TumiEventCreateWithoutRegistrationsInput,
      TumiEventUncheckedCreateWithoutRegistrationsInput
    >;
  };

  export type TumiEventUpdateWithoutRegistrationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateWithoutRegistrationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type TumiEventCreateWithoutSubmissionItemsInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    registrations?: EventRegistrationCreateNestedManyWithoutEventInput;
    costItems?: CostItemCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareCreateNestedOneWithoutEventInput;
    organizer: EventOrganizerCreateNestedOneWithoutEventsInput;
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput;
    eventTemplate: EventTemplateCreateNestedOneWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedCreateWithoutSubmissionItemsInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    registrations?: EventRegistrationUncheckedCreateNestedManyWithoutEventInput;
    costItems?: CostItemUncheckedCreateNestedManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedCreateNestedOneWithoutEventInput;
  };

  export type TumiEventCreateOrConnectWithoutSubmissionItemsInput = {
    where: TumiEventWhereUniqueInput;
    create: XOR<
      TumiEventCreateWithoutSubmissionItemsInput,
      TumiEventUncheckedCreateWithoutSubmissionItemsInput
    >;
  };

  export type EventSubmissionCreateWithoutSubmissionItemInput = {
    id?: string;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutEventSubmissionsInput;
  };

  export type EventSubmissionUncheckedCreateWithoutSubmissionItemInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
  };

  export type EventSubmissionCreateOrConnectWithoutSubmissionItemInput = {
    where: EventSubmissionWhereUniqueInput;
    create: XOR<
      EventSubmissionCreateWithoutSubmissionItemInput,
      EventSubmissionUncheckedCreateWithoutSubmissionItemInput
    >;
  };

  export type EventSubmissionCreateManySubmissionItemInputEnvelope = {
    data: Enumerable<EventSubmissionCreateManySubmissionItemInput>;
    skipDuplicates?: boolean;
  };

  export type TumiEventUpsertWithoutSubmissionItemsInput = {
    update: XOR<
      TumiEventUpdateWithoutSubmissionItemsInput,
      TumiEventUncheckedUpdateWithoutSubmissionItemsInput
    >;
    create: XOR<
      TumiEventCreateWithoutSubmissionItemsInput,
      TumiEventUncheckedCreateWithoutSubmissionItemsInput
    >;
  };

  export type TumiEventUpdateWithoutSubmissionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateWithoutSubmissionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type EventSubmissionUpsertWithWhereUniqueWithoutSubmissionItemInput = {
    where: EventSubmissionWhereUniqueInput;
    update: XOR<
      EventSubmissionUpdateWithoutSubmissionItemInput,
      EventSubmissionUncheckedUpdateWithoutSubmissionItemInput
    >;
    create: XOR<
      EventSubmissionCreateWithoutSubmissionItemInput,
      EventSubmissionUncheckedCreateWithoutSubmissionItemInput
    >;
  };

  export type EventSubmissionUpdateWithWhereUniqueWithoutSubmissionItemInput = {
    where: EventSubmissionWhereUniqueInput;
    data: XOR<
      EventSubmissionUpdateWithoutSubmissionItemInput,
      EventSubmissionUncheckedUpdateWithoutSubmissionItemInput
    >;
  };

  export type EventSubmissionUpdateManyWithWhereWithoutSubmissionItemInput = {
    where: EventSubmissionScalarWhereInput;
    data: XOR<
      EventSubmissionUpdateManyMutationInput,
      EventSubmissionUncheckedUpdateManyWithoutSubmissionsInput
    >;
  };

  export type UserCreateWithoutEventSubmissionsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationCreateNestedManyWithoutUserInput;
    receipts?: ReceiptCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventCreateNestedManyWithoutCreatedByInput;
  };

  export type UserUncheckedCreateWithoutEventSubmissionsInput = {
    id?: string;
    createdAt?: Date | string;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified: boolean;
    picture: string;
    birthdate: Date | string;
    tenants?: UsersOfTenantsUncheckedCreateNestedManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedCreateNestedManyWithoutUserInput;
    receipts?: ReceiptUncheckedCreateNestedManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedCreateNestedManyWithoutCreatedByInput;
  };

  export type UserCreateOrConnectWithoutEventSubmissionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutEventSubmissionsInput,
      UserUncheckedCreateWithoutEventSubmissionsInput
    >;
  };

  export type EventSubmissionItemCreateWithoutSubmissionsInput = {
    id?: string;
    createdAt?: Date | string;
    required: boolean;
    submissionTime: SubmissionTime;
    event: TumiEventCreateNestedOneWithoutSubmissionItemsInput;
  };

  export type EventSubmissionItemUncheckedCreateWithoutSubmissionsInput = {
    id?: string;
    createdAt?: Date | string;
    eventId: string;
    required: boolean;
    submissionTime: SubmissionTime;
  };

  export type EventSubmissionItemCreateOrConnectWithoutSubmissionsInput = {
    where: EventSubmissionItemWhereUniqueInput;
    create: XOR<
      EventSubmissionItemCreateWithoutSubmissionsInput,
      EventSubmissionItemUncheckedCreateWithoutSubmissionsInput
    >;
  };

  export type UserUpsertWithoutEventSubmissionsInput = {
    update: XOR<
      UserUpdateWithoutEventSubmissionsInput,
      UserUncheckedUpdateWithoutEventSubmissionsInput
    >;
    create: XOR<
      UserCreateWithoutEventSubmissionsInput,
      UserUncheckedCreateWithoutEventSubmissionsInput
    >;
  };

  export type UserUpdateWithoutEventSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUpdateManyWithoutUserInput;
    receipts?: ReceiptUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUpdateManyWithoutCreatedByInput;
  };

  export type UserUncheckedUpdateWithoutEventSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    authId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    lastName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    email_verified?: BoolFieldUpdateOperationsInput | boolean;
    picture?: StringFieldUpdateOperationsInput | string;
    birthdate?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenants?: UsersOfTenantsUncheckedUpdateManyWithoutUserInput;
    eventRegistrations?: EventRegistrationUncheckedUpdateManyWithoutUserInput;
    receipts?: ReceiptUncheckedUpdateManyWithoutUserInput;
    createdEvents?: TumiEventUncheckedUpdateManyWithoutCreatedByInput;
  };

  export type EventSubmissionItemUpsertWithoutSubmissionsInput = {
    update: XOR<
      EventSubmissionItemUpdateWithoutSubmissionsInput,
      EventSubmissionItemUncheckedUpdateWithoutSubmissionsInput
    >;
    create: XOR<
      EventSubmissionItemCreateWithoutSubmissionsInput,
      EventSubmissionItemUncheckedCreateWithoutSubmissionsInput
    >;
  };

  export type EventSubmissionItemUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
    event?: TumiEventUpdateOneRequiredWithoutSubmissionItemsInput;
  };

  export type EventSubmissionItemUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
  };

  export type UsersOfTenantsCreateManyTenantInput = {
    createdAt?: Date | string;
    userId: string;
    role?: Role;
    status?: MembershipStatus;
  };

  export type EventTemplateCreateManyTenantInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    description: string;
    comment: string;
    location: string;
    locationId: string;
    duration: Decimal | number | string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    finances: JsonNullValueInput | InputJsonValue;
  };

  export type EventOrganizerCreateManyTenantInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    text: string;
    link?: string | null;
  };

  export type UsersOfTenantsUpdateWithoutTenantInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
    user?: UserUpdateOneRequiredWithoutTenantsInput;
  };

  export type UsersOfTenantsUncheckedUpdateWithoutTenantInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type UsersOfTenantsUncheckedUpdateManyWithoutUsersInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type EventTemplateUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    eventInstances?: TumiEventUpdateManyWithoutEventTemplateInput;
  };

  export type EventTemplateUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
    eventInstances?: TumiEventUncheckedUpdateManyWithoutEventTemplateInput;
  };

  export type EventTemplateUncheckedUpdateManyWithoutEventTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    comment?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    duration?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    finances?: JsonNullValueInput | InputJsonValue;
  };

  export type EventOrganizerUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
    events?: TumiEventUpdateManyWithoutOrganizerInput;
  };

  export type EventOrganizerUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
    events?: TumiEventUncheckedUpdateManyWithoutOrganizerInput;
  };

  export type EventOrganizerUncheckedUpdateManyWithoutOrganizersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    text?: StringFieldUpdateOperationsInput | string;
    link?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type UsersOfTenantsCreateManyUserInput = {
    createdAt?: Date | string;
    tenantId: string;
    role?: Role;
    status?: MembershipStatus;
  };

  export type EventSubmissionCreateManyUserInput = {
    id?: string;
    createdAt?: Date | string;
    submissionItemId: string;
  };

  export type EventRegistrationCreateManyUserInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    eventId: string;
  };

  export type ReceiptCreateManyUserInput = {
    id?: string;
    createdAt?: Date | string;
    costItemId: string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
  };

  export type TumiEventCreateManyCreatedByInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateManyparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateManyorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type UsersOfTenantsUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
    tenant?: TenantUpdateOneRequiredWithoutUsersInput;
  };

  export type UsersOfTenantsUncheckedUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type UsersOfTenantsUncheckedUpdateManyWithoutTenantsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    role?: EnumRoleFieldUpdateOperationsInput | Role;
    status?: EnumMembershipStatusFieldUpdateOperationsInput | MembershipStatus;
  };

  export type EventSubmissionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    submissionItem?: EventSubmissionItemUpdateOneRequiredWithoutSubmissionsInput;
  };

  export type EventSubmissionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    submissionItemId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventSubmissionUncheckedUpdateManyWithoutEventSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    submissionItemId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventRegistrationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    event?: TumiEventUpdateOneRequiredWithoutRegistrationsInput;
  };

  export type EventRegistrationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    eventId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventRegistrationUncheckedUpdateManyWithoutEventRegistrationsInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
      eventId?: StringFieldUpdateOperationsInput | string;
    };

  export type ReceiptUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
    costItem?: CostItemUpdateOneRequiredWithoutReceiptsInput;
  };

  export type ReceiptUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    costItemId?: StringFieldUpdateOperationsInput | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
  };

  export type ReceiptUncheckedUpdateManyWithoutReceiptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    costItemId?: StringFieldUpdateOperationsInput | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
  };

  export type TumiEventUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type TumiEventUncheckedUpdateManyWithoutCreatedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type TumiEventCreateManyOrganizerInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    creatorId: string;
    eventTemplateId: string;
    participantSignup?:
      | TumiEventCreateManyparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateManyorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type TumiEventUpdateWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
    eventTemplate?: EventTemplateUpdateOneRequiredWithoutEventInstancesInput;
  };

  export type TumiEventUncheckedUpdateWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type TumiEventUncheckedUpdateManyWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    creatorId?: StringFieldUpdateOperationsInput | string;
    eventTemplateId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type TumiEventCreateManyEventTemplateInput = {
    id?: string;
    createdAt?: Date | string;
    title: string;
    icon: string;
    start: Date | string;
    end: Date | string;
    description: string;
    location: string;
    locationId: string;
    participantText: string;
    participantMail: string;
    organizerText: string;
    participantLimit: number;
    organizerLimit: number;
    price?: Decimal | number | string | null;
    registrationLink?: string | null;
    registrationMode: RegistrationMode;
    publicationState?: PublicationState;
    eventOrganizerId: string;
    creatorId: string;
    participantSignup?:
      | TumiEventCreateManyparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventCreateManyorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type TumiEventUpdateWithoutEventTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUpdateManyWithoutEventInput;
    costItems?: CostItemUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUpdateOneWithoutEventInput;
    organizer?: EventOrganizerUpdateOneRequiredWithoutEventsInput;
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsInput;
  };

  export type TumiEventUncheckedUpdateWithoutEventTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
    submissionItems?: EventSubmissionItemUncheckedUpdateManyWithoutEventInput;
    registrations?: EventRegistrationUncheckedUpdateManyWithoutEventInput;
    costItems?: CostItemUncheckedUpdateManyWithoutEventInput;
    photoShare?: PhotoShareUncheckedUpdateOneWithoutEventInput;
  };

  export type TumiEventUncheckedUpdateManyWithoutEventInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    title?: StringFieldUpdateOperationsInput | string;
    icon?: StringFieldUpdateOperationsInput | string;
    start?: DateTimeFieldUpdateOperationsInput | Date | string;
    end?: DateTimeFieldUpdateOperationsInput | Date | string;
    description?: StringFieldUpdateOperationsInput | string;
    location?: StringFieldUpdateOperationsInput | string;
    locationId?: StringFieldUpdateOperationsInput | string;
    participantText?: StringFieldUpdateOperationsInput | string;
    participantMail?: StringFieldUpdateOperationsInput | string;
    organizerText?: StringFieldUpdateOperationsInput | string;
    participantLimit?: IntFieldUpdateOperationsInput | number;
    organizerLimit?: IntFieldUpdateOperationsInput | number;
    price?:
      | NullableDecimalFieldUpdateOperationsInput
      | Decimal
      | number
      | string
      | null;
    registrationLink?: NullableStringFieldUpdateOperationsInput | string | null;
    registrationMode?:
      | EnumRegistrationModeFieldUpdateOperationsInput
      | RegistrationMode;
    publicationState?:
      | EnumPublicationStateFieldUpdateOperationsInput
      | PublicationState;
    eventOrganizerId?: StringFieldUpdateOperationsInput | string;
    creatorId?: StringFieldUpdateOperationsInput | string;
    participantSignup?:
      | TumiEventUpdateparticipantSignupInput
      | Enumerable<MembershipStatus>;
    organizerSignup?:
      | TumiEventUpdateorganizerSignupInput
      | Enumerable<MembershipStatus>;
  };

  export type EventSubmissionItemCreateManyEventInput = {
    id?: string;
    createdAt?: Date | string;
    required: boolean;
    submissionTime: SubmissionTime;
  };

  export type EventRegistrationCreateManyEventInput = {
    id?: string;
    createdAt?: Date | string;
    type?: RegistrationType;
    userId: string;
  };

  export type CostItemCreateManyEventInput = {
    id?: string;
    createdAt?: Date | string;
    name: string;
    ammount: Decimal | number | string;
  };

  export type EventSubmissionItemUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
    submissions?: EventSubmissionUpdateManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    required?: BoolFieldUpdateOperationsInput | boolean;
    submissionTime?:
      | EnumSubmissionTimeFieldUpdateOperationsInput
      | SubmissionTime;
    submissions?: EventSubmissionUncheckedUpdateManyWithoutSubmissionItemInput;
  };

  export type EventSubmissionItemUncheckedUpdateManyWithoutSubmissionItemsInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      required?: BoolFieldUpdateOperationsInput | boolean;
      submissionTime?:
        | EnumSubmissionTimeFieldUpdateOperationsInput
        | SubmissionTime;
    };

  export type EventRegistrationUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    user?: UserUpdateOneRequiredWithoutEventRegistrationsInput;
  };

  export type EventRegistrationUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventRegistrationUncheckedUpdateManyWithoutRegistrationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    type?: EnumRegistrationTypeFieldUpdateOperationsInput | RegistrationType;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type CostItemUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    receipts?: ReceiptUpdateManyWithoutCostItemInput;
  };

  export type CostItemUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
    receipts?: ReceiptUncheckedUpdateManyWithoutCostItemInput;
  };

  export type CostItemUncheckedUpdateManyWithoutCostItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    name?: StringFieldUpdateOperationsInput | string;
    ammount?: DecimalFieldUpdateOperationsInput | Decimal | number | string;
  };

  export type ReceiptCreateManyCostItemInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
    covered?: boolean;
    amount: number;
    date: Date | string;
    amountCovered: number;
  };

  export type ReceiptUpdateWithoutCostItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
    user?: UserUpdateOneRequiredWithoutReceiptsInput;
  };

  export type ReceiptUncheckedUpdateWithoutCostItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    covered?: BoolFieldUpdateOperationsInput | boolean;
    amount?: IntFieldUpdateOperationsInput | number;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    amountCovered?: IntFieldUpdateOperationsInput | number;
  };

  export type EventSubmissionCreateManySubmissionItemInput = {
    id?: string;
    createdAt?: Date | string;
    userId: string;
  };

  export type EventSubmissionUpdateWithoutSubmissionItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutEventSubmissionsInput;
  };

  export type EventSubmissionUncheckedUpdateWithoutSubmissionItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type EventSubmissionUncheckedUpdateManyWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}
