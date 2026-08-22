(() => {
  'use strict';

  const content = {
    '0-2': {
      icon:'☀️', title:'Together Memory Peek', subject:'Early learning', mode:'guided',
      instruction:'Grown-up: take turns turning over two big cards and naming what you see. There is no timer and no score.',
      objective:'Share attention, notice familiar pictures and practise simple same-picture matching with an adult.',
      pairs:[
        ['sun',{icon:'☀️',label:'Sun'},{icon:'☀️',label:'Sun'}],
        ['moon',{icon:'🌙',label:'Moon'},{icon:'🌙',label:'Moon'}]
      ]
    },
    '2-4': {
      icon:'🐝', title:'Little Picture Pairs', subject:'Early learning', mode:'supported',
      instruction:'Turn over two cards. Can you find the two pictures that belong together? No timer.',
      objective:'Practise visual memory, turn-taking and matching familiar pictures.',
      pairs:[
        ['bee',{icon:'🐝',label:'Bee'},{icon:'🐝',label:'Bee'}],
        ['apple',{icon:'🍎',label:'Apple'},{icon:'🍎',label:'Apple'}],
        ['star',{icon:'⭐',label:'Star'},{icon:'⭐',label:'Star'}]
      ]
    },
    '4-6': {
      icon:'🔢', title:'Number Match Memory', subject:'Mathematics', mode:'independent',
      instruction:'Match each number card to the card showing the same quantity. Take as many turns as you need.',
      objective:'Connect numerals to quantities while using working memory and visual attention.',
      pairs:[
        ['one',{icon:'1️⃣',label:'Number 1'},{icon:'●',label:'One dot'}],
        ['two',{icon:'2️⃣',label:'Number 2'},{icon:'● ●',label:'Two dots'}],
        ['three',{icon:'3️⃣',label:'Number 3'},{icon:'● ● ●',label:'Three dots'}],
        ['four',{icon:'4️⃣',label:'Number 4'},{icon:'● ●\n● ●',label:'Four dots'}]
      ]
    },
    '7-9': {
      icon:'🪐', title:'Space Fact Match', subject:'Science', mode:'independent',
      instruction:'Match each space object to the fact that describes it. Use memory and science clues — there is no countdown.',
      objective:'Recall Solar System facts and use semantic matching alongside working memory.',
      pairs:[
        ['sun',{icon:'☀️',label:'Sun'},{icon:'✨',label:'Star at the centre of our Solar System'}],
        ['earth',{icon:'🌍',label:'Earth'},{icon:'🏠',label:'Our home planet'}],
        ['moon',{icon:'🌙',label:'Moon'},{icon:'↪️',label:'Natural satellite that orbits Earth'}],
        ['mars',{icon:'🔴',label:'Mars'},{icon:'🪨',label:'Rocky planet often called the Red Planet'}],
        ['jupiter',{icon:'🟤',label:'Jupiter'},{icon:'📏',label:'Largest planet in our Solar System'}],
        ['saturn',{icon:'🪐',label:'Saturn'},{icon:'💍',label:'Planet famous for its ring system'}]
      ]
    },
    '10-12': {
      icon:'🫀', title:'Body Systems Memory Lab', subject:'Science', mode:'independent',
      instruction:'Match each organ or structure to the body system or function it belongs with. No speed score.',
      objective:'Connect anatomical structures with functions and systems while practising retrieval and working memory.',
      pairs:[
        ['heart',{icon:'🫀',label:'Heart'},{icon:'🩸',label:'Pumps blood through the circulatory system'}],
        ['lungs',{icon:'🫁',label:'Lungs'},{icon:'💨',label:'Exchange oxygen and carbon dioxide'}],
        ['brain',{icon:'🧠',label:'Brain'},{icon:'⚡',label:'Processes information in the nervous system'}],
        ['stomach',{icon:'🥣',label:'Stomach'},{icon:'🍽️',label:'Helps break down food in digestion'}],
        ['bones',{icon:'🦴',label:'Bones'},{icon:'🏗️',label:'Support and protect the body'}],
        ['muscles',{icon:'💪',label:'Muscles'},{icon:'↔️',label:'Contract to help create movement'}]
      ]
    },
    '13-16': {
      icon:'🔬', title:'Scientific Reasoning Match', subject:'Science', mode:'independent',
      instruction:'Match each investigation term to its most accurate meaning. The challenge tests concepts and memory, not speed.',
      objective:'Distinguish core experimental-design and evidence terms using precise scientific reasoning.',
      pairs:[
        ['iv',{icon:'△',label:'Independent variable'},{icon:'🛠️',label:'Factor deliberately changed by the investigator'}],
        ['dv',{icon:'▽',label:'Dependent variable'},{icon:'📏',label:'Outcome measured or observed'}],
        ['cv',{icon:'＝',label:'Control variable'},{icon:'🔒',label:'Factor kept consistent for a fair comparison'}],
        ['observation',{icon:'👁️',label:'Observation'},{icon:'📝',label:'What is directly noticed or measured'}],
        ['inference',{icon:'🧩',label:'Inference'},{icon:'💭',label:'Interpretation drawn from observations or evidence'}],
        ['hypothesis',{icon:'❓',label:'Hypothesis'},{icon:'🧪',label:'Testable proposed explanation or prediction'}],
        ['correlation',{icon:'📈',label:'Correlation'},{icon:'🔗',label:'Two variables vary together without proving cause'}],
        ['causation',{icon:'➡️',label:'Causation'},{icon:'🎯',label:'Evidence supports one factor producing a change in another'}]
      ]
    }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function get(ageBand) {
    const game = content[ageBand] || content['7-9'];
    return { ageBand, ...clone(game) };
  }

  function makeDeck(ageBand) {
    const game = get(ageBand);
    const deck = [];
    game.pairs.forEach(([pairId, a, b], pairIndex) => {
      deck.push({ id:`${pairId}-a`, pairId, pairIndex, icon:a.icon, label:a.label });
      deck.push({ id:`${pairId}-b`, pairId, pairIndex, icon:b.icon, label:b.label });
    });
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return { ...game, deck };
  }

  window.OrishMemoryGame = { get, makeDeck, ageBands:Object.keys(content) };
})();
