(() => {
  'use strict';

  const levelLabels = {
    supported: 'Supported practice',
    core: 'Core practice',
    stretch: 'Stretch challenge'
  };

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

  function literacyBank(ageBand, level) {
    const banks = {
      '0-2': [
        {prompt:'Grown-up: point to three pictures or objects and name them slowly. Which word does your child look toward or copy?',hint:'Shared talk only — no independent score.',answer:'Parent observation'},
        {prompt:'Say: “ball, book, spoon”. Pause after each word and let your child point, look or copy a sound.',hint:'Keep it playful and stop when interest drops.',answer:'Parent observation'},
        {prompt:'Choose one favourite rhyme. Clap the beat together for one short verse.',hint:'Rhythm and repeated language build early listening.',answer:'Shared participation'}
      ],
      '2-4': [
        {prompt:'Circle the two words that start with the same sound: sun · sock · cat',hint:'Say each word slowly.',answer:'sun, sock'},
        {prompt:'Draw a line from the word “cat” to a simple cat picture you draw together.',hint:'Grown-up can read the word aloud first.',answer:'cat'},
        {prompt:'Which word rhymes with “log”: dog or sun?',hint:'Say the endings aloud.',answer:'dog'},
        {prompt:'Trace these letters, then say their sounds: m  s  t',hint:'One careful trace is enough.',answer:'m /m/, s /s/, t /t/'}
      ],
      '4-6': [
        {prompt:'Read and underline the real word: mip · map · mup',hint: level==='supported'?'Say each sound, then blend.':'Blend the sounds smoothly.',answer:'map'},
        {prompt:'Write the missing first sound: _at  (picture clue: a cat)',hint:'What sound do you hear first in cat?',answer:'c'},
        {prompt:'Circle the sentence with correct punctuation: “We ran.”  “we ran”',hint:'Look for a capital letter and full stop.',answer:'We ran.'},
        {prompt:'Read: “The red fox hid in the den.” What colour was the fox?',hint:'Look back at the sentence.',answer:'red'},
        {prompt:'Change one sound in “cat” to make “cap”. Which sound changed?',hint:'Say cat, then cap.',answer:'t changed to p'}
      ],
      '7-9': [
        {prompt:'Read: “Maya packed a torch because the path would be dark.” Why did Maya pack a torch?',hint: level==='supported'?'Find the word “because”.':'Answer in a full sentence.',answer:'Because the path would be dark.'},
        {prompt:'Correct the sentence: “we saw three foxs in the wood”',hint:'Check the capital letter, plural spelling and punctuation.',answer:'We saw three foxes in the wood.'},
        {prompt:'Choose the best synonym for “enormous”: tiny · huge · quiet',hint:'A synonym has a similar meaning.',answer:'huge'},
        {prompt:'Write one sentence using the word “although”.',hint: level==='stretch'?'Show a clear contrast between two ideas.':'Start: “Although it was…”',answer:'Answers vary; sentence should show contrast.'},
        {prompt:'Put these events in a sensible order: check the map · arrive · choose a route',hint:'Think first, next, last.',answer:'check the map → choose a route → arrive'}
      ],
      '10-12': [
        {prompt:'Read: “The experiment was repeated three times, but the results still varied.” What does this suggest about certainty?',hint:'Think about reliability and variation.',answer:'The result is not fully certain; repeated trials still varied.'},
        {prompt:'Edit for clarity: “The device it worked good because it had less problems.”',hint:'Improve grammar and precision.',answer:'Example: “The device worked well because it had fewer problems.”'},
        {prompt:'Choose the strongest word: “The evidence ___ the claim.”  supports · decorates · whispers',hint:'Pick the word that fits evidence reasoning.',answer:'supports'},
        {prompt:'Write a 12-word summary of: “Rainwater collected on the roof was measured each morning for a week.”',hint:'Keep only the key information.',answer:'Answers vary; should retain rainwater, roof, measurement, morning and one week.'},
        {prompt:'Add punctuation: “Before we decide let us compare both sources”',hint:'Use punctuation to separate the opening phrase.',answer:'Before we decide, let us compare both sources.'}
      ],
      '13-16': [
        {prompt:'Rewrite precisely: “Lots of people say the study proves the product definitely works.”',hint:'Remove vague quantity and overclaiming.',answer:'Example: “Some reports claim the study supports the product, but the evidence should be checked before concluding it works.”'},
        {prompt:'Label this as fact, inference or opinion: “The sample contained 120 participants.”',hint:'Ask whether it can be directly checked in the study.',answer:'fact'},
        {prompt:'Correct the ambiguity: “Jordan told Sam they had misread the graph.”',hint:'Make it clear who misread the graph.',answer:'Example: “Jordan told Sam that Sam had misread the graph.”'},
        {prompt:'Give one reason a source dated 2012 might still be useful and one reason it might need updating.',hint:'Think foundational evidence versus changing facts.',answer:'Useful for stable/foundational evidence; may need updating for changed data, guidance or technology.'},
        {prompt:'Turn this into a cautious conclusion: “Our test proves all paper bridges are stronger when folded.”',hint:'Limit the claim to what was actually tested.',answer:'Example: “In our test, the folded paper bridge held more weight than the unfolded design.”'}
      ]
    };
    let items = banks[ageBand] || banks['7-9'];
    if (level === 'supported') return items.slice(0, Math.min(4,items.length));
    if (level === 'stretch') return items.slice(-Math.min(5,items.length));
    return items.slice(0, Math.min(5,items.length));
  }

  function mathsBank(ageBand, level) {
    const banks = {
      '0-2': [
        {prompt:'Grown-up: place 1 block, then 2 blocks. Say “one” and “two” together.',hint:'Shared number play only.',answer:'Parent observation'},
        {prompt:'Point to the bigger group: ●●● or ●',hint:'Use the words more and less.',answer:'●●●'},
        {prompt:'Find one circle and one square in the room together.',hint:'Stop after a few minutes.',answer:'Parent observation'}
      ],
      '2-4': [
        {prompt:'Count the stars: ★ ★ ★ ★',hint:'Touch each star once as you count.',answer:'4'},
        {prompt:'Which has more: ●●● or ●●?',hint:'Count each group.',answer:'●●●'},
        {prompt:'2 + 1 = ?',hint:'Use fingers or counters.',answer:'3'},
        {prompt:'Circle the triangle: △  ○  □',hint:'A triangle has three sides.',answer:'△'}
      ],
      '4-6': [
        {prompt: level==='supported'?'6 + 3 = ?':'8 + 7 = ?',hint:'Draw dots or use number bonds.',answer:level==='supported'?'9':'15'},
        {prompt: level==='stretch'?'20 − 9 = ?':'13 − 5 = ?',hint:'Count back or partition.',answer:level==='stretch'?'11':'8'},
        {prompt:'What is double 4?',hint:'4 + 4',answer:'8'},
        {prompt:'Half of 10 is ___',hint:'Split 10 into two equal groups.',answer:'5'},
        {prompt:'A ribbon is 12 cm long. You cut off 4 cm. How much remains?',hint:'Use subtraction.',answer:'8 cm'}
      ],
      '7-9': [
        {prompt: level==='supported'?'6 × 4 = ?':'7 × 8 = ?',hint:'Use a known multiplication fact.',answer:level==='supported'?'24':'56'},
        {prompt:'48 ÷ 6 = ?',hint:'Think: 6 × ? = 48.',answer:'8'},
        {prompt:'Which is larger: 3/4 or 2/3?',hint:'Use a common denominator or draw bars.',answer:'3/4'},
        {prompt:'A bottle holds 750 ml. How much is left after 275 ml is used?',hint:'Subtract carefully.',answer:'475 ml'},
        {prompt: level==='stretch'?'A rectangle has area 72 cm² and width 8 cm. Find its length.':'A rectangle is 8 cm by 5 cm. Find its area.',hint:'Area = length × width.',answer:level==='stretch'?'9 cm':'40 cm²'}
      ],
      '10-12': [
        {prompt:'0.75 + 1.28 = ?',hint:'Line up decimal places.',answer:'2.03'},
        {prompt:'Find 15% of 80.',hint:'10% + 5% can help.',answer:'12'},
        {prompt:'Simplify the ratio 18:24.',hint:'Divide both parts by the same factor.',answer:'3:4'},
        {prompt:'The mean of 6, 8, 10 and x is 9. Find x.',hint:'The total must be 4 × 9.',answer:'12'},
        {prompt: level==='stretch'?'A price rises from €40 to €46. Find the percentage increase.':'A £60 item is reduced by 20%. Find the sale price.',hint:'Find the change as a fraction of the original.',answer:level==='stretch'?'15%':'£48'}
      ],
      '13-16': [
        {prompt:'Solve: 3x + 7 = 25',hint:'Undo +7, then divide by 3.',answer:'x = 6'},
        {prompt:'A value falls from 250 to 210. Find the percentage decrease.',hint:'Decrease ÷ original × 100.',answer:'16%'},
        {prompt:'If P(A)=0.35, what is P(not A)?',hint:'Complement probabilities total 1.',answer:'0.65'},
        {prompt:'The ratio of red:blue beads is 5:3. There are 64 beads in total. How many are blue?',hint:'There are 8 equal parts.',answer:'24'},
        {prompt: level==='stretch'?'Expand and simplify: (x + 4)(x − 2)':'Factorise: x² + 7x + 12',hint:'Check the middle term carefully.',answer:level==='stretch'?'x² + 2x − 8':'(x + 3)(x + 4)'}
      ]
    };
    let items = banks[ageBand] || banks['7-9'];
    if (level === 'supported') return items.slice(0, Math.min(4,items.length));
    if (level === 'stretch') return items.slice(-Math.min(5,items.length));
    return items.slice(0, Math.min(5,items.length));
  }

  function createWorksheet({profile, evidence = [], subject = 'mixed', printMode = 'colour'} = {}) {
    const safeProfile = profile || { nickname:'Explorer', ageBand:'7-9', curriculum:'custom', interests:[] };
    const analysis = analyseProgress(evidence, subject);
    const offset = (evidence.length + new Date().getDate()) % 5;
    let items = [];
    if (subject === 'literacy') items = literacyBank(safeProfile.ageBand, analysis.level);
    else if (subject === 'maths') items = mathsBank(safeProfile.ageBand, analysis.level);
    else {
      const lit = literacyBank(safeProfile.ageBand, analysis.level).slice(0,3);
      const maths = mathsBank(safeProfile.ageBand, analysis.level).slice(0,3);
      items = lit.map(item=>({...item,area:'Literacy'})).concat(maths.map(item=>({...item,area:'Maths'})));
    }
    items = rotate(items, offset).map((item,index)=>({...item,number:index+1}));
    const framework = window.OrishCurriculum?.getFrameworkName?.(safeProfile.curriculum) || 'Flexible learning goals';
    const subjectLabel = subject === 'literacy' ? 'Reading & Literacy' : subject === 'maths' ? 'Maths' : 'Mixed Learning';
    const interest = clean((safeProfile.interests || [])[0] || 'Explorer', 30);
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `ws-${Date.now()}`,
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
      theme: interest,
      title: `${subjectLabel} Mission`,
      introduction: analysis.level === 'supported'
        ? 'A shorter supported sheet with hints and manageable steps.'
        : analysis.level === 'stretch'
          ? 'A stretch sheet selected because recent scored practice shows strong confidence.'
          : 'Core age-adaptive practice using the current learning profile.',
      items,
      generatedAt: new Date().toISOString()
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function toPrintableHTML(sheet) {
    const bw = sheet.printMode === 'bw';
    const accent = bw ? '#000' : '#173f73';
    const soft = bw ? '#fff' : '#eef5ff';
    const rows = sheet.items.map(item => `
      <section class="question">
        <div class="num">${item.number}</div>
        <div>
          ${item.area ? `<small class="area">${escapeHtml(item.area)}</small>` : ''}
          <h3>${escapeHtml(item.prompt)}</h3>
          <p class="hint">Hint: ${escapeHtml(item.hint || 'Take your time and show your thinking.')}</p>
          <div class="answer-space"></div>
        </div>
      </section>`).join('');
    const answers = sheet.items.map(item => `<li><strong>${item.number}.</strong> ${escapeHtml(item.answer || 'Open response')}</li>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${escapeHtml(sheet.nickname)} — ${escapeHtml(sheet.title)}</title>
      <style>
        *{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#111;background:#fff}
        main{max-width:820px;margin:auto;padding:28px}.head{border:3px solid ${accent};border-radius:20px;padding:20px;background:${soft}}
        h1{margin:0 0 6px;color:${accent}}.meta{font-size:12px;line-height:1.5}.mission{font-weight:700;margin-top:10px}
        .question{display:grid;grid-template-columns:42px 1fr;gap:14px;padding:18px 0;border-bottom:1px solid #bbb;break-inside:avoid}
        .num{width:38px;height:38px;border:2px solid ${accent};border-radius:50%;display:grid;place-items:center;font-weight:800}
        .question h3{font-size:17px;margin:0 0 8px}.hint{font-size:12px;margin:0;color:#444}.area{text-transform:uppercase;letter-spacing:.08em}
        .answer-space{height:58px;border-bottom:1px dashed #777;margin-top:12px}.answers{margin-top:28px;padding:18px;border:2px solid ${accent};border-radius:16px;break-before:page}
        .answers h2{margin-top:0}.answers li{margin:8px 0}.footer{margin-top:20px;font-size:10px;color:#555}
        @media print{main{padding:10mm}.no-print{display:none}.answers{break-before:page}}
      </style></head><body><main>
      <div class="head"><h1>${escapeHtml(sheet.nickname)}’s ${escapeHtml(sheet.title)}</h1>
      <div class="meta">${escapeHtml(sheet.framework)} • Age band ${escapeHtml(sheet.ageBand)} • ${escapeHtml(sheet.levelLabel)} • ${sheet.printMode==='bw'?'Black & white':'Colour'}</div>
      <div class="mission">${escapeHtml(sheet.introduction)}</div></div>
      ${rows}
      <section class="answers"><h2>Grown-up / teacher answer guide</h2><ol>${answers}</ol></section>
      <p class="footer">Orish’s World @ THE CODE • locally generated prototype worksheet • not a formal statutory assessment.</p>
      </main></body></html>`;
  }

  window.OrishWorksheets = { levelLabels, analyseProgress, createWorksheet, toPrintableHTML };
})();
