/* eslint-disable @typescript-eslint/naming-convention */
const types = {
  E: 'International exchange student',
  D: 'International degree seeking student',
  L: 'German student',
  P: 'Phd student',
};
/* eslint-enable @typescript-eslint/naming-convention */

export const allTypes = Object.keys(types).map((key) =>
  // @ts-ignore
  ({ key, value: types[key] })
);

export const getType = (key: 'E' | 'D' | 'L' | 'P') => types[key] || '';
