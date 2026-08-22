(() => {
  'use strict';

  const stories = {
    '0-2': {
      icon:'🌟', title:'Orish and the Little Light', subject:'Early learning & Communication', mode:'guided', start:'start',
      instruction:'Grown-up: read the short scenes aloud and choose together. Point, gesture, cuddle or make a sound. There is no right-answer score.',
      objective:'Share attention, hear simple feeling and choice words, and practise a calm two-step interaction with an adult.',
      nodes:{
        start:{scene:'A tiny star-light blinks beside Orish. It is bright, then dim, then bright again.',prompt:'What shall we notice together?',choices:[
          {label:'✨ Point to the little light',to:'notice-light',effect:'You both slow down and look carefully.'},
          {label:'👋 Give the light a little wave',to:'wave-light',effect:'Orish waves too. Shared attention can begin with a tiny action.'}
        ]},
        'notice-light':{scene:'Orish points gently. “Bright… dim… bright.” The light keeps blinking.',prompt:'What can we do next?',choices:[
          {label:'🗣️ Say “light” together',to:'ending',effect:'A simple repeated word helps connect the sound with what you are seeing.'},
          {label:'🤲 Open and close hands with the blink',to:'ending',effect:'Movement can help a little learner notice a repeating pattern.'}
        ]},
        'wave-light':{scene:'The little light blinks again. Orish smiles and makes one slow wave.',prompt:'What can we do together?',choices:[
          {label:'👀 Look, then wave again',to:'ending',effect:'Looking and copying is a shared back-and-forth game.'},
          {label:'🎵 Hum one soft sound together',to:'ending',effect:'A calm shared sound turns the moment into a tiny routine.'}
        ]},
        ending:{ending:true,title:'Shared little moment',scene:'The light settles into a soft glow. Orish says, “We noticed it together.”',reflection:'Grown-up: repeat one favourite word, movement or sound once more. Stop while it is still enjoyable.'}
      }
    },
    '2-4': {
      icon:'🧱', title:'The Tower With Two Builders', subject:'Communication & Early learning', mode:'supported', start:'start',
      instruction:'Help Orish build with a friend. Choices change the story, but mistakes can be repaired. A grown-up can read the words.',
      objective:'Notice turn-taking, simple communication, repair after a mistake, and cause-and-effect in a short story.',
      nodes:{
        start:{scene:'Orish and Kai are building a tall block tower. There is one shiny blue block left, and both reach for it.',prompt:'What could Orish do?',choices:[
          {label:'🗣️ Say “Can I use it next?”',to:'ask-turn',effect:'Kai knows what Orish wants, and they can make a plan.'},
          {label:'✋ Grab it quickly',to:'grab',effect:'Both hands pull at once and the tower wobbles.'}
        ]},
        'ask-turn':{scene:'Kai says, “I’ll put it here, then you choose the next block.” The tower stays steady.',prompt:'What next?',choices:[
          {label:'👍 Say “Okay” and choose another block',to:'ending-good',effect:'Taking turns keeps both builders involved.'},
          {label:'💡 Suggest they place the blue block together',to:'ending-good',effect:'Working together is another way to solve the same problem.'}
        ]},
        grab:{scene:'Bump! The tower falls. Nobody is bad; the plan just did not work.',prompt:'How can Orish repair the moment?',choices:[
          {label:'🧱 Help rebuild and ask for a turn',to:'ending-repair',effect:'Repair means doing something helpful, not only saying sorry.'},
          {label:'🗣️ Say “Let’s try again together”',to:'ending-repair',effect:'A new plan can help both builders restart.'}
        ]},
        'ending-good':{ending:true,title:'Two builders, one plan',scene:'They finish a wide, strong tower and both get to add favourite blocks.',reflection:'Which helped most: asking for a turn or making a plan together?'},
        'ending-repair':{ending:true,title:'A wobble can be repaired',scene:'They rebuild a smaller tower. This time, they agree whose turn comes next.',reflection:'The useful part was the repair: help, communicate, and try a better plan.'}
      }
    },
    '4-6': {
      icon:'🚀', title:'The Mixed-Up Morning Launch', subject:'Personal development & Literacy', mode:'supported', start:'start',
      instruction:'Help Orish get the Morning Rocket ready. Each choice changes what happens next. There is no shame for a mixed-up step — just notice, repair and continue.',
      objective:'Sequence familiar routine steps, communicate about a problem, and connect choices with practical consequences.',
      nodes:{
        start:{scene:'The Morning Rocket is almost ready. Orish has clothes on, but the launch panel says: “Two jobs still waiting.”',prompt:'What should Orish check first?',choices:[
          {label:'🪥 Check teeth and wash-up jobs',to:'check-routine',effect:'Orish looks at the routine instead of guessing.'},
          {label:'🎮 Start a game and hope the jobs disappear',to:'delay',effect:'The jobs are still waiting when the game ends.'}
        ]},
        'check-routine':{scene:'The panel shows: brush teeth, pack water bottle. Orish can see exactly what remains.',prompt:'What is a useful next move?',choices:[
          {label:'✅ Do one job, then the next',to:'ending-ready',effect:'A short sequence makes the morning easier to follow.'},
          {label:'🗣️ Ask a grown-up which one must happen first',to:'ending-ready',effect:'Asking for clear information is a useful strategy.'}
        ]},
        delay:{scene:'The launch timer is not a punishment, but time has passed. Orish now has less room to get ready calmly.',prompt:'What can Orish do now?',choices:[
          {label:'🛠️ Pause the game and finish the two jobs',to:'ending-repair',effect:'Changing course is allowed. A delayed start can still be repaired.'},
          {label:'🗣️ Say “I need help getting back on track”',to:'ending-repair',effect:'Asking for help can prevent rushing and confusion.'}
        ]},
        'ending-ready':{ending:true,title:'Launch sequence complete',scene:'Teeth done. Bottle packed. The Morning Rocket flashes READY.',reflection:'What helps you remember a short routine: a picture list, spoken reminder, or doing the same order each day?'},
        'ending-repair':{ending:true,title:'Course corrected',scene:'Orish finishes the two jobs and the Morning Rocket is ready. The important part was changing the plan when it was not working.',reflection:'A mistake did not end the mission. Orish noticed, repaired and continued.'}
      }
    },
    '7-9': {
      icon:'🌿', title:'The Greenhouse Signal', subject:'Science & Communication', mode:'independent', start:'start',
      instruction:'Investigate a strange greenhouse signal. Your choices affect which clues the team notices and how they work together.',
      objective:'Use observations, listen to other viewpoints, communicate clearly, and revise a plan when new evidence appears.',
      nodes:{
        start:{scene:'A sensor in the school greenhouse keeps flashing “DRY SOIL,” but the soil looks dark and damp. Orish, Mina and Dev need to find out why.',prompt:'What should the team do first?',choices:[
          {label:'🔎 Check the soil and sensor before deciding',to:'inspect',effect:'The team starts with evidence they can observe.'},
          {label:'💧 Water every plant immediately',to:'water-first',effect:'The warning might be right — but the team has not checked yet.'}
        ]},
        inspect:{scene:'Mina notices the sensor probe is loose. Dev says the reading changed when the cable moved.',prompt:'How should Orish respond?',choices:[
          {label:'👂 Let Dev finish, then test the cable movement',to:'test-cable',effect:'Listening preserves a clue and turns it into a test.'},
          {label:'🗣️ Interrupt: “I already know it is broken!”',to:'interrupt',effect:'The team has a possible explanation, but not enough evidence yet.'}
        ]},
        'water-first':{scene:'One pot becomes waterlogged, while the sensor still says DRY. The warning clearly needs checking.',prompt:'What is the best repair?',choices:[
          {label:'🧪 Stop watering and compare sensor readings',to:'test-cable',effect:'The team changes course using new evidence.'},
          {label:'🤝 Ask the others what they noticed before watering',to:'inspect',effect:'Going back to missed observations can recover useful clues.'}
        ]},
        interrupt:{scene:'Mina says, “Maybe. But Dev noticed exactly when the number changed.” Orish realises the detail matters.',prompt:'What next?',choices:[
          {label:'👂 Ask Dev to repeat the observation',to:'test-cable',effect:'Repairing the conversation helps recover the evidence.'},
          {label:'🧪 Test the probe and cable separately',to:'test-cable',effect:'Separating possible causes makes the investigation clearer.'}
        ]},
        'test-cable':{scene:'The reading jumps only when the loose cable is moved. The soil moisture itself stays the same.',prompt:'What conclusion fits the evidence best?',choices:[
          {label:'📎 The loose connection is affecting the reading',to:'ending',effect:'This explanation matches the observation and test.'},
          {label:'🌧️ The greenhouse must have had secret rain',to:'ending-check',effect:'That idea does not match the evidence the team collected.'}
        ]},
        ending:{ending:true,title:'Signal explained',scene:'The team reconnects the sensor and gets stable readings. They record what changed and why they think it mattered.',reflection:'Strong investigations separate what was observed from what was inferred.'},
        'ending-check':{ending:true,title:'Check the claim against the clues',scene:'The team finds no evidence of rain. They return to the cable test and choose the explanation that matches the observations.',reflection:'A creative idea can be interesting, but evidence decides whether it belongs in the conclusion.'}
      }
    },
    '10-12': {
      icon:'🏛️', title:'The Museum Power Mystery', subject:'Science & Critical Thinking', mode:'independent', start:'start',
      instruction:'A museum display keeps losing power. Follow the evidence, communicate with the team and decide what to test next.',
      objective:'Distinguish observations from guesses, compare explanations, plan a fair diagnostic test, and communicate uncertainty.',
      nodes:{
        start:{scene:'Every afternoon, the fossil gallery display switches off for about two minutes. The rest of the museum stays powered.',prompt:'What is the strongest first step?',choices:[
          {label:'📋 Compare the shutdown times with system logs',to:'logs',effect:'A time pattern can narrow down possible causes.'},
          {label:'🔌 Replace every cable immediately',to:'replace-all',effect:'That might fix something, but it destroys the chance to learn which component caused the fault.'}
        ]},
        logs:{scene:'The shutdown happens at 15:05 each day, just as the display’s cooling fan changes speed.',prompt:'What should the team test?',choices:[
          {label:'🧪 Monitor fan current and display voltage together',to:'measure',effect:'Measuring both variables can show whether they change at the same moment.'},
          {label:'🗣️ Decide the fan is definitely faulty now',to:'premature',effect:'The pattern is useful evidence, but it is not yet proof of cause.'}
        ]},
        'replace-all':{scene:'After replacing several cables, the shutdown still happens. The team has spent time but learned little about the cause.',prompt:'How can they improve the investigation?',choices:[
          {label:'📋 Return to the logs and look for a repeating pattern',to:'logs',effect:'A structured comparison restores the evidence trail.'},
          {label:'🧪 Change one component at a time and measure results',to:'measure',effect:'Changing one thing at a time makes the test more informative.'}
        ]},
        premature:{scene:'Another team member asks, “What measurement would show the fan actually affects the power line?”',prompt:'What is the best response?',choices:[
          {label:'📏 Measure before and during the fan speed change',to:'measure',effect:'The claim becomes testable.'},
          {label:'🤝 Say the fan is a hypothesis, not a conclusion yet',to:'measure',effect:'Clear uncertainty helps the team reason together.'}
        ]},
        measure:{scene:'At 15:05, fan current spikes and display voltage briefly drops below its operating range. Repeating the test produces the same pattern.',prompt:'Which conclusion is best supported?',choices:[
          {label:'⚡ The fan-current spike is linked to the voltage drop',to:'ending',effect:'The repeated measurements support a specific connection without claiming more than the test shows.'},
          {label:'🧠 The fan caused every museum power problem',to:'ending-limit',effect:'That claim is much broader than the evidence.'}
        ]},
        ending:{ending:true,title:'A defensible explanation',scene:'The team documents the repeated current spike, the voltage drop and the remaining uncertainty before making a repair plan.',reflection:'Good reasoning can be precise without pretending to know more than the evidence shows.'},
        'ending-limit':{ending:true,title:'Narrow the claim',scene:'The team rewrites the conclusion: the fan-current spike is associated with this display’s voltage drop during the tested period.',reflection:'A strong conclusion should match the scope of the evidence.'}
      }
    },
    '13-16': {
      icon:'📡', title:'Signal at Station Twelve', subject:'Science, Critical Thinking & Communication', mode:'independent', start:'start',
      instruction:'Analyse a conflicting sensor signal at a remote research station. Choices change which evidence is preserved and how confidently the team can explain the anomaly.',
      objective:'Evaluate competing explanations, preserve an evidence trail, communicate uncertainty, and revise conclusions when stronger evidence appears.',
      nodes:{
        start:{scene:'Station Twelve records a sharp atmospheric-pressure jump at 02:14. One sensor shows a 9 hPa rise; two nearby sensors show almost no change.',prompt:'What should the team prioritise first?',choices:[
          {label:'🧾 Preserve raw logs and compare sensor timestamps',to:'logs',effect:'Preserving raw evidence reduces the risk of losing information before interpretation.'},
          {label:'🌪️ Announce a rare weather event',to:'announce',effect:'It is an interesting explanation, but one conflicting sensor is not enough evidence.'}
        ]},
        logs:{scene:'The anomalous sensor timestamp is 46 seconds ahead of the station clock. Its calibration check is also overdue.',prompt:'Which test adds the most useful evidence?',choices:[
          {label:'⏱️ Correct the time offset, then compare raw readings again',to:'time-test',effect:'This tests whether the apparent event depends on misaligned timestamps.'},
          {label:'🔧 Recalibrate the sensor and delete the old data',to:'delete-data',effect:'Calibration may be needed, but deleting old data would weaken the evidence trail.'}
        ]},
        announce:{scene:'A teammate asks for the corroborating measurements. The other sensors do not show the same pressure jump.',prompt:'How should the claim change?',choices:[
          {label:'🧠 Reclassify it as an unexplained sensor anomaly',to:'logs',effect:'The wording now matches the uncertainty in the evidence.'},
          {label:'📣 Keep the rare-event claim because it sounds plausible',to:'claim-risk',effect:'Plausibility alone cannot resolve conflicting measurements.'}
        ]},
        'delete-data':{scene:'The team stops before deleting anything. They copy the raw dataset, calibration history and clock offset into a read-only evidence folder.',prompt:'What next?',choices:[
          {label:'⏱️ Align timestamps and rerun the comparison',to:'time-test',effect:'The original evidence stays intact while the analysis becomes fairer.'},
          {label:'🧪 Compare the sensor against a reference instrument',to:'reference-test',effect:'A reference instrument can test whether the sensor itself is drifting.'}
        ]},
        'claim-risk':{scene:'The team cannot defend the rare-event claim when asked what independent measurement confirms it.',prompt:'What is the strongest repair?',choices:[
          {label:'📉 Lower confidence and investigate sensor timing/calibration',to:'logs',effect:'Changing confidence when evidence is weak is good scientific practice.'},
          {label:'🤝 Invite another team member to challenge the explanation',to:'logs',effect:'A constructive challenge can reveal assumptions the first team missed.'}
        ]},
        'time-test':{scene:'After correcting the 46-second offset, the pressure spike no longer aligns with any station-wide change. The sensor still shows a smaller unexplained drift.',prompt:'What should the team test now?',choices:[
          {label:'🧪 Compare it with a calibrated reference sensor',to:'reference-test',effect:'The remaining drift can now be tested directly.'},
          {label:'✅ Declare the whole problem solved',to:'ending-partial',effect:'One source of error was found, but a smaller anomaly remains.'}
        ]},
        'reference-test':{scene:'Against the reference instrument, Sensor 12 consistently reads 1.8 hPa high. The offset grows as its enclosure warms.',prompt:'Which conclusion is most defensible?',choices:[
          {label:'🌡️ Timing error plus temperature-related sensor drift explain the anomaly best',to:'ending',effect:'This explanation accounts for both the timestamp mismatch and the reference comparison.'},
          {label:'🌪️ A rare pressure event still explains everything',to:'ending-limit',effect:'The independent measurements do not support that broader claim.'}
        ]},
        ending:{ending:true,title:'Evidence before confidence',scene:'The report separates raw observations, corrected timing, reference measurements and the final explanation. It also records what remains uncertain.',reflection:'A mature conclusion is not the most dramatic one; it is the one that survives comparison with the best available evidence.'},
        'ending-partial':{ending:true,title:'Partial explanations are allowed',scene:'The team records that clock misalignment explained part of the apparent spike, while sensor drift still needs testing.',reflection:'Good investigations can stop at “partly explained” instead of forcing a complete answer too early.'},
        'ending-limit':{ending:true,title:'Match confidence to evidence',scene:'The report rejects the rare-event explanation because independent sensors and reference testing do not support it.',reflection:'Confidence should rise or fall with evidence, not with how interesting an explanation sounds.'}
      }
    }
  };

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function get(ageBand){ return {ageBand, ...clone(stories[ageBand] || stories['7-9'])}; }
  function getNode(story,nodeId){ return story?.nodes?.[nodeId] || null; }
  function isEnding(story,nodeId){ return Boolean(getNode(story,nodeId)?.ending); }
  function validate(story){
    if(!story || !story.start || !story.nodes?.[story.start]) return false;
    return Object.entries(story.nodes).every(([id,node])=>{
      if(node.ending) return Boolean(node.scene);
      return Array.isArray(node.choices) && node.choices.length>=2 && node.choices.every(choice=>Boolean(choice.label && story.nodes[choice.to]));
    });
  }

  window.OrishStoryChoice={get,getNode,isEnding,validate,ageBands:Object.keys(stories)};
})();
