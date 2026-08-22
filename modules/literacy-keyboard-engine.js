(() => {
  'use strict';

  const games = {
    '0-2': {
      icon:'📖', title:'First Words Together', subject:'Communication & Language', mode:'guided', input:'choice',
      instruction:'Grown-up: say the word, point to the pictures and let your child look, reach or tap with you. There is no independent typing or score.',
      objective:'Share books and first words with an adult, connect familiar spoken words to pictures and enjoy turn-taking with language.',
      keyboardTip:'No keyboard skill is expected at this age. The grown-up leads the activity.',
      rounds:[
        {prompt:'Can you find the cat?', options:[['🐱','cat'],['⚽','ball'],['🥄','spoon']], answer:0, explanation:'Cat. You can say: “cat — soft cat”.'},
        {prompt:'Can you find the cup?', options:[['🧸','teddy'],['🥤','cup'],['👟','shoe']], answer:1, explanation:'Cup. Try saying the word slowly together.'},
        {prompt:'Where is the moon?', options:[['🌙','moon'],['🍎','apple'],['🚗','car']], answer:0, explanation:'Moon. You might spot the moon again outside or in a book.'}
      ]
    },
    '2-4': {
      icon:'🌱', title:'Sound & Letter Garden', subject:'Early literacy', mode:'supported', input:'choice',
      instruction:'Listen to the word, notice its first sound and choose the matching letter. A grown-up can read every option aloud.',
      objective:'Notice some initial sounds, recognise familiar letters and connect spoken words with print through supported play.',
      keyboardTip:'Letter recognition comes first. Typing is optional and should stay playful.',
      rounds:[
        {prompt:'Sun starts with which letter sound?', cue:'☀️ sun', options:[['S','S'],['M','M'],['B','B']], answer:0, explanation:'Sun starts with /s/ — S.'},
        {prompt:'Moon starts with which letter sound?', cue:'🌙 moon', options:[['T','T'],['M','M'],['P','P']], answer:1, explanation:'Moon starts with /m/ — M.'},
        {prompt:'Ball starts with which letter sound?', cue:'⚽ ball', options:[['D','D'],['B','B'],['F','F']], answer:1, explanation:'Ball starts with /b/ — B.'},
        {prompt:'Cat starts with which letter sound?', cue:'🐱 cat', options:[['C','C'],['L','L'],['R','R']], answer:0, explanation:'Cat starts with /k/ — C in this word.'}
      ]
    },
    '4-6': {
      icon:'🔤', title:'Build the Word', subject:'Literacy', mode:'supported', input:'builder',
      instruction:'Look at the picture, say the sounds slowly, then build or type the short word. Letter buttons are available if a keyboard is not comfortable yet.',
      objective:'Blend and segment simple sounds, spell short decodable words and begin using letter keys with support.',
      keyboardTip:'Use one finger at a time if needed. Accuracy matters more than speed.',
      rounds:[
        {prompt:'Build the word for this picture.', cue:'🐱 CAT', target:'cat', letters:['c','a','t','m'], explanation:'c-a-t blends to cat.'},
        {prompt:'Build the word for this picture.', cue:'☀️ SUN', target:'sun', letters:['s','u','n','p'], explanation:'s-u-n blends to sun.'},
        {prompt:'Build the word for this picture.', cue:'🛏️ BED', target:'bed', letters:['b','e','d','r'], explanation:'b-e-d blends to bed.'},
        {prompt:'Build the word for this picture.', cue:'🐶 DOG', target:'dog', letters:['d','o','g','c'], explanation:'d-o-g blends to dog.'}
      ]
    },
    '7-9': {
      icon:'⌨️', title:'Spell & Type Mission', subject:'English / Literacy', mode:'independent', input:'typing',
      instruction:'Read the clue and type the word or short sentence. There is no speed score — focus on spelling, spaces and careful keyboard use.',
      objective:'Spell common curriculum vocabulary, compose short accurate sentences and use keyboard keys deliberately.',
      keyboardTip:'Keep wrists relaxed. Use the space bar for spaces and Shift for a capital letter when a sentence needs one.',
      rounds:[
        {prompt:'Type the word meaning “the force that pulls objects toward Earth”.', target:'gravity', accept:['gravity'], explanation:'Gravity is the force that attracts masses.'},
        {prompt:'Complete the sentence: The Moon orbits the ____.', target:'Earth', accept:['earth'], explanation:'The Moon orbits Earth.'},
        {prompt:'Type the plural of “planet”.', target:'planets', accept:['planets'], explanation:'Planet becomes planets.'},
        {prompt:'Type this sentence with a capital letter and full stop: orish likes science', target:'Orish likes science.', acceptExact:['Orish likes science.'], explanation:'Sentences begin with a capital letter and finish with punctuation.'}
      ]
    },
    '10-12': {
      icon:'📝', title:'Read, Understand & Type', subject:'English / Literacy', mode:'independent', input:'typing',
      instruction:'Read each short passage, answer from the evidence and type a concise response. The app checks only the current answer and does not save the text you type.',
      objective:'Retrieve information, infer carefully from a short text, use precise vocabulary and type clear responses.',
      keyboardTip:'Use both hands when comfortable. Pause for accuracy, punctuation and editing instead of racing.',
      rounds:[
        {passage:'A paper helicopter with longer blades took 2.8 seconds to fall. The shorter-blade version took 1.9 seconds in the same test area.', prompt:'Which version stayed in the air longer?', target:'longer blades', accept:['longer blades','the longer blades','longer-blade version','the longer-blade version'], explanation:'The longer-blade version had the longer fall time.'},
        {passage:'Maya repeated each test three times because one result can be unusual.', prompt:'Why did Maya repeat the tests?', target:'to improve reliability', accept:['to improve reliability','improve reliability','for reliability','to make the results more reliable','make the results more reliable'], explanation:'Repeating trials helps show whether a result is consistent.'},
        {passage:'The temperature rose from 18°C to 24°C while the lamp was on.', prompt:'Type the temperature increase as a number followed by °C.', target:'6°C', accept:['6°c','6 c','6c','6'], explanation:'24 − 18 = 6°C.'},
        {passage:'The results suggest a pattern, but only four trials were completed.', prompt:'Which word is safer: proves or suggests?', target:'suggests', accept:['suggests'], explanation:'“Suggests” fits limited evidence better than “proves”.'}
      ]
    },
    '13-16': {
      icon:'✍️', title:'Precision Reading & Editing Lab', subject:'English, Media Literacy & Critical Thinking', mode:'independent', input:'typing',
      instruction:'Read closely, choose precise language and edit short statements. Some rounds require exact capitalisation and punctuation because those are part of the task.',
      objective:'Interpret evidence, distinguish cautious from overstated claims, edit for precision and communicate clearly using mature academic vocabulary.',
      keyboardTip:'Use keyboard shortcuts only if useful to you. Accuracy, clarity and revision matter more than words per minute.',
      rounds:[
        {passage:'In a small sample, students who slept longer tended to report better concentration. The study did not randomly assign sleep duration.', prompt:'Type the safer conclusion word: causes or correlates', target:'correlates', accept:['correlates'], explanation:'The design can show an association, not establish causation.'},
        {prompt:'Correct the sentence exactly: the evidence suggests a pattern however more trials are needed', target:'The evidence suggests a pattern; however, more trials are needed.', acceptExact:['The evidence suggests a pattern; however, more trials are needed.'], explanation:'The revision adds capitalisation and punctuation that separates the linked clauses clearly.'},
        {passage:'A source gives a strong claim but provides no method, sample size or raw figures.', prompt:'Type one precise word for what is missing: evidence, decoration or popularity', target:'evidence', accept:['evidence'], explanation:'A claim needs inspectable evidence and methods, not popularity.'},
        {prompt:'Type the best word to complete: A limitation does not automatically make a study useless; it helps us judge its ____.', target:'strength', accept:['strength','reliability','validity'], explanation:'Limitations help us judge how much confidence to place in a result and where caution is needed.'}
      ]
    }
  };

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function get(ageBand){ return {ageBand, ...clone(games[ageBand] || games['7-9'])}; }
  function tidy(value){ return String(value ?? '').trim().replace(/\s+/g,' '); }
  function loose(value){ return tidy(value).toLowerCase().replace(/[.,!?;:]+$/g,''); }
  function evaluate(round, answer){
    const raw=tidy(answer);
    if(Array.isArray(round.acceptExact)) return round.acceptExact.includes(raw);
    const accepted=Array.isArray(round.accept) ? round.accept : [round.target];
    return accepted.map(loose).includes(loose(raw));
  }

  window.OrishLiteracyKeyboard={get,evaluate,ageBands:Object.keys(games)};
})();
