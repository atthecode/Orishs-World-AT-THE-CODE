(() => {
  'use strict';

  const games = {
    '0-2': {
      icon:'🧸', title:'First, Then, Together', subject:'Early learning', mode:'guided',
      instruction:'Grown-up: read each picture aloud. Help your child notice what happens first, next and last. Move the cards together. There is no timer or score.',
      objective:'Share attention, hear simple sequence words and notice a familiar three-step routine with an adult.',
      steps:[
        {id:'hands-water',icon:'💧',label:'Hands under water',detail:'First, wet hands together.'},
        {id:'hands-soap',icon:'🫧',label:'Soap and rub',detail:'Next, rub the soap over hands.'},
        {id:'hands-dry',icon:'🧻',label:'Dry hands',detail:'Last, dry hands together.'}
      ],
      hint:'Listen for the words first, next and last.'
    },
    '2-4': {
      icon:'🌱', title:'Little Story Order', subject:'Understanding the world', mode:'supported',
      instruction:'Put the pictures in the order that makes sense for planting a seed. A grown-up can help read the words.',
      objective:'Order three familiar events and use first, next and last to describe a simple process.',
      steps:[
        {id:'soil',icon:'🪴',label:'Put soil in the pot',detail:'The pot needs soil first.'},
        {id:'seed',icon:'🌰',label:'Put in the seed',detail:'The seed goes into the soil.'},
        {id:'water',icon:'💧',label:'Give it some water',detail:'Water comes after planting.'}
      ],
      hint:'What must be in the pot before the seed can be planted?'
    },
    '4-6': {
      icon:'🥪', title:'Snack-Making Sequence', subject:'Life skills & Literacy', mode:'supported',
      instruction:'Put the safe picture steps in a sensible order. This is a pretend sequencing game, not a real cooking instruction.',
      objective:'Order four events, follow a simple procedure and explain why one step needs to happen before another.',
      steps:[
        {id:'wash',icon:'🧼',label:'Wash hands',detail:'Clean hands come before handling food.'},
        {id:'plate',icon:'🍽️',label:'Get a plate ready',detail:'Prepare the work space.'},
        {id:'build',icon:'🥪',label:'Build the snack',detail:'Put the prepared ingredients together with an adult if needed.'},
        {id:'tidy',icon:'✨',label:'Tidy the space',detail:'Finish by putting the area back in order.'}
      ],
      hint:'Which step should happen before touching food?'
    },
    '7-9': {
      icon:'💧', title:'Water Cycle Route', subject:'Science', mode:'independent',
      instruction:'Rebuild the water-cycle route. Move each process into the order that follows one journey of water through the cycle.',
      objective:'Sequence evaporation, condensation, precipitation and collection, and explain how the stages connect in a cycle.',
      steps:[
        {id:'evaporation',icon:'☀️',label:'Evaporation',detail:'Liquid water gains energy and becomes water vapour.'},
        {id:'condensation',icon:'☁️',label:'Condensation',detail:'Water vapour cools and forms tiny droplets.'},
        {id:'precipitation',icon:'🌧️',label:'Precipitation',detail:'Water falls from clouds as rain, snow or other precipitation.'},
        {id:'collection',icon:'🌊',label:'Collection',detail:'Water gathers in rivers, lakes, oceans and the ground before the cycle continues.'}
      ],
      hint:'Cloud droplets form after water vapour cools.'
    },
    '10-12': {
      icon:'🧪', title:'Fair-Test Planner', subject:'Science & Critical Thinking', mode:'independent',
      instruction:'Put the investigation steps into a strong scientific order. Think about what needs to be decided before measurements are collected.',
      objective:'Plan a fair test by sequencing a question, variables, controls, measurements, analysis and conclusion.',
      steps:[
        {id:'question',icon:'❓',label:'Write the testable question',detail:'Be clear about what you are trying to find out.'},
        {id:'variable',icon:'🎚️',label:'Choose the variable to change',detail:'Decide the independent variable.'},
        {id:'controls',icon:'🧷',label:'Keep key conditions controlled',detail:'Identify what should stay the same for a fair comparison.'},
        {id:'measure',icon:'📏',label:'Collect measurements',detail:'Run the test and record observations or measurements.'},
        {id:'analyse',icon:'📊',label:'Compare the results',detail:'Look for patterns and differences in the evidence.'},
        {id:'conclude',icon:'🧠',label:'Write an evidence-based conclusion',detail:'Answer the question using the results and note uncertainty.'}
      ],
      hint:'A conclusion should come after the evidence has been collected and compared.'
    },
    '13-16': {
      icon:'🧭', title:'Investigation Dependency Planner', subject:'Science & Critical Thinking', mode:'independent',
      instruction:'Build a defensible investigation plan. Some steps depend on earlier decisions, so order matters. The final plan should move from question and design through evidence, analysis and evaluation.',
      objective:'Sequence a multi-stage investigation while recognising dependencies, controls, evidence analysis and limitations.',
      steps:[
        {id:'question',icon:'🎯',label:'Define the research question',detail:'State a focused question that can be investigated with available evidence.'},
        {id:'variables',icon:'🧩',label:'Operationalise variables and measures',detail:'Define what will change, what will be measured and how measurements will be made.'},
        {id:'risk',icon:'🛡️',label:'Set controls, ethics and safety boundaries',detail:'Identify confounders, control conditions, ethical limits and practical risks before collecting data.'},
        {id:'baseline',icon:'📍',label:'Collect baseline or comparison data',detail:'Establish a reference point or comparison condition where the design requires one.'},
        {id:'trial',icon:'🧪',label:'Run the planned trial and record data',detail:'Follow the protocol consistently and preserve observations.'},
        {id:'analyse',icon:'📈',label:'Analyse patterns and uncertainty',detail:'Compare evidence, quantify where appropriate and avoid overstating what the data show.'},
        {id:'evaluate',icon:'🔎',label:'Evaluate limitations and next steps',detail:'Consider alternative explanations, weaknesses, reliability and what would strengthen the conclusion.'}
      ],
      dependencies:{
        variables:['question'], risk:['question','variables'], baseline:['question','variables','risk'], trial:['question','variables','risk','baseline'], analyse:['trial'], evaluate:['analyse']
      },
      hint:'Data collection should not begin until the question, measures and safety/control decisions are clear.'
    }
  };

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function get(ageBand){ return {ageBand, ...clone(games[ageBand] || games['7-9'])}; }
  function canonicalIds(game){ return game.steps.map(step=>step.id); }
  function isCorrect(game, order){
    if (!game || !Array.isArray(order) || order.length !== game.steps.length) return false;
    return canonicalIds(game).every((id,index)=>order[index]===id);
  }
  function firstProblem(game, order){
    const canonical=canonicalIds(game);
    for(let i=0;i<canonical.length;i+=1){
      if(order[i]!==canonical[i]) return {index:i, expected:canonical[i], actual:order[i]};
    }
    return null;
  }

  window.OrishSequencingGame={get,isCorrect,firstProblem,ageBands:Object.keys(games)};
})();
