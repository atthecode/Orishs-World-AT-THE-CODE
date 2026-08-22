(() => {
  'use strict';

  const AGE_LABELS = {
    '0-2':'Parent & Baby', '2-4':'Early Explorer', '4-6':'Little Explorer',
    '7-9':'Growing Explorer', '10-12':'Big Explorer', '13-16':'Teen Explorer'
  };

  const ROUTES = [
    { id:'are-we-alone', label:'Are We Alone? Evidence Investigation', icon:'👽', launcher:'areWeAlone', subject:'Astronomy & evidence', keywords:['alien','aliens','extraterrestrial','ufo','uap','galactic federation','haim eshed','haim ishad','are we alone','life beyond earth','alien life','alien contact'], interests:['Space','Technology'], reason:'This question belongs in the dedicated evidence investigation that separates confirmed science, claims, unresolved observations and what would count as proof.' },
    { id:'mystery', label:'Mystery Investigation', icon:'🛰️', launcher:'science', subject:'Science & evidence', keywords:['bermuda','triangle','unexplained','mystery','mysterious','strange signal','black hole','ball lightning','lost place','disappear','unknown','ancient mystery'], interests:['Space','Dinosaurs','Nature','Technology'], reason:'This question is strongest as an evidence-led mystery where claims and explanations can be compared.' },
    { id:'science', label:'Science Expedition', icon:'🔬', launcher:'science', subject:'Science', keywords:['science','experiment','weather','ocean','plant','fossil','dinosaur','mineral','cave','earth','gravity','energy','animal','nature','volcano','climate'], interests:['Animals','Dinosaurs','Nature','Space'], reason:'This can become a hands-on science investigation with observations, explanations and a safe challenge.' },
    { id:'space', label:'Space Mission', icon:'🚀', launcher:'spaceGame', subject:'Science', keywords:['space','planet','moon','rocket','star','solar','galaxy','astronomy','orbit','mars','jupiter','saturn','sun'], interests:['Space'], reason:'A space mission can turn curiosity into an age-adapted science game.' },
    { id:'body', label:'Human Body Mission', icon:'🫀', launcher:'bodyGame', subject:'Science', keywords:['heart','body','bone','bones','muscle','organ','lungs','brain','blood','skeleton','anatomy','digestion'], interests:['Human body'], reason:'This fits the Human Body game pathway and can scale from recognition to anatomy and systems thinking.' },
    { id:'evidence', label:'AI Evidence Detective', icon:'🔎', launcher:'evidence', subject:'Research skills', keywords:['evidence','source','research','citation','cite','fact check','check claim','ai search','search evidence','prove','proof','document','reference','reliable','hallucination'], interests:['Technology','Space','Nature'], reason:'The best next step is to learn how to turn a claim into questions, sources, notes and a defensible conclusion.' },
    { id:'history', label:'Global History & Culture', icon:'🌍', launcher:'history', subject:'History & culture', keywords:['history','black history','black inventor','inventor','changemaker','culture','cultural','heritage','tradition','migration','civil rights','colonial','colonialism','empire','diaspora','who invented','who created'], interests:['Stories','Technology','Art'], reason:'This belongs in the source-backed history pathway, where Orish can connect a real journey to evidence, context, culture and what changed.' },
    { id:'maths', label:'Maths Lab', icon:'📐', launcher:'maths', subject:'Mathematics', keywords:['math','maths','fraction','number','times table','multiply','division','algebra','geometry','percent','percentage','ratio','probability','graph','measure','measurement','equation'], interests:[], reason:'This is a maths problem, so Orish can choose a visual, age-appropriate reasoning challenge without a speed race.' },
    { id:'money', label:'Money Mission', icon:'💷', launcher:'lifeSkills', subject:'Financial literacy', keywords:['money','budget','save','saving','spend','spending','price','finance','financial','bank','interest','loan','credit','debit','wage','salary','tax','subscription','shopping','cost'], interests:['Technology','Cooking'], reason:'This works best as a real-world money decision with comparison, calculation and consequences.' },
    { id:'law', label:'Rights, Rules & Choices', icon:'⚖️', launcher:'lifeSkills', subject:'Law & civics', keywords:['law','laws','legal','rights','rule','rules','contract','consumer','police','court','civic','citizen','responsibility','permission'], interests:[], reason:'This can become an age-appropriate rights/rules scenario that teaches principles without giving personal legal advice.' },
    { id:'literacy', label:'Reading & Keyboard Lab', icon:'⌨️', launcher:'literacy', subject:'Literacy', keywords:['read','reading','spell','spelling','keyboard','type','typing','word','words','vocabulary','comprehension','sentence','punctuation','write','writing'], interests:['Stories','Technology'], reason:'This is best practised through reading, vocabulary, spelling, comprehension or careful keyboard work.' },
    { id:'logic', label:'Logic & Sequencing Lab', icon:'🧭', launcher:'sequence', subject:'Reasoning', keywords:['logic','sequence','order','plan','planning','steps','process','first next','organise','organize','dependency','strategy'], interests:['Building','Technology'], reason:'The idea has a sequence or planning structure, so a logic challenge is the strongest fit.' },
    { id:'observation', label:'Observation Lab', icon:'👀', launcher:'observation', subject:'Observation & evidence', keywords:['spot','find hidden','hidden object','what changed','observe','observation','difference','differences','look closely','clue'], interests:['Nature','Space','Dinosaurs'], reason:'This can become a visual clue hunt that develops careful observation before inference.' },
    { id:'memory', label:'Memory Lab', icon:'🧠', launcher:'memory', subject:'Memory & concepts', keywords:['memory','remember','matching','match pairs','pairs','recall'], interests:[], reason:'A matching/memory activity is a safe way to practise this content without timers or ranking.' },
    { id:'story', label:'Story & Choice Adventure', icon:'📖', launcher:'story', subject:'Communication & reasoning', keywords:['story','choice','choices','feelings','friend','communication','consequence','what should i do','decision','decide','bedtime story','branching'], interests:['Stories'], reason:'A branching story lets choices change what happens while keeping repair, perspective and consequences natural.' },
    { id:'maker', label:'Make With Orish', icon:'🛠️', launcher:'maker', subject:'Design & making', keywords:['paper','plane','origami','craft','make','build','bridge','parachute','cardboard','fold','model','construct'], interests:['Building','Art'], reason:'This idea is strongest as an offline build where the child can test, improve and explain what they made.' },
    { id:'creative', label:'Creative Studio', icon:'🎨', launcher:'creative', subject:'Creative thinking', keywords:['draw','drawing','art','comic','design','invent','create picture','character','poster','imagine','world build','worldbuilding'], interests:['Art','Music','Stories'], reason:'This is a creative brief, so Orish can turn it into an age-adapted design or storytelling challenge.' },
    { id:'kitchen', label:'Kitchen Lab', icon:'🥣', launcher:'kitchen', subject:'Food & life skills', keywords:['cook','cooking','bake','baking','recipe','bread','cake','butter','ingredient','kitchen','microwave','food'], interests:['Cooking'], reason:'This belongs in Kitchen Lab, where available ingredients and adult/child role tags can keep the activity realistic and safer.' },
    { id:'family', label:'Family Clubhouse', icon:'🏠', launcher:'family', subject:'Family learning', keywords:['family','mum','mom','dad','parent','grandparent','grandma','grandad','sibling','brother','sister','together','family game'], interests:[], reason:'This works best as a cooperative approved-family activity rather than a public social feature.' },
    { id:'routine', label:'Routine Adventure', icon:'🌙', launcher:'routine', subject:'Life skills', keywords:['morning','routine','bed','bedtime','sleep','brush teeth','get dressed','tidy','getting ready','habit'], interests:[], reason:'This can become a positive routine adventure with one manageable step at a time.' },
    { id:'news', label:'Good News Beacon', icon:'🌍', launcher:'goodNews', subject:'Media literacy', keywords:['news','good news','positive news','world news','hopeful'], interests:['Nature','Technology','Space'], reason:'This belongs in the calm Good News Beacon with age-appropriate media-literacy prompts.' },
    { id:'mission', label:'Mission HQ', icon:'🎯', launcher:'mission', subject:'Mixed learning', keywords:['mission','challenge me','give me a challenge','surprise me','something to do','activity'], interests:[], reason:'A mixed mission is a good fit when the child wants a challenge rather than one specific subject.' }
  ];

  const SAFETY = [
    { pattern:/\b(kill myself|suicide|self[- ]?harm|hurt myself)\b/i, kind:'urgent', message:'I can’t turn that into a game. Please tell a trusted grown-up who is with you now. You deserve real-world help from an adult, not a game response.' },
    { pattern:/\b(kill someone|hurt someone|make a bomb|build a bomb|make a weapon|gun instructions|weapon instructions)\b/i, kind:'harm', message:'I can’t help with instructions for hurting someone or making a weapon. I can switch this into a safe science, law, feelings or problem-solving activity instead.' },
    { pattern:/\b(sex|porn|nudes|naked pictures|sexual)\b/i, kind:'adult', message:'That topic needs a trusted grown-up and an age-appropriate source. This children’s version won’t turn explicit sexual content into a game.' },
    { pattern:/\b(parent pin|parent code|what is the pin|show me the password|bypass|unlock parent|disable safety|ignore safety|remove safety)\b/i, kind:'security', message:'Child chat cannot reveal or change Parent Studio security or safety settings. A grown-up can manage those controls in the private adult area.' }
  ];

  function clean(value, max=180){
    return String(value || '').replace(/[<>\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
  }

  function tokenScore(text, route){
    let score = 0;
    route.keywords.forEach(keyword => {
      if(text.includes(keyword)) score += keyword.includes(' ') ? 7 : 5;
    });
    return score;
  }

  function profileScore(route, context){
    let score = 0;
    const interests = Array.isArray(context.interests) ? context.interests : [];
    route.interests.forEach(interest => { if(interests.includes(interest)) score += 2; });
    const focus = String(context.currentFocus || '').toLowerCase();
    if(route.id === 'routine' && /(morning|bedtime|listening|confidence|trying something new)/.test(focus)) score += 2;
    if(route.id === 'family' && /(sharing|turn-taking|family)/.test(focus)) score += 2;
    if(route.id === 'kitchen' && /family cooking/.test(focus)) score += 3;
    return score;
  }

  function fallbackRoute(context){
    const age = context.ageBand || '7-9';
    const interests = Array.isArray(context.interests) ? context.interests : [];
    const byInterest = ROUTES.find(route => route.interests.some(item => interests.includes(item)) && !['news','family'].includes(route.id));
    if(byInterest) return byInterest;
    if(age === '0-2' || age === '2-4') return ROUTES.find(route => route.id === 'story');
    if(age === '4-6') return ROUTES.find(route => route.id === 'maker');
    if(age === '7-9') return ROUTES.find(route => route.id === 'science');
    return ROUTES.find(route => route.id === 'evidence');
  }

  function ageMessage(route, ageBand){
    const label = AGE_LABELS[ageBand] || 'Explorer';
    if(ageBand === '0-2') return `${label} mode keeps this parent-led and shared. Orish will use looking, listening, simple language and grown-up participation rather than independent chat.`;
    if(ageBand === '2-4') return `${label} mode keeps the challenge short, visual and supported by a grown-up.`;
    if(ageBand === '4-6') return `${label} mode uses simple choices, read-aloud support and concrete examples.`;
    if(ageBand === '7-9') return `${label} mode adds clues, explanations and a clear mission goal.`;
    if(ageBand === '10-12') return `${label} mode adds evidence, multi-step reasoning and stronger independence.`;
    return `${label} mode uses mature language, competing explanations, evidence quality, uncertainty and defensible conclusions.`;
  }

  function getSafetyResponse(text){
    return SAFETY.find(item => item.pattern.test(text)) || null;
  }

  function makePlan(prompt, context={}){
    const cleanPrompt = clean(prompt);
    const text = cleanPrompt.toLowerCase();
    const safety = getSafetyResponse(text);
    if(safety){
      return {
        ok:false,
        safety:true,
        kind:safety.kind,
        prompt:cleanPrompt,
        response:safety.message,
        primary:null,
        alternatives:[]
      };
    }

    const ranked = ROUTES.map(route => ({ route, score:tokenScore(text, route) + profileScore(route, context) }))
      .sort((a,b) => b.score - a.score || ROUTES.indexOf(a.route) - ROUTES.indexOf(b.route));
    let primary = ranked[0] && ranked[0].score > 0 ? ranked[0].route : fallbackRoute(context);

    // Broad requests should use the profile as a guide rather than always choosing the first keyword-free route.
    if(/^(make me|give me|i want|can we do|what can we do|surprise me)/.test(text) && ranked[0]?.score < 5){
      primary = fallbackRoute(context);
    }

    const alternatives = ranked
      .filter(item => item.route.id !== primary.id && item.score > 0)
      .slice(0,2)
      .map(item => item.route);

    if(alternatives.length < 2){
      ['story','maker','evidence','science','maths','mission'].forEach(id => {
        if(alternatives.length >= 2 || id === primary.id || alternatives.some(item => item.id === id)) return;
        const route = ROUTES.find(item => item.id === id);
        if(route) alternatives.push(route);
      });
    }

    const profileNote = Array.isArray(context.interests) && context.interests.length
      ? `I also considered the saved interests for this local profile (${context.interests.slice(0,3).join(', ')}).`
      : 'No saved interest was needed to choose this route.';

    return {
      ok:true,
      safety:false,
      prompt:cleanPrompt,
      primary,
      alternatives:alternatives.slice(0,2),
      response:`I’d turn that into ${primary.label}. ${primary.reason}`,
      ageMessage:ageMessage(primary, context.ageBand || '7-9'),
      profileNote,
      decision:{
        engine:primary.launcher,
        routeId:primary.id,
        subject:primary.subject,
        approvedTemplateOnly:true,
        arbitraryCode:false,
        networkRequired:false
      }
    };
  }

  function getRoutes(){ return ROUTES.map(route => ({...route, keywords:[...route.keywords], interests:[...route.interests]})); }

  window.OrishIntelligence = Object.freeze({ makePlan, getRoutes, ageMessage });
})();
