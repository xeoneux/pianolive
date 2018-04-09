export const getRandomName = () => {
  const male = [
    'Boy',
    'Man',
    'Man',
    'Man',
    'Man',
    'Guy',
    'Mr.',
    'Doctor',
    'El',
    'Professor',
    'Captain',
    'Agent',
    'The',
    'The',
    'The',
    'The',
    'Lord',
    'Sgt.',
    'General',
    '',
    '',
    '',
    '',
    ''
  ];
  const female = [
    'Girl',
    'Woman',
    'Woman',
    'Woman',
    'Woman',
    'Gal',
    'Maid',
    'Princess',
    'Miss',
    'Doctor',
    'Professor',
    'Captain',
    'Agent',
    'The',
    'The',
    'The',
    'Sgt.',
    'General',
    '',
    '',
    '',
    '',
    ''
  ];
  const adjective = [
    'Imperial',
    'Amazing',
    'Spectular',
    'Dino',
    'Massive',
    'Fantastic',
    'Wonder',
    'Techno',
    'Electro',
    'Hydro',
    'Giant',
    'Super',
    'Incredi',
    'Daring',
    'Mega',
    'Tiny',
    'Red',
    'Dark',
    'Orange',
    'Screaming',
    'Green',
    'Teal',
    'Blue',
    'Golden',
    'Fearless',
    'Great',
    'Ameri',
    'Pyro',
    'Robo',
    'American',
    'Cyber',
    'Frozen'
  ];
  const noun = [
    'Spider',
    'Laser',
    'Microbe',
    'Spectre',
    'Scan',
    'Badger',
    'Lighting',
    'Thunder',
    'Eagle',
    'Hurricane',
    'Storm',
    'Typhoon',
    'Fire',
    'Flame',
    'Flash',
    'Night',
    'Whirlwind',
    'Wind',
    'Dawn',
    'Light',
    'Dragon',
    'Wolf',
    'Vemon',
    'Cobra',
    'Viper',
    'Condor',
    'Stalker',
    'Panther',
    'Puma',
    'Shadow',
    'Freeze',
    'Night',
    'Hammer',
    'Mist',
    'Tulip',
    'Octopus',
    'Inferno',
    'Magma',
    'Patriot',
    'Stag',
    'Rhino',
    'Mole',
    'Sloth'
  ];

  const gender = Math.random() < 0.5 ? male : female;
  const randomNumber = Math.floor(Math.random() * gender.length);
  const randomPrefix = gender[randomNumber];
  const randomAdjective =
    adjective[Math.floor(Math.random() * adjective.length)];
  var randomNoun = noun[Math.floor(Math.random() * noun.length)];
  if (randomNumber <= 5) {
    return randomAdjective + ' ' + randomNoun + ' ' + randomPrefix;
  } else {
    return randomPrefix + ' ' + randomAdjective + ' ' + randomNoun;
  }
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const hexToRgb = hex => {
  var bigint = parseInt(hex.slice(1, 7), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return r + ',' + g + ',' + b;
};
