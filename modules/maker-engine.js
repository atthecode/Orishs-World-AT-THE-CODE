(() => {
  'use strict';

  const AGE_ORDER = ['0-2','2-4','4-6','7-9','10-12','13-16'];

  const ageMeta = {
    '0-2': { label:'Parent & Baby Maker', mode:'guided', note:'Adult-led shared exploration only. Use large intact materials, supervise continuously and keep paper away from mouths.' },
    '2-4': { label:'Early Maker', mode:'supported', note:'Short adult-supported making with large materials and simple choices.' },
    '4-6': { label:'Little Designer', mode:'supported', note:'Simple folds, predictions and comparisons with adult help when needed.' },
    '7-9': { label:'Growing Engineer', mode:'independent', note:'Build, test, compare and explain what changed.' },
    '10-12': { label:'Design Investigator', mode:'independent', note:'Control variables, measure outcomes and improve a design.' },
    '13-16': { label:'Teen Design Lab', mode:'independent', note:'Use fair-test thinking, constraints, data and design iteration.' }
  };

  const projects = {
    flight: {
      icon:'✈️', family:'Paper engineering', subject:'Science & Design',
      variants:{
        '0-2': {
          title:'Paper Flight Together',
          materials:['1 large sheet of ordinary paper','Clear floor space','Adult hands'],
          safety:'Adult makes and holds the paper. Do not give torn or crumpled small paper pieces to a baby.',
          question:'What happens when the grown-up moves the paper slowly, then a little faster?',
          objective:'Notice movement, air and cause-and-effect through safe shared play.',
          steps:['Grown-up folds one large simple paper glider.','Hold it where baby can see it clearly.','Move it slowly through the air and name “up”, “down” and “fly”.','Grown-up makes one gentle short flight in clear space.','Notice together where it lands.']
        },
        '2-4': {
          title:'Which Paper Glides?',
          materials:['2 large sheets of paper','Open floor space','Adult help'],
          safety:'A grown-up makes the folds and checks the throwing space.',
          question:'Does the flat sheet or the folded glider travel farther?',
          objective:'Compare two moving objects and use simple distance words.',
          steps:['Keep one sheet flat.','Ask a grown-up to fold the other into a simple glider.','Predict which one will travel farther.','Grown-up launches both gently from the same place.','Point to which travelled farther and try again.']
        },
        '4-6': {
          title:'Paper Plane Test',
          materials:['2 sheets of paper','Tape measure or floor tiles','Pencil with adult supervision'],
          safety:'Use a clear throwing direction away from people, pets, windows and breakable objects.',
          question:'What changes when you make the wings wider or narrower?',
          objective:'Make a prediction and compare simple design changes.',
          steps:['Fold a simple paper plane with help if needed.','Choose one small wing change.','Predict whether it will go farther or shorter.','Launch from the same line three times.','Use steps or floor tiles to compare the flights.']
        },
        '7-9': {
          title:'Flight Lab: One Change',
          materials:['2 sheets of paper','Ruler or tape measure','Pencil','Clear launch lane'],
          safety:'Launch only in a clear indoor or outdoor space approved by a grown-up.',
          question:'Which single design change affects distance most?',
          objective:'Run a simple fair test by changing one feature and measuring distance.',
          steps:['Build a baseline plane.','Build a second plane with one feature changed.','Write or say your prediction.','Launch each plane three times from the same line.','Compare the distances and decide what the evidence suggests.']
        },
        '10-12': {
          title:'Aerodynamics Investigation',
          materials:['3 sheets of paper','Ruler or tape measure','Pencil','Results table'],
          safety:'Use a clear launch lane and stop if people enter the test area.',
          question:'How do wing area and nose mass affect average flight distance?',
          objective:'Control variables, repeat trials and compare average outcomes.',
          steps:['Choose one variable: wing area or a small fold at the nose.','Build a control plane and one test plane.','Keep paper type, launch line and launcher the same.','Run at least five trials for each design.','Calculate or compare average distance and identify unusual results.']
        },
        '13-16': {
          title:'Paper Flight Engineering Study',
          materials:['Several identical sheets of paper','Measuring tape','Phone timer only if adult rules allow','Results table'],
          safety:'Use a controlled launch area. No throwing toward roads, balconies, people or animals.',
          question:'Which design variable produces the strongest repeatable effect on range or flight time?',
          objective:'Design a controlled investigation, quantify uncertainty and justify a design decision from data.',
          steps:['Define one independent variable and one measurable dependent variable.','State the controls you will keep constant.','Build at least two repeatable designs.','Run enough trials to identify variation, not just a single best flight.','Compare central tendency and spread, then explain whether the evidence supports your design claim.']
        }
      }
    },
    bridge: {
      icon:'🌉', family:'Structures', subject:'Science & Design',
      variants:{
        '0-2': {
          title:'Bridge Peek-a-Boo Together',
          materials:['1 large sheet of card','2 sturdy books','Adult hands'],
          safety:'Adult controls all materials. Keep heavy books and paper edges out of baby reach.',
          question:'Can you see the toy or grown-up hand appear under the bridge?',
          objective:'Explore over/under and object permanence through shared play.',
          steps:['Grown-up places two sturdy books safely apart.','Lay one large card sheet across them.','Name “over” and “under”.','Move a hand slowly under the bridge.','Repeat the game from another side.']
        },
        '2-4': {
          title:'Make a Paper Bridge',
          materials:['1 sheet of paper','2 sturdy books','A few large lightweight blocks'],
          safety:'Adult positions the books and removes anything heavy or unstable.',
          question:'Does flat paper or folded paper hold more lightweight blocks?',
          objective:'Notice that shape can change how strong a structure feels.',
          steps:['Grown-up places two books a short distance apart.','Lay flat paper across the gap.','Add one lightweight block with adult help.','Fold a new sheet into a simple ridge and try again.','Notice which shape feels stronger.']
        },
        '4-6': {
          title:'Strong Shapes Bridge',
          materials:['2 sheets of paper','2 books','10 identical coins handled by adult if needed'],
          safety:'Keep coins away from children who may mouth small objects; use large counters instead where appropriate.',
          question:'Which folded shape holds the most safe test pieces?',
          objective:'Compare structures and count a simple load.',
          steps:['Test one flat paper bridge.','Fold another bridge into an accordion or ridge shape.','Add test pieces one at a time.','Count how many each bridge held.','Say which shape was stronger in your test.']
        },
        '7-9': {
          title:'Bridge Load Challenge',
          materials:['3 sheets of paper','2 books','Identical safe weights','Results sheet'],
          safety:'Use lightweight test pieces and keep fingers clear if a bridge collapses.',
          question:'How does folding change the load a paper bridge can support?',
          objective:'Compare structural forms using a repeatable load test.',
          steps:['Set a fixed bridge span.','Test a flat sheet first.','Choose one folded beam shape.','Add identical weights one at a time and record the maximum.','Redesign once and explain why your second design should improve.']
        },
        '10-12': {
          title:'Structural Engineering Lab',
          materials:['Identical paper sheets','Ruler','2 supports','Identical safe weights'],
          safety:'Do not use glass, sharp objects or heavy weights as test loads.',
          question:'Which cross-section gives the best strength-to-material ratio?',
          objective:'Compare structural cross-sections while keeping span and material constant.',
          steps:['Choose two cross-sections such as flat, tube, box or corrugation.','Keep paper amount and span as similar as possible.','Predict which will resist bending best.','Run repeated load tests and record failure load.','Explain the result using shape, compression and tension ideas.']
        },
        '13-16': {
          title:'Paper Structure Optimisation',
          materials:['Identical paper sheets','Ruler','Supports','Standardised safe test masses','Data table'],
          safety:'Use only light, non-breakable test masses and a stable low work surface.',
          question:'How can you maximise load capacity under a fixed material and span constraint?',
          objective:'Optimise a structure under constraints and support the design choice with repeatable evidence.',
          steps:['Define material, span and load-placement constraints.','Choose at least two candidate cross-sections.','Predict likely failure modes before testing.','Run repeat trials and note where buckling or bending begins.','Select a final design and justify it using performance data and observed failure mode.']
        }
      }
    },
    parachute: {
      icon:'🪂', family:'Forces & motion', subject:'Science & Design',
      variants:{
        '0-2': {
          title:'Float Down Together',
          materials:['Large lightweight scarf or tissue held by adult','Clear floor space'],
          safety:'Adult holds all material. Never place fabric or paper over a baby’s face or leave it within reach unsupervised.',
          question:'Can you watch it move down slowly?',
          objective:'Notice slow movement and up/down language with an adult.',
          steps:['Grown-up holds the material high but safely away from baby.','Say “up”.','Let it float down while saying “down”.','Watch where it lands.','Repeat slowly if baby is enjoying the shared activity.']
        },
        '2-4': {
          title:'Fast Drop, Slow Drop',
          materials:['1 sheet of paper','1 same-size loosely crumpled paper ball','Adult help'],
          safety:'Use large paper pieces only and supervise the whole activity.',
          question:'Which reaches the floor first?',
          objective:'Compare how shape changes falling motion.',
          steps:['Look at the flat sheet and paper ball.','Predict which will land first.','Grown-up drops both from the same safe height.','Watch carefully.','Try again and use “faster” and “slower”.']
        },
        '4-6': {
          title:'Little Parachute Test',
          materials:['Large paper or lightweight fabric square','4 equal strings prepared by adult','Large toy figure approved by adult'],
          safety:'Adult prepares strings; avoid cords around necks and never leave strings unattended.',
          question:'Does a wider parachute fall more slowly?',
          objective:'Compare falling time using two simple parachute sizes.',
          steps:['Grown-up helps make one safe parachute.','Make or compare a second size.','Predict which will fall more slowly.','Drop them from the same safe low height.','Count slowly while they fall and compare.']
        },
        '7-9': {
          title:'Parachute Descent Lab',
          materials:['Paper or lightweight fabric','String prepared by adult','Same test mass','Timer'],
          safety:'Use a safe indoor stair-free drop point or low outdoor height approved by a grown-up.',
          question:'How does canopy area affect descent time?',
          objective:'Change one variable and measure repeated descent times.',
          steps:['Build two parachutes with different canopy areas.','Use the same mass and string length.','Predict which will descend more slowly.','Run at least three drops each from the same height.','Compare times and explain what air resistance may be doing.']
        },
        '10-12': {
          title:'Drag & Descent Investigation',
          materials:['Lightweight canopy material','String','Standard test mass','Timer','Ruler'],
          safety:'No high-window, balcony or roadside drops. Use an adult-approved controlled test area.',
          question:'How do canopy area and venting affect descent stability and time?',
          objective:'Investigate drag using repeated trials and controlled variables.',
          steps:['Choose canopy area or vent size as your variable.','Hold mass, drop height and material constant.','Run repeated timed trials.','Record wobble or instability separately from descent time.','Explain the trade-off between slow descent and stable descent.']
        },
        '13-16': {
          title:'Descent-System Design Study',
          materials:['Lightweight material','String','Standard test mass','Timer','Measuring tools'],
          safety:'Keep all tests low-risk and adult-approved; do not use roofs, balconies or public paths.',
          question:'Which canopy geometry gives the best balance of descent rate and stability under your constraints?',
          objective:'Evaluate a design using multiple performance measures, repeatability and trade-offs.',
          steps:['Define the performance criteria before building.','Choose one geometry variable to investigate.','Run repeated controlled drops and record descent time plus stability observations.','Compare variability between designs, not only the fastest or slowest trial.','Make an evidence-based recommendation and identify one limitation of the test.']
        }
      }
    },
    star: {
      icon:'✨', family:'Origami & geometry', subject:'Mathematics & Design',
      variants:{
        '0-2': {
          title:'Folded Shapes Together',
          materials:['One large brightly coloured sheet of paper','Adult hands'],
          safety:'Adult does all folding and keeps paper out of baby’s mouth.',
          question:'Can you notice the paper changing shape?',
          objective:'Notice shape changes and simple words such as fold/open with an adult.',
          steps:['Show the large flat sheet.','Grown-up makes one simple fold.','Say “fold”.','Open it again and say “open”.','Repeat with a different direction.']
        },
        '2-4': {
          title:'Fold & Open Shapes',
          materials:['Large square paper','Adult help'],
          safety:'Use large paper and supervise continuously.',
          question:'What shapes can you notice after a fold?',
          objective:'Notice lines, corners and simple shape changes.',
          steps:['Find the four corners together.','Fold one corner to another with adult help.','Open and find the crease line.','Fold the other direction.','Look for triangles and straight lines.']
        },
        '4-6': {
          title:'Transforming Origami Star',
          materials:['Square paper','Adult help for harder folds'],
          safety:'This is a geometry craft, not a throwing toy. Keep folded points away from faces and younger children.',
          question:'Where can you see repeating shapes and symmetry?',
          objective:'Recognise repeated shapes, folds and simple symmetry.',
          steps:['Start with equal-size paper pieces prepared by a grown-up.','Make the same fold on each piece.','Line up matching edges.','Assemble with adult help if the folds are difficult.','Turn or open the finished geometry and look for repeating patterns.']
        },
        '7-9': {
          title:'Origami Symmetry Lab',
          materials:['Square paper pieces','Ruler if wanted','Pencil'],
          safety:'Use the finished model as a desk/folding object, not a projectile.',
          question:'Which folds create rotational or mirror symmetry?',
          objective:'Identify lines of symmetry and repeating transformations in a folded design.',
          steps:['Build one repeating folded unit.','Make several identical units.','Predict how many turns make the pattern look unchanged.','Assemble the units.','Describe any mirror or rotational symmetry you can find.']
        },
        '10-12': {
          title:'Modular Origami Geometry',
          materials:['Equal square paper pieces','Ruler','Notebook'],
          safety:'Keep the activity as a geometry/model-making task; do not sharpen or reinforce points.',
          question:'How do angle, repetition and module count create the final geometry?',
          objective:'Connect transformations, angles and repeated modules to a physical geometric model.',
          steps:['Create one accurate module and inspect its angles.','Replicate the module consistently.','Predict the symmetry order before assembly.','Assemble and test whether the prediction matches the finished form.','Sketch or describe the transformations that map one module onto another.']
        },
        '13-16': {
          title:'Transformations in Modular Origami',
          materials:['Equal square paper pieces','Ruler/protractor if available','Notebook'],
          safety:'This is mathematical model-making only; finished objects are not for throwing.',
          question:'How can rotations, reflections and constraints explain the structure of a modular folded form?',
          objective:'Model a physical design using geometric transformations and evaluate construction tolerance.',
          steps:['Define the module and identify key angles or crease constraints.','Replicate units with controlled accuracy.','Describe the transformation mapping each unit to its neighbour.','Assemble the system and note where accumulated fold error appears.','Explain how geometric constraints and construction tolerance affect the final structure.']
        }
      }
    },
    book: {
      icon:'📖', family:'Story engineering', subject:'English & Creative Design',
      variants:{
        '0-2': {
          title:'My First Folded Picture Book',
          materials:['Large paper folded by adult','Thick crayon used by adult or older helper'],
          safety:'Adult prepares and holds the book. Avoid small torn pieces and supervise mark-making.',
          question:'Which picture or face gets the biggest reaction?',
          objective:'Share pictures, sounds and turn-taking through a tiny parent-made book.',
          steps:['Grown-up folds one large sheet into a simple booklet.','Add one bold picture per page.','Name the picture slowly.','Pause for baby to look or react.','Turn the page together.']
        },
        '2-4': {
          title:'Three-Page Story',
          materials:['Large folded paper','Crayons','Adult help'],
          safety:'Use child-safe art materials and supervise.',
          question:'What happens first, next and last?',
          objective:'Put three simple events into an order.',
          steps:['Choose a character.','Draw or mark what happens first.','Make a second page for what happens next.','Make the final page for the ending.','Tell the story aloud together.']
        },
        '4-6': {
          title:'Fold-a-Book Adventure',
          materials:['1 sheet of paper','Crayons or pencils','Adult help for cutting only if a format needs it'],
          safety:'Any cutting is a grown-up job in this V1 activity.',
          question:'Can every page help the story move forward?',
          objective:'Create a short beginning-middle-end sequence using pictures and early writing.',
          steps:['Choose a title and main character.','Make a beginning page.','Add a problem or surprise in the middle.','Create an ending.','Read or tell the whole story to someone.']
        },
        '7-9': {
          title:'Mini-Book Story Mission',
          materials:['Folded paper booklet','Pencil/colours'],
          safety:'Use ordinary child-safe stationery and keep personal/private information out of the story.',
          question:'How can clues on earlier pages make the ending feel earned?',
          objective:'Plan a short narrative with sequence, clues and a clear resolution.',
          steps:['Give the story a goal or mystery.','Plan 4–6 page beats before drawing.','Plant one clue early.','Create a change or discovery in the middle.','End by resolving the goal and check whether the clue mattered.']
        },
        '10-12': {
          title:'Interactive Mini-Book',
          materials:['Paper booklet','Pencil/colours','Optional index tabs'],
          safety:'Do not put real addresses, school details or other private identifiers into shareable stories.',
          question:'How can a reader choice change the path without breaking the story logic?',
          objective:'Design branching narrative structure and revise for coherence.',
          steps:['Define the story goal and two meaningful reader choices.','Map the branches before writing pages.','Make each choice lead to a clear consequence.','Reconnect branches where useful to keep the book manageable.','Test the book on a family member and revise confusing transitions.']
        },
        '13-16': {
          title:'Branching Narrative Prototype',
          materials:['Paper prototype or local notes','Pen/pencil','Flow diagram'],
          safety:'Keep prototypes fictional and avoid including identifiable personal information.',
          question:'Which decision points create genuine agency rather than cosmetic choices?',
          objective:'Prototype an interactive narrative using branching logic, constraints and user testing.',
          steps:['Define the reader goal and the state that can change.','Map decision nodes and consequences.','Remove choices that do not meaningfully affect information, route or outcome.','Build a compact paper prototype.','Run a user test, record where navigation breaks down and revise the flow.']
        }
      }
    }
  };

  function clone(value){ return JSON.parse(JSON.stringify(value)); }

  function getProject(id, ageBand){
    const project = projects[id] || projects.flight;
    const band = project.variants[ageBand] ? ageBand : '7-9';
    return {
      id,
      icon:project.icon,
      family:project.family,
      subject:project.subject,
      ageBand:band,
      ageLabel:ageMeta[band].label,
      mode:ageMeta[band].mode,
      ageNote:ageMeta[band].note,
      ...clone(project.variants[band])
    };
  }

  function list(ageBand){
    return Object.keys(projects).map(id => {
      const item=getProject(id,ageBand);
      return {id,icon:item.icon,title:item.title,family:item.family,question:item.question,ageLabel:item.ageLabel};
    });
  }

  window.OrishMaker={ageMeta,projects,getProject,list,AGE_ORDER};
})();