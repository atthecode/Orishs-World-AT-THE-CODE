(() => {
  'use strict';

  const SOURCES = [
    {id:'nasa-uap', org:'NASA', title:'UAP FAQs', url:'https://science.nasa.gov/uap/faqs/', note:'NASA says it has not found credible evidence of extraterrestrial life and there is no evidence that UAP are extraterrestrial.'},
    {id:'nasa-exoplanets', org:'NASA', title:'How many exoplanets are there?', url:'https://science.nasa.gov/exoplanets/how-many-exoplanets-are-there/', note:'NASA tracks more than 6,200 confirmed exoplanets as of 2026, with many more candidates.'},
    {id:'nasa-life', org:'NASA', title:'Are We Alone? Search for Life', url:'https://science.nasa.gov/exoplanets/search-for-life/', note:'The search for life beyond Earth is active science, but so far there is no confirmed evidence of life beyond Earth.'},
    {id:'aaro', org:'U.S. Department of Defense / AARO', title:'Historical Record Report, Volume 1', url:'https://media.defense.gov/2024/Mar/08/2003409233/-1/-1/0/HRR-VOL-I-REPORT-08-MARCH-2024.PDF', note:'AARO reported no evidence that reviewed UAP cases confirmed extraterrestrial technology; unresolved cases often lack enough quality data.'},
    {id:'eshed', org:'The Jerusalem Post', title:'Former Israeli space security chief says aliens exist, humanity not ready', url:'https://www.jpost.com/omg/former-israeli-space-security-chief-says-aliens-exist-humanity-not-ready-651405', note:'This records Haim Eshed’s 2020 claim about a “Galactic Federation”; the claim itself is not independently verified evidence.'}
  ];

  const AGE = {
    '0-2': {label:'Together Space Wonder', mode:'guided', intro:'Grown-up led: look at stars, planets and pictures together. The goal is wonder, not proving scary or extraordinary claims.'},
    '2-4': {label:'Little Space Wonder', mode:'supported', intro:'Short, visual and grown-up supported: planets are real, life beyond Earth is a question scientists are still investigating.'},
    '4-6': {label:'Curious Space Explorer', mode:'supported', intro:'Sort “we know”, “maybe” and “not proven yet” with simple examples and read-aloud support.'},
    '7-9': {label:'Evidence Explorer', mode:'independent', intro:'Compare a claim with what observations and trusted scientific sources actually establish.'},
    '10-12': {label:'Astrobiology Investigator', mode:'independent', intro:'Use exoplanets, biosignatures, UAP data quality and source checking to build a careful conclusion.'},
    '13-16': {label:'Advanced Evidence Analyst', mode:'independent', intro:'Evaluate extraordinary claims, authority versus evidence, alternative explanations, replication, uncertainty and what would count as confirmation.'}
  };

  const STAGES = [
    {
      id:'known', icon:'🪐', title:'What do we actually know?', kind:'known',
      visual:'planet',
      prompt:'Which statement is supported by current evidence?',
      facts:[
        'Thousands of planets beyond our solar system have been confirmed.',
        'Scientists search for biosignatures and technosignatures that could indicate life or technology.',
        'Earth is currently the only world where life is confirmed.'
      ],
      choices:['Planets exist beyond our solar system','Scientists have confirmed a Galactic Federation','Every unexplained sighting is an alien craft'], correct:0,
      explanation:'Exoplanets are confirmed by observation. The existence of extraterrestrial life remains an open scientific question.'
    },
    {
      id:'claims', icon:'🗣️', title:'A respected person makes a claim', kind:'claim',
      visual:'signal',
      prompt:'What does Haim Eshed’s statement prove by itself?',
      facts:[
        'Haim Eshed was a senior figure in Israel’s space-security programme.',
        'In 2020 he publicly claimed that extraterrestrials and a “Galactic Federation” existed and had contact with governments.',
        'A person’s expertise can make a claim worth investigating, but credentials are not the same as independently verifiable evidence.'
      ],
      choices:['It proves that Eshed made the claim, not that the claim is true','It proves alien contact happened','It proves every government knows about aliens'], correct:0,
      explanation:'Who says something matters when evaluating a source, but the central question is still: what evidence can other investigators inspect and test?'
    },
    {
      id:'uap', icon:'🛰️', title:'UAP: unknown does not mean alien', kind:'unknown',
      visual:'uap',
      prompt:'If a UAP case is unresolved because the data are poor, what is the best conclusion?',
      facts:[
        'UAP means an observation has not yet been identified from the available information.',
        'NASA says it has no evidence that UAP are extraterrestrial.',
        'AARO says many cases resolve to ordinary objects or phenomena, while some remain unresolved because there is not enough quality data.'
      ],
      choices:['The cause is still unknown until better evidence is available','It must be extraterrestrial','Anything unexplained is proof of advanced technology'], correct:0,
      explanation:'“Unresolved” is a valid scientific result. It describes the limits of the data; it does not identify the cause.'
    },
    {
      id:'proof', icon:'🔬', title:'What would change the answer?', kind:'proof',
      visual:'lab',
      prompt:'Which would be strongest evidence for extraterrestrial life or technology?',
      facts:[
        'Strong evidence should be independently inspectable and testable.',
        'Extraordinary findings should survive attempts to rule out contamination, instrument error and ordinary explanations.',
        'Independent teams should be able to reproduce or confirm the key observations.'
      ],
      choices:['A repeatable, independently verified detection with data other teams can examine','A viral video with no provenance','A famous person saying they know'], correct:0,
      explanation:'Reliable confirmation comes from evidence that survives independent checking, not from fame, secrecy or excitement.'
    }
  ];

  const YOUNGER = {
    '0-2': [
      {id:'known', icon:'🌟', title:'Stars & worlds', prompt:'Grown-up: which idea can we say together?', facts:['There are many stars and worlds in space.','Scientists look and learn using telescopes.'], choices:['We can wonder and learn together'], correct:0, explanation:'Wonder is a great beginning. No baby score is used.'},
      {id:'proof', icon:'🔭', title:'Look carefully', prompt:'Grown-up: what helps us learn about far-away space?', facts:['Telescopes help scientists collect light and information.'], choices:['Careful looking and measuring'], correct:0, explanation:'Scientists learn by observing and measuring.'}
    ],
    '2-4': [
      {id:'known', icon:'🪐', title:'Other planets are real', prompt:'Which is true?', facts:['Scientists have found many planets around other stars.'], choices:['Other planets exist','Every planet has aliens'], correct:0, explanation:'Many planets are real. Life on them is still a question.'},
      {id:'proof', icon:'🔭', title:'How do we find out?', prompt:'What should scientists do?', facts:['Scientists use telescopes and measurements.'], choices:['Look for evidence','Guess'], correct:0, explanation:'Evidence helps us learn what is really there.'}
    ],
    '4-6': [
      {id:'known', icon:'🪐', title:'Know / Maybe / Not yet', prompt:'Which is something we know?', facts:['Scientists have confirmed thousands of planets beyond our solar system.','Scientists have not confirmed life beyond Earth.'], choices:['Other planets exist','Aliens have visited Earth for certain'], correct:0, explanation:'Other planets are confirmed. Alien visits are not confirmed.'},
      {id:'claims', icon:'💬', title:'A claim is not proof', prompt:'Someone says “I know aliens exist.” What should Orish ask?', facts:['People can believe things strongly and still need evidence.'], choices:['What evidence can we check?','How famous are you?'], correct:0, explanation:'Good investigators ask for evidence they can check.'},
      {id:'proof', icon:'🔬', title:'What would help?', prompt:'Which would help scientists most?', facts:['Good evidence can be checked again.'], choices:['Clear measurements that other scientists can verify','A mystery story'], correct:0, explanation:'Repeatable measurements are much stronger than a story alone.'}
    ]
  };

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function ageMeta(ageBand){ return clone(AGE[ageBand] || AGE['7-9']); }
  function stages(ageBand){
    const source = YOUNGER[ageBand] || STAGES;
    return source.map((stage,index)=>({
      visual:stage.visual || (index%2?'signal':'planet'), kind:stage.kind || stage.id,
      ...clone(stage), index, total:source.length
    }));
  }
  function sourceTrail(){ return clone(SOURCES); }
  function sourceCount(){ return SOURCES.length; }
  function integrationMessage(){ return 'If credible evidence changes, this investigation should change with it. Scientific confidence is allowed to update.'; }

  window.OrishAreWeAlone = Object.freeze({ageMeta, stages, sourceTrail, sourceCount, integrationMessage});
})();
