(() => {
  'use strict';

  const families = {
    planet:{icon:'🪐',subject:'Creative Design & Science',title:'Invent a World'},
    comic:{icon:'💬',subject:'English & Creative Design',title:'Four-Frame Story Lab'},
    habitat:{icon:'🏡',subject:'Science & Design',title:'Design a Habitat'},
    symbol:{icon:'🎨',subject:'Art & Design',title:'Create a Symbol System'}
  };

  const briefs = {
    '0-2': {
      planet:{name:'Colour World Together',brief:'Grown-up chooses two bold colours and makes a simple “planet” picture while naming the colours and shapes.',constraints:['Parent-led only','Use large safe art materials','Talk about colour and shape'],objective:'Share attention, colour words and simple shape language.'},
      comic:{name:'Two-Picture Story Together',brief:'Grown-up makes two simple pictures: first something appears, then something changes.',constraints:['Parent-led','Two pictures only','Use simple repeated words'],objective:'Share simple sequence language: first and next.'},
      habitat:{name:'Cosy Place Picture',brief:'Together, look at or draw a simple safe place for a favourite toy animal.',constraints:['Large shapes','Adult-led','Name one thing the animal needs'],objective:'Use simple language about places and needs.'},
      symbol:{name:'Big Mark Together',brief:'Grown-up makes one large repeated mark or shape and names it each time.',constraints:['Adult-led','One large shape','No small craft pieces'],objective:'Notice repeated marks and visual patterns.'}
    },
    '2-4': {
      planet:{name:'My Funny Planet',brief:'Pick a colour, weather and one creature for an imaginary planet.',constraints:['Choose 1 colour','Choose 1 kind of weather','Add 1 creature'],objective:'Combine simple choices into an imaginative world.'},
      comic:{name:'First–Next–Last Pictures',brief:'Make three pictures showing what happens first, next and last.',constraints:['3 frames','One main character','Clear ending'],objective:'Sequence three events in order.'},
      habitat:{name:'Animal Home Designer',brief:'Choose an animal and draw a home with food, water and a safe resting place.',constraints:['Food','Water','Resting place'],objective:'Connect basic animal needs to a simple habitat.'},
      symbol:{name:'Shape Badge',brief:'Make a badge using two shapes and two colours.',constraints:['2 shapes','2 colours','Repeat one shape'],objective:'Create and repeat a simple visual pattern.'}
    },
    '4-6': {
      planet:{name:'Planet Designer',brief:'Invent a planet and show its sky, surface and one living thing.',constraints:['Sky','Surface','Living thing','Give it a name'],objective:'Use science-inspired features in imaginative design.'},
      comic:{name:'Four-Frame Adventure',brief:'Create a beginning, problem, idea and ending across four frames.',constraints:['4 frames','Problem','Solution','Ending'],objective:'Build a simple narrative structure.'},
      habitat:{name:'Build-a-Habitat Blueprint',brief:'Design a habitat for an animal and label three things it needs.',constraints:['Shelter','Food/water','Space to move'],objective:'Represent how a habitat supports living things.'},
      symbol:{name:'Explorer Emblem',brief:'Design an emblem using shape, line and one repeated pattern.',constraints:['1 main shape','1 repeated pattern','Explain what it means'],objective:'Use visual elements to communicate an idea.'}
    },
    '7-9': {
      planet:{name:'World-Building Mission',brief:'Design a planet whose temperature, gravity and surface affect how living things move or survive.',constraints:['Choose gravity','Choose climate','Design one adaptation','Name the world'],objective:'Connect environmental conditions to imaginative biological adaptations.'},
      comic:{name:'Clue Comic',brief:'Create a four-to-six-frame mystery comic with one clue that matters to the ending.',constraints:['4–6 frames','One real clue','One mistaken guess','Clear resolution'],objective:'Use sequencing, clues and cause-and-effect in narrative.'},
      habitat:{name:'Resilient Habitat Design',brief:'Design a habitat that handles one challenge such as heat, cold, flooding or drought.',constraints:['Choose a challenge','Add 3 design responses','Label resources'],objective:'Use environmental reasoning in a design solution.'},
      symbol:{name:'Mission Patch System',brief:'Create three related mission patches that share a visual rule but represent different achievements.',constraints:['3 patches','Shared shape or border','Different inner symbol','Explain the visual rule'],objective:'Create a coherent visual system using repetition and variation.'}
    },
    '10-12': {
      planet:{name:'Exoplanet Concept Lab',brief:'Design a plausible fictional exoplanet from a star type, orbit, atmosphere and surface condition, then decide what evidence an astronomer might detect.',constraints:['Star type','Orbit','Atmosphere','Surface','Observable clue'],objective:'Connect scientific variables to a coherent world model.'},
      comic:{name:'Perspective Comic',brief:'Tell the same event from two characters’ perspectives and show where their interpretations differ.',constraints:['Two viewpoints','Shared event','Different interpretation','One point of agreement'],objective:'Use narrative perspective and evidence from events.'},
      habitat:{name:'Closed-Loop Habitat',brief:'Design a small habitat where water, food, waste and energy flows are shown as a system.',constraints:['Water flow','Food source','Waste route','Energy source'],objective:'Model interdependent systems in a designed environment.'},
      symbol:{name:'Interface Icon Set',brief:'Design four icons for an imaginary app so users can understand them without labels.',constraints:['4 related icons','Consistent line/shape rule','Distinct meanings','User test'],objective:'Apply consistency, affordance and user testing to visual communication.'}
    },
    '13-16': {
      planet:{name:'Speculative Planet Systems Brief',brief:'Create a scientifically constrained world model and state which features are evidence-based, inferred or deliberately speculative.',constraints:['Physical constraints','Atmosphere/climate','Habitability assumption','Evidence vs speculation labels','One uncertainty'],objective:'Separate scientific constraints from creative inference in world-building.'},
      comic:{name:'Nonlinear Story Prototype',brief:'Design a short visual narrative where frame order or viewpoint changes what the reader initially believes.',constraints:['Controlled reveal','At least 2 viewpoints or time points','Visual clue','Re-read meaning changes'],objective:'Use structure and visual evidence to manipulate and then resolve interpretation.'},
      habitat:{name:'Resilient Systems Design',brief:'Design a habitat under a realistic constraint such as limited energy, water or space, then identify trade-offs.',constraints:['Fixed constraint','Resource flows','Failure mode','Trade-off','Revision'],objective:'Optimise a designed system under constraints and explain trade-offs.'},
      symbol:{name:'Accessible Visual Language',brief:'Create a small icon system and evaluate it for clarity, contrast, cultural ambiguity and accessibility.',constraints:['4–6 icons','Consistency rule','Contrast check','Ambiguity check','User test'],objective:'Evaluate visual communication using accessibility and usability criteria.'}
    }
  };

  function list(ageBand){
    const band=briefs[ageBand] ? ageBand : '7-9';
    return Object.keys(families).map(id=>get(id,band));
  }

  function get(id,ageBand){
    const band=briefs[ageBand] ? ageBand : '7-9';
    const family=families[id]||families.planet;
    const detail=briefs[band][id]||briefs[band].planet;
    return {id,ageBand,icon:family.icon,subject:family.subject,familyTitle:family.title,...JSON.parse(JSON.stringify(detail))};
  }

  window.OrishCreative={families,briefs,list,get};
})();