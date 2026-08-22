(() => {
  'use strict';

  const games = {
    '0-2': {
      id:'visual-together', icon:'👀', title:'Look & Place Together', mode:'guided',
      subject:'Early learning', objective:'Notice simple categories and shared attention with an adult.',
      instruction:'Grown-up: tap a big picture, then tap where it belongs. Name it together.',
      zones:[{id:'sky',label:'Up in the sky',icon:'☁️'},{id:'ground',label:'Down on the ground',icon:'🌱'}],
      cards:[
        {id:'sun',label:'Sun',icon:'☀️',zone:'sky'},{id:'bird',label:'Bird',icon:'🐦',zone:'sky'},
        {id:'flower',label:'Flower',icon:'🌼',zone:'ground'},{id:'shoe',label:'Shoe',icon:'👟',zone:'ground'}
      ]
    },
    '2-4': {
      id:'visual-early', icon:'🧺', title:'Sky or Ground Sort', mode:'supported',
      subject:'Understanding the world', objective:'Group familiar objects using a simple visible feature or location.',
      instruction:'Tap or drag each picture into Sky or Ground.',
      zones:[{id:'sky',label:'Sky',icon:'🌤️'},{id:'ground',label:'Ground',icon:'🌿'}],
      cards:[
        {id:'moon',label:'Moon',icon:'🌙',zone:'sky'},{id:'kite',label:'Kite',icon:'🪁',zone:'sky'},
        {id:'tree',label:'Tree',icon:'🌳',zone:'ground'},{id:'boot',label:'Boot',icon:'🥾',zone:'ground'},
        {id:'star',label:'Star',icon:'⭐',zone:'sky'},{id:'snail',label:'Snail',icon:'🐌',zone:'ground'}
      ]
    },
    '4-6': {
      id:'visual-little', icon:'🌍', title:'Earth, Sky or Space?', mode:'supported',
      subject:'Science', objective:'Sort familiar objects by where they are usually found.',
      instruction:'Tap or drag each card into Earth, Sky or Space.',
      zones:[{id:'earth',label:'On Earth',icon:'🌍'},{id:'sky',label:'In our sky',icon:'☁️'},{id:'space',label:'In space',icon:'🪐'}],
      cards:[
        {id:'tree',label:'Tree',icon:'🌳',zone:'earth'},{id:'car',label:'Car',icon:'🚗',zone:'earth'},
        {id:'cloud',label:'Cloud',icon:'☁️',zone:'sky'},{id:'rainbow',label:'Rainbow',icon:'🌈',zone:'sky'},
        {id:'moon',label:'Moon',icon:'🌙',zone:'space'},{id:'satellite',label:'Satellite',icon:'🛰️',zone:'space'}
      ]
    },
    '7-9': {
      id:'visual-growing', icon:'🪐', title:'Space Object Sort', mode:'independent',
      subject:'Science', objective:'Classify stars, planets and moons using defining features.',
      instruction:'Sort each object into Star, Planet or Moon. Tap a card then a zone, or drag it.',
      zones:[{id:'star',label:'Star',icon:'☀️'},{id:'planet',label:'Planet',icon:'🌍'},{id:'moon',label:'Moon',icon:'🌙'}],
      cards:[
        {id:'sun',label:'Sun',icon:'☀️',zone:'star'},{id:'sirius',label:'Sirius',icon:'✨',zone:'star'},
        {id:'earth',label:'Earth',icon:'🌍',zone:'planet'},{id:'saturn',label:'Saturn',icon:'🪐',zone:'planet'},
        {id:'luna',label:'Earth’s Moon',icon:'🌙',zone:'moon'},{id:'europa',label:'Europa',icon:'⚪',zone:'moon'}
      ]
    },
    '10-12': {
      id:'visual-big', icon:'🫀', title:'Body Systems Sort', mode:'independent',
      subject:'Science', objective:'Connect structures and functions to major body systems.',
      instruction:'Sort each card into Circulation, Breathing or Movement.',
      zones:[{id:'circulation',label:'Circulation',icon:'🫀'},{id:'breathing',label:'Breathing',icon:'🫁'},{id:'movement',label:'Movement',icon:'🦴'}],
      cards:[
        {id:'heart',label:'Heart',icon:'❤️',zone:'circulation'},{id:'blood',label:'Blood vessels',icon:'🩸',zone:'circulation'},
        {id:'lungs',label:'Lungs',icon:'🫁',zone:'breathing'},{id:'trachea',label:'Trachea',icon:'〰️',zone:'breathing'},
        {id:'muscle',label:'Skeletal muscle',icon:'💪',zone:'movement'},{id:'bone',label:'Bones',icon:'🦴',zone:'movement'}
      ]
    },
    '13-16': {
      id:'visual-teen', icon:'🔎', title:'Evidence Reasoning Sort', mode:'independent',
      subject:'Science & Critical Thinking', objective:'Distinguish observations, inferences and testable hypotheses.',
      instruction:'Classify each statement by the kind of scientific reasoning it represents.',
      zones:[{id:'observation',label:'Observation',icon:'👁️'},{id:'inference',label:'Inference',icon:'🧠'},{id:'hypothesis',label:'Testable hypothesis',icon:'🧪'}],
      cards:[
        {id:'obs1',label:'The thermometer reads 31 °C.',icon:'🌡️',zone:'observation'},
        {id:'obs2',label:'Three seedlings have yellow leaves.',icon:'🌱',zone:'observation'},
        {id:'inf1',label:'The soil may have dried faster in the warmer location.',icon:'💭',zone:'inference'},
        {id:'inf2',label:'The animal probably visited after the tracks were made.',icon:'🐾',zone:'inference'},
        {id:'hyp1',label:'If light level increases, these seedlings will grow taller over 14 days.',icon:'📈',zone:'hypothesis'},
        {id:'hyp2',label:'If wing area increases while mass stays constant, descent time will increase.',icon:'🪂',zone:'hypothesis'}
      ]
    }
  };

  function get(ageBand){
    const src=games[ageBand] || games['7-9'];
    return JSON.parse(JSON.stringify({...src,ageBand}));
  }

  window.OrishVisualGames={get,games};
})();