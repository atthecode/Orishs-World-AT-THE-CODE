(() => {
  'use strict';

  const ageMeta = {
    '0-2': { label:'Parent & Baby', difficulty:'Shared discovery', mode:'guided', summary:'Grown-up-led looking, naming, movement and cause-and-effect. No independent baby scoring.' },
    '2-4': { label:'Early Explorer', difficulty:'First discoveries', mode:'supported', summary:'Very short spoken questions, two or three clear choices and lots of repetition.' },
    '4-6': { label:'Little Explorer', difficulty:'Foundation', mode:'supported', summary:'Simple missions with read-aloud, concrete examples and early reasoning.' },
    '7-9': { label:'Growing Explorer', difficulty:'Explorer', mode:'independent', summary:'Puzzles, explanations and evidence-based choices with growing independence.' },
    '10-12': { label:'Big Explorer', difficulty:'Investigator', mode:'independent', summary:'Multi-step reasoning, fair tests, systems thinking and deeper subject knowledge.' },
    '13-16': { label:'Teen Explorer', difficulty:'Advanced', mode:'independent', summary:'Mature language, unfamiliar problems, evidence evaluation and higher-level scientific reasoning.' }
  };

  const content = {
    space: {
      icon:'🚀',
      skill:'Astronomy, gravity, evidence and systems',
      levels:{
        '0-2': { name:'Sky Time Together', questions:[
          ['Grown-up: point up together. Which word names the bright object we see in the daytime sky?',['Sun','Shoe'],0,'The Sun is our star. Keep this as a simple shared word-and-point activity.'],
          ['Which word can you say together when you see the night sky object?',['Moon','Spoon'],0,'The Moon is a familiar object to notice together at night.'],
          ['Try a slow “rocket” arm movement together. Which way do rockets lift?',['Up','Under the sofa'],0,'This is movement-and-language play, not a science test.']
        ]},
        '2-4': { name:'Little Sky Explorer', questions:[
          ['Which one is a star?',['The Sun','The Moon'],0,'The Sun is a star.'],
          ['Which place do we live on?',['Earth','A cloud'],0,'We live on planet Earth.'],
          ['When can we often see stars more clearly?',['At night','At lunchtime indoors'],0,'Dark skies make many stars easier to see.']
        ]},
        '4-6': { name:'Rocket Ready', questions:[
          ['Which object gives Earth light and warmth?',['The Sun','Mars','The Moon'],0,'The Sun is the star at the centre of our Solar System.'],
          ['What shape is Earth most like?',['A ball','A flat square','A triangle'],0,'Earth is roughly spherical.'],
          ['Which one goes around Earth?',['The Moon','The Sun every day','Jupiter'],0,'The Moon orbits Earth.'],
          ['A rocket needs a powerful push to…',['Lift away from Earth','Turn into a boat','Make night arrive'],0,'Rockets use thrust to accelerate upward.']
        ]},
        '7-9': { name:'Space Signal Sort', questions:[
          ['Which planet is closest to the Sun?',['Earth','Mercury','Mars','Saturn'],1,'Mercury is the innermost planet.'],
          ['What keeps planets moving around the Sun?',['Gravity','Wind','Sound','Rain'],0,'Gravity provides the inward pull that shapes planetary orbits.'],
          ['Which object is a star?',['Moon','Earth','Sun','Mars'],2,'The Sun is a star; the others listed are a moon or planets.'],
          ['Why does the Moon appear to shine?',['It reflects sunlight','It is made of fire','Streetlights reach it','It makes its own sunlight'],0,'The Moon reflects light from the Sun.']
        ]},
        '10-12': { name:'Orbital Investigation', questions:[
          ['Why do planets not simply fly away in straight lines?',['Gravity continually changes their direction','Space contains strong wind','The Sun blocks every path','Planets are tied to invisible strings'],0,'An orbit combines forward motion with gravitational acceleration toward the Sun.'],
          ['Which observation best supports the idea that Earth rotates?',['The apparent daily motion of the sky','Different rocks have different colours','Rain falls downward','The Moon has craters'],0,'Earth’s rotation explains the regular apparent daily motion of the Sun and stars.'],
          ['A planet twice as far from its star receives less light. Which idea matters most?',['Light spreads over a larger area','The planet becomes heavier','Sound absorbs the light','The star turns off'],0,'Radiation spreads with distance, reducing energy received per unit area.'],
          ['Which is the best model for the Solar System?',['Planets orbit the Sun at different distances','All planets sit in one straight fixed line','The Moon is at the centre','Every planet is the same size'],0,'A useful model must represent orbital relationships and different scales.'],
          ['Why are models useful in astronomy?',['They help test explanations for objects we cannot manipulate directly','They make evidence unnecessary','They guarantee certainty','They replace observations'],0,'Models help scientists connect evidence, predictions and explanations.']
        ]},
        '13-16': { name:'Astrophysics: Evidence Lab', questions:[
          ['A planet’s orbital speed increases as it approaches its star. Which explanation is strongest?',['Gravitational potential energy is converted as the planet falls inward','Space becomes warmer so the planet expands','The star pushes it with light only','Its mass suddenly decreases'],0,'Conservation of energy and stronger gravitational interaction closer to the star explain the speed increase.'],
          ['Two stars have equal luminosity, but Star A appears four times dimmer. A reasonable first hypothesis is that Star A is…',['Farther away','Four times hotter with certainty','Not a star','Moving sideways faster'],0,'Apparent brightness depends strongly on distance, so distance is a testable first explanation.'],
          ['Which evidence would most directly test an exoplanet transit claim?',['Repeated periodic dips in the star’s measured brightness','One blurred photograph','A prediction with no measurements','The colour of the telescope'],0,'Repeated periodic brightness dips are a key signature expected from a transit.'],
          ['Why is “gravity stops in space” scientifically inaccurate?',['Gravity acts over long distances and weakens with separation','Astronauts have no mass','Only planets create gravity','Vacuum destroys forces'],0,'Orbiting astronauts feel weightless because they are in free fall, not because gravity vanishes.'],
          ['Which statement best reflects scientific uncertainty?',['A model can be strongly supported while remaining open to revision with new evidence','A accepted model can never change','All explanations are equally likely','Uncertainty means nothing is known'],0,'Science can reach high confidence while still allowing models to improve when better evidence appears.']
        ]}
      }
    },
    body: {
      icon:'❤️', skill:'Anatomy, physiology and body systems', levels:{
        '0-2': { name:'My Body Together', questions:[
          ['Grown-up: touch your hand, then help your little explorer notice theirs. Which word are you practising?',['Hand','Cloud'],0,'Simple body-part naming supports language and body awareness.'],
          ['Which body part helps us see?',['Eyes','Knees'],0,'Eyes are our organs of sight.'],
          ['Try a gentle breath together. What are you doing?',['Breathing','Drawing'],0,'Breathing is a safe shared movement-and-language activity.']
        ]},
        '2-4': { name:'Body Name Game', questions:[
          ['Which body part helps you hear?',['Ears','Elbows'],0,'Ears help us detect sound.'],
          ['Which body part bends so you can sit and jump?',['Knees','Hair'],0,'Knee joints help the legs bend.'],
          ['What do you use to smell?',['Nose','Toes'],0,'The nose contains structures that help detect smells.']
        ]},
        '4-6': { name:'Inside Me Explorer', questions:[
          ['Which organ pumps blood?',['Heart','Stomach','Skin'],0,'The heart pumps blood through the circulatory system.'],
          ['What protects your brain?',['Skull','Fingernails','Hair'],0,'The skull surrounds and protects the brain.'],
          ['Which organs help you breathe?',['Lungs','Kidneys','Ankles'],0,'The lungs exchange gases during breathing.'],
          ['Bones join together at…',['Joints','Freckles','Taste buds'],0,'Joints are places where bones meet.']
        ]},
        '7-9': { name:'Body Detective', questions:[
          ['Which organ pumps blood around your body?',['Heart','Lungs','Stomach','Skin'],0,'The heart pumps blood through blood vessels.'],
          ['Which tissues pull on bones to help you move?',['Muscles','Hair','Tooth enamel','Nails'],0,'Skeletal muscles contract and pull on bones.'],
          ['Which organs exchange oxygen and carbon dioxide?',['Lungs','Kidneys','Stomach','Elbows'],0,'Gas exchange occurs in the lungs.'],
          ['Your skeleton mainly provides…',['Support and protection','Wi-Fi','Body colour','Sound'],0,'The skeleton supports the body, protects organs and works with muscles for movement.']
        ]},
        '10-12': { name:'Human Systems Lab', questions:[
          ['Why does heart rate usually rise during exercise?',['Working muscles need faster delivery of oxygen and nutrients','The skeleton becomes softer','The stomach stops existing','Blood changes into air'],0,'Cardiac output increases to meet the muscles’ higher metabolic demand.'],
          ['Where does most oxygen enter the blood?',['Across tiny air sacs in the lungs','Inside bones','In the stomach','Across the skin'],0,'Gas exchange occurs across the thin walls of alveoli and capillaries.'],
          ['A muscle can pull but cannot push a bone. How do many joints move both ways?',['Muscles work in opposing pairs','Bones inflate','Nerves push bones directly','Blood vessels act as springs'],0,'Antagonistic muscle pairs contract in opposite directions around joints.'],
          ['Which system carries hormones around the body?',['Circulatory system','Skeletal system only','Digestive tract only','Hair follicles'],0,'Hormones released into blood are transported by the circulatory system.'],
          ['Why is the small intestine well suited to absorb nutrients?',['Large surface area and rich blood supply','It is completely solid','It contains bones','It never moves'],0,'Folds and villi greatly increase surface area for absorption.']
        ]},
        '13-16': { name:'Physiology Systems Challenge', questions:[
          ['During intense exercise, ventilation and cardiac output both rise. What shared problem are they helping solve?',['Maintaining gas exchange and delivery to metabolically active tissues','Increasing bone length immediately','Reducing all cellular respiration','Stopping blood flow to muscles'],0,'Respiratory and cardiovascular responses work together to meet increased metabolic demand.'],
          ['Which mechanism best describes a negative-feedback response?',['A change triggers responses that oppose the original change','A response always amplifies a change','The body ignores internal conditions','Only the brain can detect change'],0,'Negative feedback stabilises internal conditions by counteracting deviations.'],
          ['Damage to insulin-producing pancreatic cells most directly disrupts control of…',['Blood glucose concentration','Bone length','Lung volume only','Skin pigmentation'],0,'Insulin is central to regulation of blood glucose.'],
          ['Why is diffusion efficient across alveoli?',['Large area, thin barrier and maintained concentration gradients','Thick dry walls and no blood flow','Very small surface area','No ventilation'],0,'Alveolar structure and blood flow maintain conditions that favour rapid diffusion.'],
          ['Which statement about homeostasis is strongest?',['Multiple organ systems coordinate to keep internal conditions within workable ranges','Every internal value is perfectly constant','Only temperature is regulated','Homeostasis prevents all disease'],0,'Homeostasis is dynamic regulation across interacting systems, not perfect constancy.']
        ]}
      }
    },
    math: {
      icon:'➗', skill:'Number, pattern and quantitative reasoning', levels:{
        '0-2': { name:'One, More, Big, Small', questions:[
          ['Grown-up: hold up one safe toy. Which number word are you practising?',['One','Ten'],0,'Early maths begins with shared quantity words.'],
          ['If you add another block, do you have…',['More','None'],0,'“More” is an early quantity concept.'],
          ['Which word fits a large ball compared with a tiny ball?',['Big','Quiet'],0,'Size words build early mathematical language.']
        ]},
        '2-4': { name:'Count & Spot', questions:[
          ['How many: ● ● ?',['2','4'],0,'There are two dots.'],
          ['What comes after 3?',['4','1'],0,'Four comes after three when counting forward.'],
          ['Which group has more?',['● ● ●','●'],0,'Three objects are more than one object.']
        ]},
        '4-6': { name:'Number Trail', questions:[
          ['What is 4 + 3?',['7','5','8'],0,'Four and three make seven.'],
          ['What is 10 − 4?',['6','14','5'],0,'Taking four away from ten leaves six.'],
          ['Which shape has 3 sides?',['Triangle','Square','Circle'],0,'A triangle has three sides.'],
          ['Half of 8 is…',['4','2','6'],0,'Two equal groups of four make eight.']
        ]},
        '7-9': { name:'Number Rescue', questions:[
          ['What is 6 × 4?',['10','18','24','30'],2,'Six groups of four make 24.'],
          ['Which is one half?',['1/2','1/3','2/3','3/4'],0,'One half means one of two equal parts.'],
          ['What is 45 + 15?',['50','55','60','65'],2,'45 + 15 = 60.'],
          ['What is 100 − 37?',['63','73','67','57'],0,'100 − 37 = 63.']
        ]},
        '10-12': { name:'Problem Solver Lab', questions:[
          ['A recipe uses 300 g flour for 6 portions. How much for 4 portions?',['200 g','150 g','450 g','120 g'],0,'300 ÷ 6 = 50 g per portion; 50 × 4 = 200 g.'],
          ['0.375 is equivalent to…',['3/8','3/4','37/5','1/3'],0,'0.375 = 375/1000 = 3/8.'],
          ['A £48 item is reduced by 25%. What is the sale price?',['£36','£24','£42','£12'],0,'25% of £48 is £12, so the new price is £36.'],
          ['The ratio red:blue is 2:3. If there are 18 blue counters, how many red?',['12','27','9','6'],0,'Each ratio unit is 6, so red = 2 × 6 = 12.'],
          ['Which is greatest?',['5/6','0.8','79%','3/4'],0,'5/6 is about 0.833, which is greater than 0.8, 0.79 and 0.75.']
        ]},
        '13-16': { name:'Quantitative Reasoning Challenge', questions:[
          ['Solve 3(2x − 1) = 21.',['x = 4','x = 3','x = 7','x = 12'],0,'Expand to 6x − 3 = 21, then 6x = 24, so x = 4.'],
          ['A quantity increases from 80 to 92. What is the percentage increase?',['15%','12%','20%','8%'],0,'The increase is 12; 12/80 = 0.15 = 15%.'],
          ['If y is directly proportional to x and y = 18 when x = 6, what is y when x = 11?',['33','23','36','29'],0,'The constant of proportionality is 3, so y = 3 × 11 = 33.'],
          ['Which claim can a correlation alone justify?',['Two variables vary together, but causation is not established','One variable definitely causes the other','There are no hidden variables','The relationship will hold forever'],0,'Correlation describes association, not necessarily causal mechanism.'],
          ['A model predicts 52.4 but the observed value is 50.0. What is the absolute error?',['2.4','4.8% exactly','102.4','0.024'],0,'Absolute error is |52.4 − 50.0| = 2.4.']
        ]}
      }
    },
    paper: {
      icon:'✈️', skill:'Design, forces, measurement and fair testing', levels:{
        '0-2': { name:'Paper Move Together', questions:[
          ['Grown-up: safely wave a large sheet of paper. What can your little explorer notice?',['It moves','It becomes food'],0,'This is a simple cause-and-effect observation with close adult supervision.'],
          ['Crumple a safe sheet together. Did its shape…',['Change','Stay exactly the same'],0,'Changing materials by folding and crumpling is early sensory exploration.'],
          ['Drop a paper ball from a safe low height. Which way does it go?',['Down','Up forever'],0,'The shared observation introduces simple movement language.']
        ]},
        '2-4': { name:'Fold, Make, Notice', questions:[
          ['If you fold paper, what changes?',['Its shape','Its birthday'],0,'Folding changes the shape of the paper.'],
          ['Which can you compare after making two paper shapes?',['Which travels farther','Which has a louder name'],0,'Simple comparison is an early investigation skill.'],
          ['What should we do with scissors at this age?',['Let the grown-up choose safe tools and help','Run with them'],0,'Tool safety stays adult-led.']
        ]},
        '4-6': { name:'Paper Flight Explorer', questions:[
          ['Before changing a paper plane, what can you do?',['Test it once','Guess only','Hide it'],0,'Testing gives you something to compare.'],
          ['What can you measure after a flight?',['How far it went','How tasty it is','Its birthday'],0,'Distance is a useful measurable result.'],
          ['If one wing is folded differently, what might happen?',['The flight may change','Nothing can ever change','It becomes metal'],0,'Design changes can affect motion.'],
          ['To compare two designs, should you throw from roughly the same place?',['Yes','No'],0,'Keeping conditions similar makes the comparison fairer.']
        ]},
        '7-9': { name:'Paper Flight Lab', questions:[
          ['Before changing your plane design, what should you do first?',['Test the first version','Throw it away','Guess the result','Stop measuring'],0,'A baseline test lets you compare later changes.'],
          ['To compare two planes fairly, try to keep what the same?',['Throwing place','Plane colour only','Your shoes','The room name'],0,'Controlling conditions makes comparisons more meaningful.'],
          ['What can you measure after a flight?',['Distance','Taste','Brightness of your voice','Nothing'],0,'Distance is one simple quantitative outcome.'],
          ['Changing one thing at a time helps you…',['See what caused the difference','Make comparison impossible','Lose the results','Avoid learning'],0,'Changing one variable helps isolate its effect.']
        ]},
        '10-12': { name:'Flight Design Investigation', questions:[
          ['Why repeat each flight several times?',['To reduce the effect of one unusual throw','To guarantee your favourite plane wins','To avoid recording data','Because one result is never allowed'],0,'Repeated measurements give a more reliable picture of typical performance.'],
          ['Which is the independent variable if you change wing width?',['Wing width','Flight distance','The results table','The conclusion'],0,'The independent variable is the factor deliberately changed.'],
          ['Which is the dependent variable if you measure flight distance?',['Flight distance','Wing width','Paper brand if kept constant','Launch line'],0,'The dependent variable is the measured outcome.'],
          ['What would make a test less fair?',['Changing wing width and launch height together','Using the same launch line','Repeating trials','Recording every result'],0,'Changing several factors at once makes causes harder to identify.'],
          ['Why calculate a mean distance?',['To summarise repeated results','To erase all variation','To prove there was no error','To replace raw data'],0,'A mean can summarise repeated measurements while the raw data still matters.']
        ]},
        '13-16': { name:'Aerodynamics Design Lab', questions:[
          ['You test wing area while holding paper mass and launch method constant. Wing area is the…',['Independent variable','Dependent variable','Control result','Measurement error'],0,'It is the deliberately manipulated variable.'],
          ['One trial is far from all the others. What is the best first response?',['Check for a procedural reason and repeat if justified','Delete it because it is inconvenient','Change the hypothesis','Average only the best trials'],0,'Possible anomalies should be investigated transparently rather than silently removed.'],
          ['Why report a range as well as a mean?',['It shows spread in the measurements','It guarantees causation','It makes units unnecessary','It hides inconsistent data'],0,'Range gives simple information about variation that a mean alone cannot show.'],
          ['A wider wing improves mean distance but makes flights less consistent. This is a…',['Design trade-off','Proof the data are wrong','Reason to ignore consistency','Mathematical impossibility'],0,'Engineering decisions often balance competing performance criteria.'],
          ['Which conclusion is strongest?',['Within these test conditions, wider wings increased mean distance','Wider wings always fly farther everywhere','The hypothesis is permanently proven','All other variables are irrelevant'],0,'A good conclusion stays within the scope of the evidence collected.']
        ]}
      }
    },
    story: {
      icon:'🌙', skill:'Sequencing, reflection and self-management', levels:{
        '0-2': { name:'Goodnight Together', questions:[
          ['Grown-up: choose the calmer shared activity.',['A gentle story','A shouting game'],0,'A quiet, predictable activity can help create a calmer transition.'],
          ['Which can be part of a simple bedtime sequence?',['Cuddle and story','A competition to stay awake'],0,'The goal is connection and predictability, not performance.'],
          ['Should bedtime learning for a baby be a punishment?',['No','Yes'],0,'Routines should support care and connection, never punishment.']
        ]},
        '2-4': { name:'Orish Gets Ready for Night', questions:[
          ['Which sounds calm before bed?',['A short story','A loud race'],0,'Quiet activities can help the transition toward sleep.'],
          ['What can come after brushing teeth?',['A calm story','Starting a noisy party'],0,'Predictable sequences make routines easier to understand.'],
          ['If you need help, what can you do?',['Ask your grown-up','Hide and worry alone'],0,'Asking a trusted grown-up for help is okay.']
        ]},
        '4-6': { name:'Night Mission Story', questions:[
          ['Which order makes sense?',['Wash, teeth, story','Story, breakfast, school'],0,'A routine is easier when steps have a sensible sequence.'],
          ['What can help tomorrow morning?',['Put clothes ready','Hide your shoes'],0,'Preparation can reduce morning searching.'],
          ['If a feeling is big at bedtime, which is helpful?',['Tell a trusted grown-up','Pretend nobody can help'],0,'Talking to a trusted adult can help children feel supported.'],
          ['A bedtime routine should feel…',['Calm and safe','Like a punishment'],0,'The routine is there to support wellbeing, not to punish.']
        ]},
        '7-9': { name:'Quiet Choice Story', questions:[
          ['Orish is getting ready for sleep. Which activity is calmest?',['A quiet story','A loud race','Jumping on furniture','Shouting contest'],0,'Lower-stimulation activities can support a calmer transition to bedtime.'],
          ['What could help prepare for tomorrow?',['Put clothes ready','Hide the school bag','Stay awake all night','Turn every light on'],0,'Simple preparation can make the next morning easier.'],
          ['If your mind feels busy, which may help?',['Slow breathing','More noise','Running around indoors','Arguing'],0,'Slow breathing can be one calming strategy.'],
          ['A bedtime routine works best when it is…',['Calm and predictable','Different every minute','A punishment','A competition'],0,'Predictability can make routines easier to follow.']
        ]},
        '10-12': { name:'Routine Strategy Mission', questions:[
          ['You keep forgetting something needed in the morning. Which strategy is most practical?',['Create one consistent place for it the night before','Rely on remembering under pressure','Hide it in a new place each day','Skip it permanently'],0,'Changing the environment can reduce the memory load on a busy morning.'],
          ['A routine feels too long. What is a useful first change?',['Identify essential steps and simplify the sequence','Add more steps','Turn it into a punishment','Give up on all routines'],0,'Shorter, realistic routines are often easier to maintain.'],
          ['You are frustrated halfway through. Which response supports self-management?',['Pause, reset and continue with the next small step','Decide the whole day is ruined','Start an argument','Pretend the feeling is not there'],0,'A short reset can make it easier to return to the task.'],
          ['Why can doing some preparation the night before help?',['It reduces decisions and searching in the morning','It makes time move slower','It guarantees nothing unexpected happens','It removes the need for sleep'],0,'Preparation reduces the number of tasks competing for attention.'],
          ['Which is a fair way to review a routine?',['Notice what worked, what did not, and adjust','Judge yourself as good or bad','Compare yourself with everyone else','Never change the plan'],0,'Reflection should focus on the system and strategy, not character labels.']
        ]},
        '13-16': { name:'Self-Management Systems Lab', questions:[
          ['A routine repeatedly fails at the same point. Which analysis is most useful?',['Identify the friction at that step and redesign the environment or sequence','Conclude you lack discipline','Add shame as motivation','Keep the exact system forever'],0,'Designing around predictable friction is more actionable than making character judgements.'],
          ['Which plan best uses an implementation intention?',['If I finish brushing my teeth, then I put my phone on charge outside the sleep area','I will probably remember somehow','I must never make a mistake','I will change five habits tonight'],0,'“If–then” plans link a clear cue to a specific action.'],
          ['Why might a very ambitious routine be less sustainable?',['High effort and too many steps can increase friction','Ambition always guarantees success','More steps automatically create more time','Complexity has no effect on behaviour'],0,'Systems are easier to sustain when the effort and number of decisions are realistic.'],
          ['What is the best interpretation of one difficult night?',['One data point; review patterns before changing the whole plan','Proof the plan can never work','Proof something is wrong with you','A reason for punishment'],0,'Good self-management uses patterns and evidence rather than global judgements from one event.'],
          ['Which review question is most constructive?',['What change would make the next attempt easier?','Who should I blame?','How can I make the consequence harsher?','How do I hide the problem?'],0,'A constructive review looks for practical changes that support the next attempt.']
        ]}
      }
    }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function getAgeMeta(ageBand) { return ageMeta[ageBand] || ageMeta['7-9']; }

  function getGame(gameKey, ageBand) {
    const family = content[gameKey] || content.space;
    const meta = getAgeMeta(ageBand);
    const level = family.levels[ageBand] || family.levels['7-9'];
    return {
      key: gameKey in content ? gameKey : 'space',
      icon: family.icon,
      skill: family.skill,
      ageBand,
      ageLabel: meta.label,
      difficultyLabel: meta.difficulty,
      mode: meta.mode,
      ageSummary: meta.summary,
      name: level.name,
      questions: clone(level.questions)
    };
  }

  function listScience(ageBand) {
    return ['space','body'].map(key => getGame(key, ageBand));
  }

  window.OrishAgeGames = { ageMeta, getAgeMeta, getGame, listScience };
})();
