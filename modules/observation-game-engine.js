(() => {
  'use strict';

  const content = {
    '0-2': {
      icon:'⭐', title:'Together Look & Find', subject:'Early learning', mode:'guided', type:'hidden',
      instruction:'Grown-up: name one picture at a time and help your child point or tap when they notice it. There is no timer or score.',
      objective:'Share attention, notice familiar visual features and practise simple object recognition with an adult.',
      targets:['sun','star'],
      scene:[
        {id:'sun',icon:'☀️',label:'Sun',x:16,y:22,target:true},
        {id:'cloud',icon:'☁️',label:'Cloud',x:52,y:18},
        {id:'star',icon:'⭐',label:'Star',x:76,y:42,target:true},
        {id:'tree',icon:'🌳',label:'Tree',x:25,y:70},
        {id:'ball',icon:'🔵',label:'Blue ball',x:63,y:76}
      ]
    },
    '2-4': {
      icon:'🔎', title:'Little Explorer Find-It', subject:'Early learning', mode:'supported', type:'hidden',
      instruction:'Find the three special pictures. You can tap each one when you spot it. Take as long as you need.',
      objective:'Practise visual scanning, vocabulary and sustained attention through a calm find-it activity.',
      targets:['bee','apple','moon'],
      scene:[
        {id:'bee',icon:'🐝',label:'Bee',x:18,y:22,target:true},
        {id:'flower',icon:'🌼',label:'Flower',x:49,y:24},
        {id:'apple',icon:'🍎',label:'Apple',x:78,y:19,target:true},
        {id:'tree',icon:'🌳',label:'Tree',x:24,y:66},
        {id:'moon',icon:'🌙',label:'Moon',x:58,y:58,target:true},
        {id:'house',icon:'🏠',label:'House',x:83,y:72}
      ]
    },
    '4-6': {
      icon:'👀', title:'Spot What Changed', subject:'Science', mode:'independent', type:'compare',
      instruction:'Look at Scene A, then find the three things that changed in Scene B. Tap the changed objects.',
      objective:'Compare two visual scenes, identify differences and describe observable changes.',
      changes:['rocket','planet','flag'],
      before:[
        {id:'rocket',icon:'🚀',label:'Rocket',x:18,y:58},
        {id:'planet',icon:'🌍',label:'Blue-green planet',x:44,y:25},
        {id:'star',icon:'⭐',label:'Star',x:72,y:18},
        {id:'flag',icon:'🚩',label:'Red flag',x:77,y:69},
        {id:'moon',icon:'🌙',label:'Moon',x:48,y:72}
      ],
      after:[
        {id:'rocket',icon:'🛸',label:'Flying saucer',x:18,y:58,changed:true},
        {id:'planet',icon:'🪐',label:'Ringed planet',x:44,y:25,changed:true},
        {id:'star',icon:'⭐',label:'Star',x:72,y:18},
        {id:'flag',icon:'🏳️',label:'White flag',x:77,y:69,changed:true},
        {id:'moon',icon:'🌙',label:'Moon',x:48,y:72}
      ]
    },
    '7-9': {
      icon:'🛰️', title:'Signal Deck: Evidence Hunt', subject:'Science', mode:'independent', type:'compare',
      instruction:'Compare the two signal-deck scenes. Find four observable changes before deciding what the evidence shows.',
      objective:'Use careful observation to identify changes, separate direct evidence from guesses and explain a simple conclusion.',
      changes:['antenna','planet','sample','screen'],
      before:[
        {id:'antenna',icon:'📡',label:'Antenna pointing left',x:17,y:28},
        {id:'planet',icon:'🌎',label:'Earth-like planet',x:47,y:19},
        {id:'sample',icon:'🪨',label:'Grey rock sample',x:77,y:31},
        {id:'screen',icon:'📉',label:'Falling graph',x:27,y:73},
        {id:'tool',icon:'🔧',label:'Spanner',x:57,y:66},
        {id:'light',icon:'💡',label:'Lamp',x:82,y:74}
      ],
      after:[
        {id:'antenna',icon:'📡',label:'Antenna pointing right',x:17,y:28,changed:true,transform:'scaleX(-1)'},
        {id:'planet',icon:'🔴',label:'Red planet',x:47,y:19,changed:true},
        {id:'sample',icon:'💎',label:'Crystal sample',x:77,y:31,changed:true},
        {id:'screen',icon:'📈',label:'Rising graph',x:27,y:73,changed:true},
        {id:'tool',icon:'🔧',label:'Spanner',x:57,y:66},
        {id:'light',icon:'💡',label:'Lamp',x:82,y:74}
      ],
      reasoning:{
        prompt:'Which statement is definitely supported by what you can see?',
        options:[
          {id:'a',text:'The crystal caused the graph to rise.',correct:false},
          {id:'b',text:'The graph changed from falling to rising.',correct:true},
          {id:'c',text:'An alien moved the antenna.',correct:false}
        ],
        explain:'“The graph changed from falling to rising” is a direct observation. The other statements add causes that the picture alone cannot prove.'
      }
    },
    '10-12': {
      icon:'🧪', title:'Evidence Scan: Lab Change', subject:'Science', mode:'independent', type:'compare',
      instruction:'Inspect the before-and-after lab scenes. Identify all five changes, then choose the conclusion that stays closest to the evidence.',
      objective:'Distinguish observation from inference while comparing variables and visible evidence in an investigation.',
      changes:['thermometer','beaker','graph','lamp','label'],
      before:[
        {id:'thermometer',icon:'🌡️',label:'Thermometer: 20°C',x:14,y:23},
        {id:'beaker',icon:'🧪',label:'Blue solution',x:43,y:31},
        {id:'graph',icon:'📉',label:'Downward graph',x:75,y:22},
        {id:'lamp',icon:'💡',label:'Lamp off',x:23,y:72},
        {id:'label',icon:'A',label:'Sample A',x:53,y:72},
        {id:'timer',icon:'⏱️',label:'Timer',x:82,y:70}
      ],
      after:[
        {id:'thermometer',icon:'🌡️',label:'Thermometer: 32°C',x:14,y:23,changed:true,badge:'32°C'},
        {id:'beaker',icon:'🧪',label:'Green solution',x:43,y:31,changed:true,badge:'GREEN'},
        {id:'graph',icon:'📈',label:'Upward graph',x:75,y:22,changed:true},
        {id:'lamp',icon:'🔆',label:'Lamp on',x:23,y:72,changed:true},
        {id:'label',icon:'B',label:'Sample B',x:53,y:72,changed:true},
        {id:'timer',icon:'⏱️',label:'Timer',x:82,y:70}
      ],
      reasoning:{
        prompt:'Which is the safest evidence-based statement?',
        options:[
          {id:'a',text:'The lamp definitely caused every other change.',correct:false},
          {id:'b',text:'Several conditions and measurements are different between the two scenes.',correct:true},
          {id:'c',text:'Sample B is scientifically better than Sample A.',correct:false}
        ],
        explain:'You can observe several differences, but this picture alone does not isolate a single cause or prove which sample is “better”.'
      }
    },
    '13-16': {
      icon:'🔬', title:'Evidence Lab: Observation vs Inference', subject:'Science', mode:'independent', type:'compare',
      instruction:'Treat this like an evidence review. Find six material changes, then select the statement that reports only what is directly supported.',
      objective:'Evaluate visual evidence, identify material changes, and distinguish direct observation from causal inference or unsupported explanation.',
      changes:['sensor','sample','graph','temperature','status','timestamp'],
      before:[
        {id:'sensor',icon:'📡',label:'Sensor status: standby',x:13,y:22,badge:'STANDBY'},
        {id:'sample',icon:'◼️',label:'Sample: dark solid',x:42,y:28,badge:'S-14'},
        {id:'graph',icon:'📊',label:'Graph: stable',x:75,y:23,badge:'FLAT'},
        {id:'temperature',icon:'🌡️',label:'Temperature: 18.4°C',x:18,y:70,badge:'18.4°C'},
        {id:'status',icon:'✅',label:'System status: normal',x:49,y:70,badge:'NORMAL'},
        {id:'timestamp',icon:'🕘',label:'Timestamp: 09:10',x:80,y:69,badge:'09:10'},
        {id:'control',icon:'C',label:'Control reference C',x:56,y:44,badge:'CONTROL'}
      ],
      after:[
        {id:'sensor',icon:'📡',label:'Sensor status: active',x:13,y:22,badge:'ACTIVE',changed:true},
        {id:'sample',icon:'🔷',label:'Sample: blue crystal',x:42,y:28,badge:'S-14',changed:true},
        {id:'graph',icon:'📈',label:'Graph: sharp increase',x:75,y:23,badge:'RISING',changed:true},
        {id:'temperature',icon:'🌡️',label:'Temperature: 27.9°C',x:18,y:70,badge:'27.9°C',changed:true},
        {id:'status',icon:'⚠️',label:'System status: review',x:49,y:70,badge:'REVIEW',changed:true},
        {id:'timestamp',icon:'🕙',label:'Timestamp: 10:05',x:80,y:69,badge:'10:05',changed:true},
        {id:'control',icon:'C',label:'Control reference C',x:56,y:44,badge:'CONTROL'}
      ],
      reasoning:{
        prompt:'Which statement is a direct observation rather than an inference?',
        options:[
          {id:'a',text:'Activating the sensor caused the sample to crystallise.',correct:false},
          {id:'b',text:'Between the two scenes, temperature rose from 18.4°C to 27.9°C and the graph changed from stable to rising.',correct:true},
          {id:'c',text:'The experiment succeeded because the status changed to REVIEW.',correct:false}
        ],
        explain:'The supported statement reports visible measurements and changes only. Causal explanations need a controlled investigation and more evidence.'
      }
    }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function get(ageBand) { return { ageBand, ...clone(content[ageBand] || content['7-9']) }; }

  window.OrishObservationGame = { get, ageBands:Object.keys(content) };
})();
