(() => {
  'use strict';

  const frameworkNames = {
    england: 'England National Curriculum / EYFS-aligned tags',
    scotland: 'Scotland Curriculum for Excellence tags',
    wales: 'Curriculum for Wales tags',
    ni: 'Northern Ireland Curriculum tags',
    us: 'US Common Core + NGSS starter tags',
    custom: 'Flexible homeschool learning goals'
  };

  const maps = {
    space: {
      subject: 'Science',
      objectives: {
        '0-2': 'Notice light, movement, shape and simple day/night language with an adult.',
        '2-4': 'Use simple words for sky, Sun, Moon, stars and daytime/night-time.',
        '4-6': 'Recognise Earth, Sun and Moon and describe simple observable patterns.',
        '7-9': 'Describe the Solar System and explain that gravity helps keep planets in orbit.',
        '10-12': 'Use evidence and models to explain orbital motion and compare Solar System bodies.',
        '13-16': 'Apply gravitational, scale and systems thinking to astronomical questions.'
      }
    },
    body: {
      subject: 'Science',
      objectives: {
        '0-2': 'Name familiar body parts through parent-led songs, movement and play.',
        '2-4': 'Identify major external body parts and connect them to movement and senses.',
        '4-6': 'Identify basic body structures and describe simple functions.',
        '7-9': 'Explain basic roles of the skeleton, muscles, heart and lungs.',
        '10-12': 'Connect major organ systems and explain how they support the body.',
        '13-16': 'Use systems-level reasoning to explain human physiology and homeostasis.'
      }
    },
    math: {
      subject: 'Mathematics',
      objectives: {
        '0-2': 'Explore quantity words such as one, more, big and small with an adult.',
        '2-4': 'Count small groups and notice simple shape, size and quantity patterns.',
        '4-6': 'Use number bonds, simple addition/subtraction and early fractions in context.',
        '7-9': 'Use multiplication, addition, subtraction and simple fractions fluently.',
        '10-12': 'Apply number, fraction and proportional reasoning to multi-step problems.',
        '13-16': 'Use algebraic, proportional and quantitative reasoning in unfamiliar problems.'
      }
    },
    paper: {
      subject: 'Science & Design',
      objectives: {
        '0-2': 'Explore safe textures, movement and cause-and-effect with an adult.',
        '2-4': 'Make, fold and compare simple objects using descriptive language.',
        '4-6': 'Build and test a simple design, noticing what changes.',
        '7-9': 'Plan a fair comparison and measure a simple outcome such as flight distance.',
        '10-12': 'Control variables, record measurements and refine a design using evidence.',
        '13-16': 'Analyse variables, uncertainty and design trade-offs using recorded data.'
      }
    },
    story: {
      subject: 'Personal development & literacy',
      objectives: {
        '0-2': 'Use calm parent-led stories and predictable routines to support connection.',
        '2-4': 'Follow a short sequence and name simple feelings and routine choices.',
        '4-6': 'Sequence routine steps and discuss helpful choices in a story.',
        '7-9': 'Reflect on routines, choices and consequences using age-appropriate reasoning.',
        '10-12': 'Evaluate strategies for routines, emotions and self-management.',
        '13-16': 'Apply reflective decision-making and self-management to real-life routines.'
      }
    }
  };

  function getFrameworkName(key) { return frameworkNames[key] || frameworkNames.custom; }

  function mapGame(gameKey, ageBand, frameworkKey) {
    const map = maps[gameKey] || maps.story;
    return {
      subject: map.subject,
      framework: getFrameworkName(frameworkKey),
      objective: map.objectives[ageBand] || map.objectives['7-9']
    };
  }

  function createMissionBlueprint({ ageBand, curriculum, focus, format, parentGoal }) {
    const framework = getFrameworkName(curriculum);
    const safeFocus = String(focus || 'learning curiosity').slice(0, 60);
    const templates = {
      'Game mission': {
        childTitle: 'Mission: Level Up',
        childIntro: `Orish has a challenge about ${safeFocus.toLowerCase()}. Complete three small choices, then finish with one real-world action.`,
        evidence: 'choices completed, level of support, final action'
      },
      'Interactive story': {
        childTitle: 'Orish and the Next Choice',
        childIntro: `Follow Orish through a story about ${safeFocus.toLowerCase()} and choose what happens next.`,
        evidence: 'story choices, explanation, reflection'
      },
      'Nursery rhyme / rhyme': {
        childTitle: 'Orish’s Little Learning Rhyme',
        childIntro: `A short parent-led rhyme with movement and repetition around ${safeFocus.toLowerCase()}.`,
        evidence: 'participation and repeated words/actions'
      },
      'Family activity': {
        childTitle: 'Family Team Mission',
        childIntro: `Work together on a short family challenge about ${safeFocus.toLowerCase()} with no winner or loser.`,
        evidence: 'participation, turn-taking and completion'
      },
      'Science challenge': {
        childTitle: 'Orish’s Experiment Lab',
        childIntro: `Make a prediction, try one safe test, notice what happened and explain one thing you learned.`,
        evidence: 'prediction, observation and explanation'
      },
      'Routine adventure': {
        childTitle: 'Mission: Ready to Go',
        childIntro: `Turn ${safeFocus.toLowerCase()} into a calm sequence with a clear start, steps and finish.`,
        evidence: 'sequence completion and number of prompts'
      }
    };
    const base = templates[format] || templates['Game mission'];
    return {
      ...base,
      ageBand,
      framework,
      parentGoalPrivate: String(parentGoal || '').slice(0, 300),
      safetyNote: 'The child-facing activity does not reveal or quote the parent’s private wording.'
    };
  }

  window.OrishCurriculum = { frameworkNames, getFrameworkName, mapGame, createMissionBlueprint };
})();
