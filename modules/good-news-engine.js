(() => {
  'use strict';

  // V1.9 contains intentionally static, editorially approved DEMO cards only.
  // They are not presented as live/current reporting and no network request is made.
  const stories = [
    {
      id:'pollinator-rooftop', category:'Nature', icon:'🐝',
      title:'A rooftop becomes a tiny pollinator haven',
      summary:'A community turns an unused roof into a garden with flowers, water and shelter for bees and butterflies.',
      whyGood:'Small spaces can help wildlife when people design them thoughtfully.',
      learn:'Pollinators help many flowering plants reproduce and support food webs.',
      tryIt:'Look for three different flower shapes outdoors or in a book. What kind of insect might reach each one?'
    },
    {
      id:'solar-school', category:'Science', icon:'☀️',
      title:'A school learns from the power on its roof',
      summary:'Students use a solar display to compare how much electricity their building makes on bright and cloudy days.',
      whyGood:'The building becomes a real-life science lab while using renewable energy.',
      learn:'Solar panels convert light energy into electrical energy; output changes with conditions.',
      tryIt:'Predict whether morning, midday or evening would usually give the strongest sunlight. Explain your reason.'
    },
    {
      id:'library-repair', category:'Community', icon:'🧰',
      title:'A library hosts a repair-and-share afternoon',
      summary:'Families bring simple broken household items and learn how repair, reuse and sharing can reduce waste.',
      whyGood:'People learn useful skills together and keep usable things out of the bin.',
      learn:'Repair and reuse can extend a product’s life and reduce demand for new materials.',
      tryIt:'Choose one everyday object. List the materials it contains and one way its life could be extended.'
    },
    {
      id:'accessible-play', category:'People', icon:'🛝',
      title:'Children help redesign a more accessible play space',
      summary:'A design team asks children with different needs what would make a play area easier, clearer and more enjoyable to use.',
      whyGood:'The people who use a place can help designers notice barriers that are easy to miss.',
      learn:'Accessible design considers different ways people move, see, hear, understand and interact.',
      tryIt:'Pick a playground or app feature. Name one change that could make it easier for more people to use.'
    },
    {
      id:'river-clean', category:'Earth', icon:'💧',
      title:'Neighbours map litter before a river clean-up',
      summary:'Volunteers first record where litter collects, then use the map to plan a safer, more effective clean-up with adults leading hazardous tasks.',
      whyGood:'Collecting evidence before acting can make a community project more effective.',
      learn:'Maps and repeated observations can reveal patterns in where materials move and collect.',
      tryIt:'Imagine rain moving a leaf along a street. Where might it stop, and what evidence would help you test your idea?'
    },
    {
      id:'space-images', category:'Space', icon:'🔭',
      title:'Young astronomers compare images to spot change',
      summary:'A youth astronomy club practises comparing sky images taken at different times to look for objects that changed position or brightness.',
      whyGood:'Careful observation can turn a huge sky into a solvable evidence puzzle.',
      learn:'Astronomers compare measurements and images over time before deciding what a change might mean.',
      tryIt:'What is the difference between noticing a change and explaining what caused it?'
    }
  ];

  const ageGuidance = {
    '0-2': {label:'Grown-up + baby', intro:'Grown-up reads the short idea aloud and notices pictures, sounds or movement together.', question:'Can you point, name or make a sound together? No answer is expected.'},
    '2-4': {label:'Early Explorer', intro:'One hopeful idea, one simple fact and one thing to notice together.', question:'What do you notice? What would you like to help? '},
    '4-6': {label:'Little Explorer', intro:'A short positive story with a simple science or community idea.', question:'What happened, and why was it helpful?'},
    '7-9': {label:'Growing Explorer', intro:'Look for the problem people noticed, what they tried and what changed.', question:'What evidence would show the idea is working?'},
    '10-12': {label:'Big Explorer', intro:'Separate the hopeful outcome from the evidence needed to support it.', question:'What would you measure before and after to test the result?'},
    '13-16': {label:'Teen Explorer', intro:'Treat each card as a media-literacy prompt: claim, evidence, uncertainty and possible trade-offs.', question:'Which claim is supported, what remains uncertain, and what additional source would you want?'}
  };

  function getStories(category='All') {
    return category === 'All' ? stories.slice() : stories.filter(story => story.category === category);
  }
  function getStory(id) { return stories.find(story => story.id === id) || stories[0]; }
  function getCategories() { return ['All', ...Array.from(new Set(stories.map(story => story.category)))]; }
  function getAgeGuidance(ageBand) { return ageGuidance[ageBand] || ageGuidance['7-9']; }
  function beaconForDate(date = new Date()) {
    const day = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000);
    return stories[Math.abs(day) % stories.length];
  }

  window.OrishGoodNews = { getStories, getStory, getCategories, getAgeGuidance, beaconForDate };
})();
