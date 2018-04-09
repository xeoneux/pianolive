const mapping = {
  z: 'c',
  s: 'cs',
  x: 'd',
  d: 'ds',
  c: 'e',
  v: 'f',
  g: 'fs',
  b: 'g',
  h: 'gs',
  n: 'a',
  j: 'as',
  m: 'b'
};

export const getKeyForNote = note =>
  Object.keys(mapping)
    .find(key => mapping[key] === note.toLowerCase())
    .toUpperCase();

export const getNoteForKey = key => mapping[key.toLowerCase()];
