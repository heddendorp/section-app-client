const faculties = {
  MN1: 'Mathematics',
  MN2: 'Physics',
  MN3: 'Chemistry',
  EA1: 'Aerospace and Geodesy',
  EA2: 'Civil, Geo and Environmental Engineering',
  EA3: 'Architecture',
  EA4: 'Mechanical Engineering',
  EA5: 'Electrical and Computer Engineering',
  EA6: 'Informatics',
  LH1: 'School of Life Sciences Weihenstephan',
  LH2: 'School of Medicine',
  LH3: 'Sport and Health Sciences',
  SS1: 'School of Education',
  SS2: 'School of Governance',
  SS3: 'School of Management'
};

export const allFaculties = Object.keys(faculties).map(key => {
  return { key, value: faculties[key] };
});

export const getFaculty = key => faculties[key] || '';

const targets = {
  BA: 'Bachelor',
  MA: 'Master'
};

export const allTargets = Object.keys(targets).map(key => {
  return { key, value: targets[key] };
});

export const getTarget = key => targets[key] || '';

const types = {
  E: 'Exchange',
  D: 'Degree',
  L: 'Local'
};

export const allTypes = Object.keys(types).map(key => {
  return { key, value: types[key] };
});

export const getType = key => types[key] || '';
