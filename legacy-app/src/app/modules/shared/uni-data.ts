const types = {
  E: 'International exchange student',
  D: 'International degree seeking student',
  L: 'German student',
  P: 'Phd student',
};

export const allTypes = Object.keys(types).map((key) => {
  // @ts-ignore
  return { key, value: types[key] };
});

export const getType = (key: 'E' | 'D' | 'L' | 'P') => types[key] || '';
