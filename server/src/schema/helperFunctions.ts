import { builder } from '../builder';

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export const dateRangeInputType = builder.inputType('DateRangeInput', {
  fields: (t) => ({
    start: t.field({ type: 'DateTime', required: false }),
    end: t.field({ type: 'DateTime', required: false }),
  }),
});

export const prepareSearchString = (search) => {
  if (search) {
    let res = search.replace(new RegExp(/(?<=[a-z]) (?=[a-z])/gi), '+');
    if (!res.includes(' ')) {
      res += ':*';
    }
    res = res.replace(new RegExp(/ *[\|\&] *$/gi), '');
    return res;
  }
  return search;
};
