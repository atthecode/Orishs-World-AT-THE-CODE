(() => {
  'use strict';

  const levelLabels = {
    supported: 'Supported practice',
    core: 'Core practice',
    stretch: 'Stretch challenge'
  };

  let generationCounter = 0;
  let lastSheet = null;

  function clean(value, max = 80) {
    return String(value || '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, max);
  }

  function subjectMatches(item, subject) {
    const hay = `${item?.subject || ''} ${item?.title || ''} ${item?.objective || ''}`.toLowerCase();
    if (subject === 'literacy') return /read|literacy|spell|phon|vocab|writing|language|keyboard/.test(hay);
    if (subject === 'maths') return /math|number|fraction|measure|algebra|geometry|probab|ratio|percent/.test(hay);
    return true;
  }

  function analyseProgress(evidence = [], subject = 'mixed') {
    const recent = evidence.filter(item => subjectMatches(item, subject)).slice(0, 12);
    const scored = recent.filter(item => Number.isFinite(item.score) && Number.isFinite(item.total) && item.total > 0);
    if (!scored.length) return { level:'core', accuracy:null, scoredCount:0, evidenceCount:recent.length };
    const correct = scored.reduce((sum,item)=>sum + item.score, 0);
    const total = scored.reduce((sum,item)=>sum + item.total, 0);
    const accuracy = total ? correct / total : null;
    const level = accuracy < 0.65 ? 'supported' : accuracy >= 0.88 ? 'stretch' : 'core';
    return { level, accuracy, scoredCount:scored.length, evidenceCount:recent.length };
  }

  function rotate(items, offset) {
    if (!items.length) return [];
    const n = ((offset % items.length) + items.length) % items.length;
    return items.slice(n).concat(items.slice(0,n));
  }

  function themeFor(interests = []) {
    const text = interests.join(' ').toLowerCase();
    if (/space|rocket|planet|star|science/.test(text)) return {icon:'🚀', name:'Space Mission', place:'mission control', object:'moon samples', reward:'Launch Badge'};
    if (/animal|nature|ocean|dinosaur/.test(text)) return {icon:'🦊', name:'Wild Explorer Mission', place:'wildlife base', object:'field clues', reward:'Wild Explorer Badge'};
    if (/cook|food|bake|kitchen/.test(text)) return {icon:'🧁', name:'Kitchen Quest', place:'test kitchen', object:'recipe clues', reward:'Kitchen Thinker Badge'};
    if (/art|draw|creative|music/.test(text)) return {icon:'🎨', name:'Creative Quest', place:'design studio', object:'design clues', reward:'Creative Thinker Badge'};
    if (/game|gaming|code|technology/.test(text)) return {icon:'🎮', name:'Code Quest', place:'game lab', object:'level clues', reward:'Logic Builder Badge'};
    if (/football|sport|dance|gym/.test(text)) return {icon:'⚽', name:'Active Explorer Mission', place:'training base', object:'challenge clues', reward:'Team Thinker Badge'};
    return {icon:'🧭', name:'Explorer Mission', place:'explorer base', object:'mission clues', reward:'Explorer Badge'};
  }

  function item({prompt,hint,answer,choices=null,type='write',icon='✏️',area='',skill='',accept=[]}) {
    return {prompt,hint,answer,choices,type,icon,area,skill,accept};
  }

  function literacyBank(ageBand, level) {
    const banks = {
      '0-2': [
        item({icon:'👀',type:'shared',prompt:'Grown-up: choose three familiar objects. Name each one slowly and notice which word your child looks toward, points to or copies.',hint:'Keep it playful and stop when interest drops.',answer:'Parent observation'}),
        item({icon:'👏',type:'shared',prompt:'Clap the beat of a favourite rhyme together for one short verse.',hint:'Pause so your child can copy a sound, movement or clap.',answer:'Shared participation'}),
        item({icon:'📚',type:'shared',prompt:'Look at one picture book page. Point to one object and repeat its name together.',hint:'One happy shared moment is enough.',answer:'Shared participation'})
      ],
      '2-4': [
        item({icon:'🔊',type:'choice',prompt:'Which two words start with the same sound?',choices:['sun + sock','sun + cat','sock + cat'],hint:'Say each word slowly.',answer:'sun + sock'}),
        item({icon:'🐶',type:'choice',prompt:'Which word rhymes with “log”?',choices:['dog','sun','fish'],hint:'Listen to the ending sound.',answer:'dog'}),
        item({icon:'✍️',prompt:'Trace these letters, then say their sounds: m   s   t',hint:'One careful trace is enough.',answer:'m /m/, s /s/, t /t/'}),
        item({icon:'🎨',type:'draw',prompt:'Draw something beginning with the sound /b/.',hint:'Ball, book and banana are examples.',answer:'Any suitable /b/ word or picture'})
      ],
      '4-6': [
        item({icon:'🧩',type:'choice',prompt:'Which one is a real word?',choices:['mip','map','mup'],hint:level==='supported'?'Say each sound, then blend.':'Blend the sounds smoothly.',answer:'map'}),
        item({icon:'🐱',prompt:'Write the missing first sound: _at  (clue: 🐱)',hint:'What sound do you hear first in cat?',answer:'c',accept:['c']}),
        item({icon:'🔎',type:'choice',prompt:'Which sentence is ready for a book?',choices:['We ran.','we ran','We ran'],hint:'Look for a capital letter and full stop.',answer:'We ran.'}),
        item({icon:'🦊',type:'choice',prompt:'Read: “The red fox hid in the den.” What colour was the fox?',choices:['red','blue','green'],hint:'Look back at the sentence.',answer:'red'}),
        item({icon:'🎤',type:'speak',prompt:'Say “cat”, then change the last sound to make “cap”. Which sound changed?',hint:'Stretch the final sound.',answer:'t changed to p'})
      ],
      '7-9': [
        item({icon:'🔦',type:'choice',prompt:'Maya packed a torch because the path would be dark. Why did Maya pack it?',choices:['The path would be dark','She was hungry','It was raining'],hint:level==='supported'?'Find the word “because”.':'Choose the answer supported by the sentence.',answer:'The path would be dark'}),
        item({icon:'🛠️',prompt:'Repair this sentence: “we saw three foxs in the wood”',hint:'Check the capital letter, plural spelling and punctuation.',answer:'We saw three foxes in the wood.'}),
        item({icon:'💬',type:'choice',prompt:'Choose the best synonym for “enormous”.',choices:['tiny','huge','quiet'],hint:'A synonym has a similar meaning.',answer:'huge'}),
        item({icon:'✍️',prompt:'Write one sentence using the word “although”.',hint:level==='stretch'?'Show a clear contrast between two ideas.':'Try: “Although it was…, …”',answer:'Open response showing contrast'}),
        item({icon:'🗺️',type:'order',prompt:'Put these mission events in a sensible order: check the map → arrive → choose a route',hint:'Think first, next, last.',answer:'check the map → choose a route → arrive'})
      ],
      '10-12': [
        item({icon:'🧪',type:'choice',prompt:'An experiment was repeated three times, but the results still varied. What does this suggest?',choices:['The result is not fully certain','The result is definitely true','Repeating never helps'],hint:'Think about reliability and variation.',answer:'The result is not fully certain'}),
        item({icon:'🛠️',prompt:'Edit for clarity: “The device it worked good because it had less problems.”',hint:'Improve grammar and precision.',answer:'The device worked well because it had fewer problems.'}),
        item({icon:'📚',type:'choice',prompt:'Choose the strongest word: “The evidence ___ the claim.”',choices:['supports','decorates','whispers'],hint:'Pick the word that fits evidence reasoning.',answer:'supports'}),
        item({icon:'✂️',prompt:'Write a 12-word-or-fewer summary: “Rainwater collected on the roof was measured each morning for a week.”',hint:'Keep only the key information.',answer:'Open response retaining rainwater, roof, measurement and one week'}),
        item({icon:'✍️',prompt:'Add punctuation: “Before we decide let us compare both sources”',hint:'Separate the opening phrase.',answer:'Before we decide, let us compare both sources.'})
      ],
      '13-16': [
        item({icon:'🎯',prompt:'Rewrite precisely: “Lots of people say the study proves the product definitely works.”',hint:'Remove vague quantity and overclaiming.',answer:'Open response using cautious, evidence-aware wording'}),
        item({icon:'🔎',type:'choice',prompt:'“The sample contained 120 participants.” Is this a fact, inference or opinion?',choices:['fact','inference','opinion'],hint:'Ask whether it can be directly checked in the study.',answer:'fact'}),
        item({icon:'🛠️',prompt:'Correct the ambiguity: “Jordan told Sam they had misread the graph.”',hint:'Make it clear who misread the graph.',answer:'Open response that removes the ambiguous pronoun'}),
        item({icon:'🗓️',prompt:'Give one reason a source dated 2012 might still be useful and one reason it might need updating.',hint:'Think foundational evidence versus changing facts.',answer:'Open response covering both usefulness and possible staleness'}),
        item({icon:'⚖️',prompt:'Turn this into a cautious conclusion: “Our test proves all paper bridges are stronger when folded.”',hint:'Limit the claim to what was actually tested.',answer:'In our test, the folded paper bridge held more weight than the unfolded design.'})
      ]
    };
    let items = banks[ageBand] || banks['7-9'];
    if (level === 'supported') return items.slice(0, Math.min(4,items.length));
    return items.slice(0, Math.min(5,items.length));
  }

  function mathsBank(ageBand, level) {
    const banks = {
      '0-2': [
        item({icon:'🧱',type:'shared',prompt:'Grown-up: place 1 block, then 2 blocks. Say “one” and “two” together.',hint:'Shared number play only.',answer:'Parent observation'}),
        item({icon:'👀',type:'shared',prompt:'Point to the bigger group: ●●● or ●',hint:'Use the words more and less.',answer:'●●●'}),
        item({icon:'🔷',type:'shared',prompt:'Find one circle and one square in the room together.',hint:'Stop after a few minutes.',answer:'Shared participation'})
      ],
      '2-4': [
        item({icon:'⭐',type:'choice',prompt:'How many stars can you count? ★ ★ ★ ★',choices:['3','4','5'],hint:'Touch each star once.',answer:'4'}),
        item({icon:'●',type:'choice',prompt:'Which group has more?',choices:['●●●','●●'],hint:'Count each group.',answer:'●●●'}),
        item({icon:'➕',type:'choice',prompt:'2 + 1 = ?',choices:['2','3','4'],hint:'Use fingers or counters.',answer:'3'}),
        item({icon:'🔺',type:'choice',prompt:'Which shape is a triangle?',choices:['△','○','□'],hint:'A triangle has three sides.',answer:'△'})
      ],
      '4-6': [
        item({icon:'🚀',type:'choice',prompt:level==='supported'?'6 + 3 = ?':'8 + 7 = ?',choices:level==='supported'?['8','9','10']:['14','15','16'],hint:'Draw dots or use number bonds.',answer:level==='supported'?'9':'15'}),
        item({icon:'🌟',type:'choice',prompt:level==='stretch'?'20 − 9 = ?':'13 − 5 = ?',choices:level==='stretch'?['9','10','11']:['7','8','9'],hint:'Count back or partition.',answer:level==='stretch'?'11':'8'}),
        item({icon:'👯',type:'choice',prompt:'What is double 4?',choices:['6','8','10'],hint:'4 + 4',answer:'8'}),
        item({icon:'🍎',type:'choice',prompt:'Half of 10 is…',choices:['4','5','6'],hint:'Split 10 into two equal groups.',answer:'5'}),
        item({icon:'📏',prompt:'A ribbon is 12 cm long. You cut off 4 cm. How much remains?',hint:'Use subtraction.',answer:'8 cm',accept:['8','8cm','8 cm']})
      ],
      '7-9': [
        item({icon:'⚡',type:'choice',prompt:level==='supported'?'6 × 4 = ?':'7 × 8 = ?',choices:level==='supported'?['20','24','28']:['48','54','56'],hint:'Use a known multiplication fact.',answer:level==='supported'?'24':'56'}),
        item({icon:'🔐',type:'choice',prompt:'Unlock the code: 48 ÷ 6 = ?',choices:['6','8','9'],hint:'Think: 6 × ? = 48.',answer:'8'}),
        item({icon:'🍕',type:'choice',prompt:'Which is larger?',choices:['3/4','2/3','They are equal'],hint:'Draw two fraction bars if you need them.',answer:'3/4'}),
        item({icon:'💧',prompt:'A bottle holds 750 ml. After 275 ml is used, how much remains?',hint:'Subtract carefully.',answer:'475 ml',accept:['475','475ml','475 ml']}),
        item({icon:'📐',prompt:level==='stretch'?'A rectangle has area 72 cm² and width 8 cm. Find its length.':'A rectangle is 8 cm by 5 cm. Find its area.',hint:'Area = length × width.',answer:level==='stretch'?'9 cm':'40 cm²',accept:level==='stretch'?['9','9cm','9 cm']:['40','40cm2','40 cm2','40 cm²']})
      ],
      '10-12': [
        item({icon:'🔢',prompt:'0.75 + 1.28 = ?',hint:'Line up decimal places.',answer:'2.03',accept:['2.03']}),
        item({icon:'%',prompt:'Find 15% of 80.',hint:'10% + 5% can help.',answer:'12',accept:['12']}),
        item({icon:'⚖️',prompt:'Simplify the ratio 18:24.',hint:'Divide both parts by the same factor.',answer:'3:4',accept:['3:4','3/4']}),
        item({icon:'📊',prompt:'The mean of 6, 8, 10 and x is 9. Find x.',hint:'The total must be 4 × 9.',answer:'12',accept:['12']}),
        item({icon:'🏷️',prompt:level==='stretch'?'A price rises from 40 units to 46 units. Find the percentage increase.':'A 60-unit item is reduced by 20%. Find the sale price.',hint:'Work from the original value.',answer:level==='stretch'?'15%':'48',accept:level==='stretch'?['15','15%']:['48']})
      ],
      '13-16': [
        item({icon:'🧮',prompt:'Solve: 3x + 7 = 25',hint:'Undo +7, then divide by 3.',answer:'x = 6',accept:['6','x=6','x = 6']}),
        item({icon:'📉',prompt:'A value falls from 250 to 210. Find the percentage decrease.',hint:'Decrease ÷ original × 100.',answer:'16%',accept:['16','16%']}),
        item({icon:'🎲',prompt:'If P(A)=0.35, what is P(not A)?',hint:'Complement probabilities total 1.',answer:'0.65',accept:['0.65']}),
        item({icon:'🔴',prompt:'The ratio of red:blue beads is 5:3. There are 64 beads in total. How many are blue?',hint:'There are 8 equal parts.',answer:'24',accept:['24']}),
        item({icon:'🧩',prompt:level==='stretch'?'Expand and simplify: (x + 4)(x − 2)':'Factorise: x² + 7x + 12',hint:'Check the middle term carefully.',answer:level==='stretch'?'x² + 2x − 8':'(x + 3)(x + 4)'})
      ]
    };
    let items = banks[ageBand] || banks['7-9'];
    if (level === 'supported') return items.slice(0, Math.min(4,items.length));
    return items.slice(0, Math.min(5,items.length));
  }

  function bonusBank(ageBand, theme, level) {
    if (ageBand === '0-2') return [
      item({icon:'🌈',type:'shared',area:'Together challenge',prompt:`Grown-up: take a 2-minute ${theme.name.toLowerCase()} walk around the room. Name one colour, one shape and one sound together.`,hint:'No score. Follow the child’s attention.',answer:'Shared participation'})
    ];
    if (['2-4','4-6'].includes(ageBand)) return [
      item({icon:'🎨',type:'draw',area:'Creative bonus',prompt:`Draw a badge for today’s ${theme.name}. Add one shape or number you used.`,hint:'There is no single correct design.',answer:'Creative response'})
    ];
    if (ageBand === '7-9') return [
      item({icon:'🕵️',type:'realworld',area:'Real-world bonus',prompt:`Mission break: find one object near you that could represent ${theme.object}. Write one sentence explaining your choice.`,hint:'Use observation and a reason — no photo needed.',answer:'Open response with an observation and reason'})
    ];
    if (ageBand === '10-12') return [
      item({icon:'🧠',type:'realworld',area:'Boss challenge',prompt:`Design one extra question that would belong in this ${theme.name}. Then write what a strong answer should include.`,hint:level==='stretch'?'Make it require two-step reasoning.':'Keep it clear and checkable.',answer:'Open response with a relevant question and success criteria'})
    ];
    return [
      item({icon:'🎯',type:'realworld',area:'Boss challenge',prompt:`Create one harder follow-up task for this ${theme.name}. State the evidence or calculation that would make an answer convincing.`,hint:'Make the success criteria explicit.',answer:'Open response with defensible success criteria'})
    ];
  }

  function createWorksheet({profile, evidence = [], subject = 'mixed', printMode = 'colour'} = {}) {
    generationCounter += 1;
    const safeProfile = profile || { nickname:'Explorer', ageBand:'7-9', curriculum:'custom', interests:[] };
    const analysis = analyseProgress(evidence, subject);
    const theme = themeFor(safeProfile.interests || []);
    const seed = evidence.length + new Date().getDate() + generationCounter;
    let items = [];
    if (subject === 'literacy') items = rotate(literacyBank(safeProfile.ageBand, analysis.level), seed);
    else if (subject === 'maths') items = rotate(mathsBank(safeProfile.ageBand, analysis.level), seed);
    else {
      const lit = rotate(literacyBank(safeProfile.ageBand, analysis.level), seed).slice(0,3).map(q=>({...q,area:q.area || 'Literacy'}));
      const maths = rotate(mathsBank(safeProfile.ageBand, analysis.level), seed + 1).slice(0,3).map(q=>({...q,area:q.area || 'Maths'}));
      items = [];
      for (let i=0;i<Math.max(lit.length,maths.length);i+=1) {
        if (lit[i]) items.push(lit[i]);
        if (maths[i]) items.push(maths[i]);
      }
      items = items.slice(0,6);
    }
    const bonus = bonusBank(safeProfile.ageBand, theme, analysis.level)[0];
    if (safeProfile.ageBand !== '0-2' || items.length < 4) items.push(bonus);
    items = items.map((q,index)=>({...q,number:index+1,area:q.area || (subject === 'mixed' ? 'Mission' : subject === 'literacy' ? 'Literacy' : 'Maths')}));
    const framework = window.OrishCurriculum?.getFrameworkName?.(safeProfile.curriculum) || 'Flexible learning goals';
    const subjectLabel = subject === 'literacy' ? 'Reading & Literacy' : subject === 'maths' ? 'Maths' : 'Mixed Learning';
    const sheet = {
      id: crypto.randomUUID ? crypto.randomUUID() : `ws-${Date.now()}-${generationCounter}`,
      nickname: clean(safeProfile.nickname || 'Explorer', 30) || 'Explorer',
      ageBand: safeProfile.ageBand || '7-9',
      curriculum: safeProfile.curriculum || 'custom',
      framework,
      subject,
      subjectLabel,
      printMode: printMode === 'bw' ? 'bw' : 'colour',
      level: analysis.level,
      levelLabel: levelLabels[analysis.level],
      progress: analysis,
      theme: theme.name,
      themeIcon: theme.icon,
      badge: theme.reward,
      title: `${theme.icon} ${theme.name}: ${subjectLabel}`,
      introduction: analysis.level === 'supported'
        ? `Orish has shortened this mission and added extra clues. Complete each checkpoint at your own pace.`
        : analysis.level === 'stretch'
          ? `Strong recent practice unlocked a stretch mission. Explain your thinking as well as finding answers.`
          : `Complete the checkpoints, use hints when needed, then finish with the bonus mission.`,
      items,
      generatedAt: new Date().toISOString()
    };
    lastSheet = sheet;
    if (window.OrishWorksheets) window.OrishWorksheets.lastSheet = sheet;
    return sheet;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function toPrintableHTML(sheet) {
    const bw = sheet.printMode === 'bw';
    const accent = bw ? '#000' : '#0b6f86';
    const accent2 = bw ? '#000' : '#173f73';
    const soft = bw ? '#fff' : '#eefaff';
    const rows = sheet.items.map(q => `
      <section class="question">
        <div class="num">${escapeHtml(q.icon || '✏️')}<span>${q.number}</span></div>
        <div>
          <small class="area">${escapeHtml(q.area || '')}</small>
          <h3>${escapeHtml(q.prompt)}</h3>
          ${q.choices ? `<div class="choices">${q.choices.map(choice=>`<span>○ ${escapeHtml(choice)}</span>`).join('')}</div>` : ''}
          <p class="hint">💡 ${escapeHtml(q.hint || 'Take your time and show your thinking.')}</p>
          <div class="answer-space"></div>
        </div>
      </section>`).join('');
    const answers = sheet.items.map(q => `<li><strong>${q.number}.</strong> ${escapeHtml(q.answer || 'Open response')}</li>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${escapeHtml(sheet.nickname)} — ${escapeHtml(sheet.title)}</title>
      <style>
        *{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#102234;background:#fff}main{max-width:820px;margin:auto;padding:28px}
        .head{border:3px solid ${accent};border-radius:24px;padding:22px;background:${soft};position:relative;overflow:hidden}.head:after{content:'${escapeHtml(sheet.themeIcon || '🧭')}';position:absolute;right:18px;top:12px;font-size:54px;opacity:.18}
        h1{margin:0 0 8px;color:${accent2};font-size:28px}.meta{font-size:12px;line-height:1.5}.mission{font-weight:700;margin-top:12px;max-width:650px}.badge{display:inline-block;margin-top:12px;padding:7px 12px;border:2px solid ${accent};border-radius:999px;font-weight:700}
        .question{display:grid;grid-template-columns:54px 1fr;gap:16px;padding:20px 0;border-bottom:1px solid #b8ced7;break-inside:avoid}.num{width:48px;height:48px;border:2px solid ${accent};border-radius:16px;display:grid;place-items:center;font-size:19px;position:relative}.num span{position:absolute;right:-6px;top:-7px;background:${accent2};color:#fff;border-radius:50%;width:22px;height:22px;display:grid;place-items:center;font-size:11px;font-weight:800}
        .question h3{font-size:17px;margin:3px 0 8px}.hint{font-size:12px;margin:9px 0 0;color:#445}.area{text-transform:uppercase;letter-spacing:.08em;color:${accent};font-weight:800}.choices{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.choices span{padding:7px 10px;border:1px solid #9db6c0;border-radius:10px}.answer-space{height:58px;border-bottom:1px dashed #78909a;margin-top:12px}.answers{margin-top:28px;padding:18px;border:2px solid ${accent};border-radius:16px;break-before:page}.answers h2{margin-top:0}.answers li{margin:8px 0}.footer{margin-top:20px;font-size:10px;color:#555}
        @media print{main{padding:10mm}.answers{break-before:page}}
      </style></head><body><main>
      <div class="head"><h1>${escapeHtml(sheet.nickname)}’s ${escapeHtml(sheet.title)}</h1>
      <div class="meta">${escapeHtml(sheet.framework)} • Age ${escapeHtml(sheet.ageBand)} • ${escapeHtml(sheet.levelLabel)} • ${sheet.printMode==='bw'?'Black & white':'Colour'}</div>
      <div class="mission">${escapeHtml(sheet.introduction)}</div><div class="badge">🏅 Mission reward: ${escapeHtml(sheet.badge || 'Explorer Badge')}</div></div>
      ${rows}
      <section class="answers"><h2>Grown-up / teacher answer guide</h2><ol>${answers}</ol></section>
      <p class="footer">Orish’s World @ THE CODE • locally generated adaptive learning mission • not a formal statutory assessment.</p>
      </main></body></html>`;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[\s.,!?£$]/g,'').replace(/²/g,'2');
  }

  function answerMatches(q, value) {
    const expected = [q.answer, ...(q.accept || [])].map(normalize).filter(Boolean);
    const got = normalize(value);
    if (!got || !expected.length) return false;
    return expected.includes(got);
  }

  function injectPreviewStyles() {
    if (document.getElementById('orishWorksheetUpgradeStyles')) return;
    const style = document.createElement('style');
    style.id = 'orishWorksheetUpgradeStyles';
    style.textContent = `
      #worksheetPreview{overflow:hidden;max-width:100%}
      #worksheetPreview .worksheet-mission-preview{display:grid;gap:14px;margin-top:14px;max-width:100%}
      #worksheetPreview .ws-mission-head{padding:16px;border:1px solid rgba(69,220,238,.32);border-radius:18px;background:linear-gradient(135deg,rgba(37,211,232,.11),rgba(20,45,78,.28));display:grid;gap:7px}
      #worksheetPreview .ws-mission-head strong{font-size:1.08rem;color:#e9fdff}.ws-mission-head small{color:#9edce5}.ws-progress{height:8px;background:rgba(255,255,255,.09);border-radius:99px;overflow:hidden}.ws-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#46e4f1,#ffe19a);transition:width .25s ease}
      #worksheetPreview .ws-card{min-width:0;padding:15px;border:1px solid rgba(135,205,220,.22);border-radius:18px;background:rgba(7,29,49,.68);display:grid;grid-template-columns:42px minmax(0,1fr);gap:12px}
      #worksheetPreview .ws-icon{width:40px;height:40px;border-radius:13px;background:rgba(69,220,238,.12);display:grid;place-items:center;font-size:1.25rem}.ws-copy{min-width:0}.ws-copy small{display:block;color:#70e4ee;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}.ws-copy p{margin:0 0 10px;overflow-wrap:anywhere}.ws-choice-grid{display:grid;gap:7px}.ws-choice{width:100%;text-align:left;padding:10px 12px;border-radius:12px;border:1px solid rgba(171,220,230,.26);background:rgba(255,255,255,.04);color:inherit}.ws-choice.correct{border-color:#72efb4;background:rgba(44,190,125,.16)}.ws-choice.incorrect{border-color:#ff9eaa;background:rgba(217,76,94,.14)}
      #worksheetPreview .ws-answer{width:100%;max-width:100%;padding:11px 12px;border-radius:12px;border:1px solid rgba(171,220,230,.28);background:rgba(2,17,30,.55);color:inherit;font:inherit}.ws-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.ws-mini{padding:8px 11px;border-radius:999px;border:1px solid rgba(171,220,230,.3);background:transparent;color:inherit;font-weight:700}.ws-feedback{margin-top:8px;font-size:.9rem;color:#b8ced8}.ws-feedback.good{color:#8ff2c1}.ws-hint{margin-top:8px;padding:9px 11px;border-radius:11px;background:rgba(255,225,154,.08);color:#ffe19a;font-size:.9rem}.ws-complete{padding:14px;border-radius:16px;background:rgba(57,205,160,.12);border:1px solid rgba(112,239,180,.35);text-align:center;font-weight:800}
      @media(max-width:520px){#worksheetPreview .ws-card{grid-template-columns:36px minmax(0,1fr);padding:13px;gap:10px}#worksheetPreview .ws-icon{width:36px;height:36px}#worksheetPreview .ws-actions>*{flex:1 1 auto}}
    `;
    document.head.appendChild(style);
  }

  function enhancePreview() {
    const box = document.getElementById('worksheetPreview');
    const sheet = lastSheet || window.OrishWorksheets?.lastSheet;
    if (!box || !sheet || box.dataset.wsEnhanced === sheet.id && box.querySelector('.worksheet-mission-preview')) return;
    box.dataset.wsEnhanced = sheet.id;
    box.querySelectorAll('.curriculum-row').forEach(row => row.remove());
    const oldNote = box.querySelector('.privacy-note');
    const mission = document.createElement('section');
    mission.className = 'worksheet-mission-preview';
    const head = document.createElement('div');
    head.className = 'ws-mission-head';
    const title = document.createElement('strong'); title.textContent = `${sheet.themeIcon || '🧭'} Test this mission now`;
    const sub = document.createElement('small'); sub.textContent = `${sheet.items.length} checkpoints • ${sheet.levelLabel} • ${sheet.badge}`;
    const progress = document.createElement('div'); progress.className='ws-progress'; const fill=document.createElement('span'); progress.appendChild(fill);
    head.append(title,sub,progress); mission.appendChild(head);
    let completed = 0;
    const completedSet = new Set();
    const updateProgress = () => {
      fill.style.width = `${Math.round((completedSet.size / sheet.items.length) * 100)}%`;
      completed = completedSet.size;
      const existing = mission.querySelector('.ws-complete');
      if (completed === sheet.items.length && !existing) {
        const done=document.createElement('div'); done.className='ws-complete'; done.textContent=`🏅 Mission complete — ${sheet.badge} earned in this test preview!`; mission.appendChild(done);
      }
    };
    sheet.items.forEach(q => {
      const card=document.createElement('article'); card.className='ws-card';
      const icon=document.createElement('div'); icon.className='ws-icon'; icon.textContent=q.icon || '✏️';
      const copy=document.createElement('div'); copy.className='ws-copy';
      const area=document.createElement('small'); area.textContent=`Checkpoint ${q.number} • ${q.area || 'Mission'}`;
      const prompt=document.createElement('p'); prompt.textContent=q.prompt;
      copy.append(area,prompt);
      const feedback=document.createElement('div'); feedback.className='ws-feedback';
      const completeOpen = (message='Checkpoint marked complete.') => {
        completedSet.add(q.number); feedback.textContent=message; feedback.classList.add('good'); updateProgress();
      };
      if (q.choices?.length) {
        const grid=document.createElement('div'); grid.className='ws-choice-grid';
        q.choices.forEach(choice => {
          const button=document.createElement('button'); button.type='button'; button.className='ws-choice'; button.textContent=choice;
          button.addEventListener('click',()=>{
            grid.querySelectorAll('button').forEach(b=>b.classList.remove('correct','incorrect'));
            const ok=normalize(choice)===normalize(q.answer);
            button.classList.add(ok?'correct':'incorrect');
            feedback.textContent=ok?'✅ Yes — checkpoint cleared.':'Try again, or open the hint.';
            feedback.classList.toggle('good',ok);
            if(ok){completedSet.add(q.number);updateProgress();}
          });
          grid.appendChild(button);
        });
        copy.appendChild(grid);
      } else if (['shared','draw','speak','realworld','order'].includes(q.type) || /open response|creative response|shared|parent observation/i.test(q.answer)) {
        const actions=document.createElement('div'); actions.className='ws-actions';
        const done=document.createElement('button'); done.type='button'; done.className='ws-mini'; done.textContent=q.type==='shared'?'✓ We did this together':'✓ Mark checkpoint done'; done.addEventListener('click',()=>completeOpen());
        actions.appendChild(done); copy.appendChild(actions);
      } else {
        const input=document.createElement('input'); input.className='ws-answer'; input.autocomplete='off'; input.placeholder='Type your answer…'; input.setAttribute('aria-label',`Answer checkpoint ${q.number}`);
        const actions=document.createElement('div'); actions.className='ws-actions';
        const check=document.createElement('button'); check.type='button'; check.className='ws-mini'; check.textContent='Check answer';
        check.addEventListener('click',()=>{const ok=answerMatches(q,input.value);feedback.textContent=ok?'✅ Correct — checkpoint cleared.':'Not yet. Try the hint or check your working.';feedback.classList.toggle('good',ok);if(ok){completedSet.add(q.number);updateProgress();}});
        input.addEventListener('keydown',event=>{if(event.key==='Enter')check.click();});
        actions.appendChild(check); copy.append(input,actions);
      }
      const hintButton=document.createElement('button'); hintButton.type='button'; hintButton.className='ws-mini'; hintButton.textContent='💡 Hint';
      const hint=document.createElement('div'); hint.className='ws-hint'; hint.hidden=true; hint.textContent=q.hint || 'Take your time and show your thinking.';
      hintButton.addEventListener('click',()=>{hint.hidden=!hint.hidden;});
      const hintActions=copy.querySelector('.ws-actions') || document.createElement('div');
      if(!hintActions.classList.contains('ws-actions')) hintActions.className='ws-actions';
      hintActions.appendChild(hintButton); if(!hintActions.parentNode) copy.appendChild(hintActions);
      copy.append(hint,feedback); card.append(icon,copy); mission.appendChild(card);
    });
    if (oldNote) box.insertBefore(mission, oldNote); else box.appendChild(mission);
    updateProgress();
  }

  function startEnhancer() {
    if (typeof document === 'undefined') return;
    injectPreviewStyles();
    const observer = new MutationObserver(() => window.requestAnimationFrame(enhancePreview));
    const attach = () => {
      const box=document.getElementById('worksheetPreview');
      if (box) { observer.observe(box,{childList:true,subtree:true}); enhancePreview(); }
      else window.setTimeout(attach,400);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',attach,{once:true}); else attach();
  }

  window.OrishWorksheets = { levelLabels, analyseProgress, createWorksheet, toPrintableHTML, enhancePreview, lastSheet:null };
  startEnhancer();
})();