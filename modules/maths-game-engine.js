(() => {
  'use strict';

  const games = {
    '0-2': {
      ageLabel:'0–2 Parent & Baby', icon:'🔢', title:'Number Play Together', mode:'guided', subject:'Mathematics', difficulty:'Shared number play',
      instruction:'Grown-up and child explore quantity, size and shape together. Point, count and say the words — there is no independent score.',
      objective:'Explore early quantity words, one/more, big/small and simple shape language through shared play.',
      topics:['Quantity','Size','Shape','Pattern'],
      rounds:[
        {topic:'Quantity',prompt:'Which group has MORE stars?',visual:{type:'groups',groups:[{icon:'⭐',count:1,label:'one star'},{icon:'⭐',count:3,label:'three stars'}]},input:'choice',options:['One star','Three stars'],answer:1,hint:'Count slowly together: one… then one, two, three.',explanation:'Three is more than one.'},
        {topic:'Quantity',prompt:'Can you find ONE moon?',visual:{type:'groups',groups:[{icon:'🌙',count:1,label:'one moon'},{icon:'🌙',count:2,label:'two moons'}]},input:'choice',options:['One moon','Two moons'],answer:0,hint:'Point to each moon as you count.',explanation:'This group has one moon.'},
        {topic:'Size',prompt:'Which shape looks BIGGER?',visual:{type:'sizes',items:[{icon:'●',size:'small',label:'small circle'},{icon:'●',size:'large',label:'big circle'}]},input:'choice',options:['Small circle','Big circle'],answer:1,hint:'Compare them side by side.',explanation:'The second circle is bigger.'},
        {topic:'Pattern',prompt:'What comes next? 🔵 🟡 🔵 …',visual:{type:'sequence',items:['🔵','🟡','🔵','?']},input:'choice',options:['🔵','🟡'],answer:1,hint:'The colours are taking turns.',explanation:'Blue, yellow, blue, yellow.'}
      ]
    },
    '2-4': {
      ageLabel:'2–4 Early Explorer', icon:'🧮', title:'Count & Shape Adventure', mode:'supported', subject:'Mathematics', difficulty:'Early counting',
      instruction:'Count small groups, compare amounts and notice simple shapes and patterns. Take your time — there is no timer.',
      objective:'Count small groups, compare quantities and recognise simple shapes and repeating patterns.',
      topics:['Counting','Compare','Shapes','Patterns'],
      rounds:[
        {topic:'Counting',prompt:'How many rockets can you see?',visual:{type:'objects',icon:'🚀',count:3},input:'choice',options:['2','3','4'],answer:1,hint:'Touch or point to each rocket once.',explanation:'There are 3 rockets.'},
        {topic:'Compare',prompt:'Which number is bigger?',visual:{type:'numbers',items:['4','2']},input:'choice',options:['4','2'],answer:0,hint:'Imagine four blocks and two blocks.',explanation:'Four is bigger than two.'},
        {topic:'Shapes',prompt:'Which one is a triangle?',visual:{type:'shapes',items:['●','▲','■']},input:'choice',options:['Circle','Triangle','Square'],answer:1,hint:'A triangle has three sides.',explanation:'▲ is a triangle.'},
        {topic:'Patterns',prompt:'What comes next? 🍎 🍌 🍎 🍌 …',visual:{type:'sequence',items:['🍎','🍌','🍎','🍌','?']},input:'choice',options:['🍎','🍌'],answer:0,hint:'Look at the repeating pair.',explanation:'Apple comes next.'}
      ]
    },
    '4-6': {
      ageLabel:'4–6 Little Explorer', icon:'➕', title:'Number Rescue', mode:'supported', subject:'Mathematics', difficulty:'Early arithmetic',
      instruction:'Use number bonds, simple addition and subtraction, halves and measurement clues to rescue each answer.',
      objective:'Use number bonds, simple addition/subtraction, early fractions and measurement language in context.',
      topics:['Addition','Subtraction','Fractions','Measure','Geometry'],
      rounds:[
        {topic:'Addition',prompt:'3 stars join 2 more stars. How many altogether?',visual:{type:'equation',text:'3 + 2 = ?'},input:'number',answer:5,hint:'Start at 3 and count on two: 4, 5.',explanation:'3 + 2 = 5.'},
        {topic:'Subtraction',prompt:'There are 7 apples. 3 are used. How many are left?',visual:{type:'equation',text:'7 − 3 = ?'},input:'number',answer:4,hint:'Count back three from 7.',explanation:'7 − 3 = 4.'},
        {topic:'Fractions',prompt:'Which picture shows ONE HALF?',visual:{type:'fractions',items:[{filled:1,total:2,label:'one half'},{filled:1,total:4,label:'one quarter'},{filled:3,total:4,label:'three quarters'}]},input:'choice',options:['1 of 2 equal parts','1 of 4 equal parts','3 of 4 equal parts'],answer:0,hint:'A half means one of two equal parts.',explanation:'1 out of 2 equal parts is one half.'},
        {topic:'Measure',prompt:'A ribbon is 8 cm long. Another is 5 cm. How much longer is the first ribbon?',visual:{type:'bars',items:[{label:'Ribbon A',value:8,max:8},{label:'Ribbon B',value:5,max:8}]},input:'number',answer:3,hint:'Find the difference: 8 − 5.',explanation:'The difference is 3 cm.'},
        {topic:'Geometry',prompt:'How many sides does a rectangle have?',visual:{type:'shape',shape:'▭',label:'rectangle'},input:'choice',options:['3','4','5'],answer:1,hint:'Trace each straight side around the shape.',explanation:'A rectangle has 4 sides.'}
      ]
    },
    '7-9': {
      ageLabel:'7–9 Growing Explorer', icon:'🧩', title:'Maths Mission Deck', mode:'independent', subject:'Mathematics', difficulty:'Fluency + reasoning',
      instruction:'Solve a mixed mission using multiplication, fractions, money, measurement and geometry. Explain with numbers, not speed.',
      objective:'Use multiplication, division, fractions, money, measurement and geometry to solve age-appropriate problems.',
      topics:['Times tables','Fractions','Money','Measure','Geometry'],
      rounds:[
        {topic:'Times tables',prompt:'A rover has 6 wheels. How many wheels do 4 rovers have?',visual:{type:'equation',text:'4 × 6 = ?'},input:'number',answer:24,hint:'Use four groups of six.',explanation:'4 × 6 = 24.'},
        {topic:'Fractions',prompt:'Which fraction is equivalent to 1/2?',visual:{type:'fractionText',items:['2/4','2/3','3/4']},input:'choice',options:['2/4','2/3','3/4'],answer:0,hint:'Multiply the top and bottom of 1/2 by the same number.',explanation:'1/2 = 2/4.'},
        {topic:'Money',prompt:'A notebook costs £2.35 and a pen costs £1.40. What is the total?',visual:{type:'money',items:['£2.35','£1.40']},input:'number',answer:3.75,tolerance:0.001,suffix:'£',hint:'Add pounds and pence carefully.',explanation:'£2.35 + £1.40 = £3.75.'},
        {topic:'Measure',prompt:'A walk is 1.2 km. How many metres is that?',visual:{type:'equation',text:'1.2 km = ? m'},input:'number',answer:1200,hint:'1 kilometre = 1000 metres.',explanation:'1.2 km = 1200 m.'},
        {topic:'Geometry',prompt:'A rectangle is 7 cm long and 3 cm wide. What is its perimeter?',visual:{type:'rectangle',width:7,height:3},input:'number',answer:20,hint:'Perimeter means all the way around: 7 + 3 + 7 + 3.',explanation:'The perimeter is 20 cm.'}
      ]
    },
    '10-12': {
      ageLabel:'10–12 Big Explorer', icon:'📐', title:'Quant Lab', mode:'independent', subject:'Mathematics', difficulty:'Multi-step reasoning',
      instruction:'Use fractions, percentages, ratios, geometry and data. Work carefully and use hints if you need them.',
      objective:'Apply fractions, percentages, ratio, geometry and data reasoning to multi-step problems.',
      topics:['Fractions','Percent','Ratio','Geometry','Data'],
      rounds:[
        {topic:'Fractions',prompt:'Calculate 3/4 of 28.',visual:{type:'equation',text:'¾ × 28 = ?'},input:'number',answer:21,hint:'Find one quarter first, then multiply by three.',explanation:'28 ÷ 4 = 7, and 7 × 3 = 21.'},
        {topic:'Percent',prompt:'A £60 item is reduced by 25%. What is the sale price?',visual:{type:'bars',items:[{label:'Original',value:60,max:60},{label:'25% discount',value:15,max:60}]},input:'number',answer:45,hint:'25% is one quarter. Find a quarter of £60, then subtract it.',explanation:'25% of £60 is £15, so the price is £45.'},
        {topic:'Ratio',prompt:'Red and blue beads are in the ratio 2:3. There are 20 red beads. How many blue beads?',visual:{type:'ratio',left:{label:'Red',parts:2,value:20},right:{label:'Blue',parts:3,value:'?'}},input:'number',answer:30,hint:'If 2 parts = 20, one part = 10.',explanation:'3 parts × 10 = 30 blue beads.'},
        {topic:'Geometry',prompt:'A triangle has base 12 cm and perpendicular height 7 cm. What is its area?',visual:{type:'triangle',base:12,height:7},input:'number',answer:42,hint:'Area of a triangle = 1/2 × base × height.',explanation:'½ × 12 × 7 = 42 cm².'},
        {topic:'Data',prompt:'The values are 6, 8, 8, 10, 13. What is the median?',visual:{type:'data',items:[6,8,8,10,13]},input:'number',answer:8,hint:'Put the values in order and find the middle one.',explanation:'The middle value is 8.'},
        {topic:'Probability',prompt:'A bag has 3 red, 2 blue and 5 green counters. What is the probability of choosing blue?',visual:{type:'fractionText',items:['2 blue','10 total']},input:'choice',options:['1/5','1/2','2/5'],answer:0,hint:'Probability = favourable outcomes ÷ total outcomes.',explanation:'2/10 simplifies to 1/5.'}
      ]
    },
    '13-16': {
      ageLabel:'13–16 Teen Explorer', icon:'📊', title:'Quantitative Reasoning Lab', mode:'independent', subject:'Mathematics', difficulty:'Advanced reasoning',
      instruction:'Use algebra, rates, probability, geometry and data interpretation. The goal is defensible reasoning, not fast answers.',
      objective:'Apply algebraic, proportional, geometric, statistical and probabilistic reasoning to unfamiliar problems.',
      topics:['Algebra','Rates','Probability','Geometry','Statistics','Graphs'],
      rounds:[
        {topic:'Algebra',prompt:'Solve 3x + 7 = 31.',visual:{type:'equation',text:'3x + 7 = 31'},input:'number',answer:8,hint:'Undo +7 first, then divide by 3.',explanation:'3x = 24, so x = 8.'},
        {topic:'Rates',prompt:'A vehicle travels 168 km in 2.4 hours. What is its average speed in km/h?',visual:{type:'equation',text:'speed = distance ÷ time'},input:'number',answer:70,hint:'Divide 168 by 2.4.',explanation:'168 ÷ 2.4 = 70 km/h.'},
        {topic:'Probability',prompt:'Two fair coins are tossed. What is the probability of getting exactly one head?',visual:{type:'outcomes',items:['HH','HT','TH','TT']},input:'choice',options:['1/4','1/2','3/4'],answer:1,hint:'List all equally likely outcomes, then count HT and TH.',explanation:'2 of 4 outcomes have exactly one head, so the probability is 1/2.'},
        {topic:'Geometry',prompt:'A right-angled triangle has shorter sides 9 cm and 12 cm. Find the hypotenuse.',visual:{type:'triangle',base:12,height:9,right:true},input:'number',answer:15,hint:'Use a² + b² = c².',explanation:'9² + 12² = 225, so c = 15.'},
        {topic:'Statistics',prompt:'A dataset has mean 18 for 5 values. What is the total of the 5 values?',visual:{type:'equation',text:'mean = total ÷ number of values'},input:'number',answer:90,hint:'Rearrange: total = mean × number of values.',explanation:'18 × 5 = 90.'},
        {topic:'Graphs',prompt:'A graph rises from 12 to 18. What is the percentage increase?',visual:{type:'bars',items:[{label:'Start',value:12,max:18},{label:'End',value:18,max:18}]},input:'number',answer:50,hint:'Increase = 6. Divide the increase by the original 12, then ×100.',explanation:'6/12 × 100 = 50%.'}
      ]
    }
  };

  function get(ageBand){ return JSON.parse(JSON.stringify(games[ageBand] || games['7-9'])); }
  function evaluate(round,value){
    if(round.input==='choice') return Number(value)===Number(round.answer);
    const raw=String(value??'').trim().replace(/£|,|%|cm²|cm|km\/h|km|m/g,'');
    const n=Number(raw);
    if(!Number.isFinite(n)) return false;
    const tolerance=round.tolerance ?? 0.000001;
    return Math.abs(n-Number(round.answer))<=tolerance;
  }
  window.OrishMaths = { get, evaluate };
})();
