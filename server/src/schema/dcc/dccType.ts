import { builder } from '../../builder';

const dccCard = builder.simpleObject('DCCCard', {
  fields: (t) => ({
    format: t.string(),
    type: t.string(),
    pub_key: t.string(),
    signature: t.string(),
    scanDate: t.field({ type: 'DateTime' }),
    verified: t.string(),
    rawQR: t.string(),
    cert: t.field({ type: 'JSON' }),
    name: t.string(),
    test: t.field({ type: 'JSON', nullable: true }),
    vaccination: t.field({ type: 'JSON', nullable: true }),
    recovery: t.field({ type: 'JSON', nullable: true }),
  }),
});

export const dccType = builder.simpleObject('DCC', {
  fields: (t) => ({
    status: t.string(),
    card: t.field({
      type: dccCard,
      nullable: true,
    }),
  }),
});
