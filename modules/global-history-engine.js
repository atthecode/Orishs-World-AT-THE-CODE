(() => {
  'use strict';

  const AGE_MODE = {
    '0-2': { label:'Grown-up & Little Listener', mode:'guided', prompt:'Look, listen and notice. A grown-up tells the true story in a few simple sentences.' },
    '2-4': { label:'Little Culture Explorer', mode:'guided', prompt:'Meet a real person or tradition, notice one big idea, then move, point, match or make.' },
    '4-6': { label:'Young History Explorer', mode:'supported', prompt:'Follow a short true-story trail: problem → idea → change. Orish explains unfamiliar words.' },
    '7-9': { label:'History Detective', mode:'supported', prompt:'Collect clues from the journey, connect cause and effect, and identify what changed.' },
    '10-12': { label:'Evidence Historian', mode:'independent', prompt:'Compare achievements with context, barriers, evidence and reliable source organisations.' },
    '13-16': { label:'Critical History Investigator', mode:'independent', prompt:'Examine evidence, power, missing voices, contested credit, context and how historical narratives are built.' }
  };

  const CHANGEMAKERS = [
    {
      id:'alice-ball', name:'Alice Augusta Ball', years:'1892–1916', region:'Hawaiʻi / United States', roots:'African American', field:'Chemistry & medicine', icon:'⚗️',
      short:'A young chemist whose method made chaulmoogra-oil compounds injectable and became an important treatment for Hansen’s disease before modern drugs replaced it.',
      journey:[
        'Ball studied chemistry and became the first woman and first African American to earn a master’s degree from the College of Hawaiʻi.',
        'She developed a way to isolate compounds from chaulmoogra oil so they could be prepared for injection.',
        'The treatment became known as the Ball Method and was used for patients with Hansen’s disease.',
        'Ball died at only 24, before she could publish the work herself; later researchers restored recognition of her contribution.'
      ],
      changed:'Her chemistry improved how a difficult treatment could be administered and her story is also a case study in how scientific credit can be lost and later recovered.',
      question:'Why is Alice Ball’s story useful when learning how scientific credit should be checked?',
      choices:['Because the loudest person always gets the credit','Because records can help trace who actually developed an idea','Because only modern scientists matter','Because inventions never involve teamwork'], correct:1,
      sourceTrail:[
        {org:'University of Hawaiʻi', title:'Ball Method declared national historic landmark at Alice Ball celebration', url:'https://www.hawaii.edu/news/2026/02/26/ball-method-national-landmark/'},
        {org:'University of Hawaiʻi', title:'Alice Ball scholarship honors pioneering chemist', url:'https://www.hawaii.edu/news/2017/02/23/alice-ball-scholarship-honors-pioneering-chemist-in-fight-against-hansens-disease/'}
      ]
    },
    {
      id:'frederick-jones', name:'Frederick McKinley Jones', years:'1893–1961', region:'United States', roots:'Black American', field:'Engineering & refrigeration', icon:'❄️',
      short:'An engineer who developed a successful mobile refrigeration system that transformed the transport of food, medicine and other perishables.',
      journey:[
        'Jones developed mechanical and electrical skills largely through practical work and self-directed learning.',
        'A problem with food spoiling during transport led him to design a compact refrigeration unit for vehicles.',
        'His system could withstand travel and keep goods cold without relying on ice and salt.',
        'Mobile refrigeration helped make long-distance transport of fresh food and temperature-sensitive supplies far more practical.'
      ],
      changed:'Reliable refrigeration changed supply chains and helped food and medical supplies travel farther while staying usable.',
      question:'What problem was Jones primarily solving with mobile refrigeration?',
      choices:['Making trucks travel faster','Keeping perishable goods cold while they travelled','Making roads wider','Turning food into electricity'], correct:1,
      sourceTrail:[{org:'National Inventors Hall of Fame', title:'Frederick McKinley Jones — Mobile Refrigeration', url:'https://www.invent.org/inductees/frederick-mckinley-jones'}]
    },
    {
      id:'norbert-rillieux', name:'Norbert Rillieux', years:'1806–1894', region:'New Orleans / France', roots:'Creole of colour', field:'Chemical engineering', icon:'🧪',
      short:'An engineer whose multiple-effect evaporation process made sugar refining more efficient and safer and influenced industrial evaporation far beyond sugar.',
      journey:[
        'Rillieux studied engineering in France and taught applied mechanics in Paris.',
        'Traditional sugar processing used repeated open boiling, consuming fuel and exposing workers to dangerous conditions.',
        'Rillieux designed a system where vapour and vacuum stages reused heat across connected chambers.',
        'The idea reduced fuel use and became an important foundation for modern industrial evaporation.'
      ],
      changed:'His work connected thermodynamics, safety and industrial efficiency, and versions of multiple-effect evaporation are used in many industries.',
      question:'Which engineering idea made Rillieux’s process more efficient?',
      choices:['Throwing away hot vapour','Reusing heat through connected evaporation stages','Cooling sugar outdoors','Adding more open boiling pots'], correct:1,
      sourceTrail:[{org:'National Inventors Hall of Fame', title:'Norbert Rillieux — Automated Sugar Refining', url:'https://www.invent.org/inductees/norbert-rillieux'}]
    },
    {
      id:'george-carruthers', name:'George R. Carruthers', years:'1939–2020', region:'United States', roots:'Black American', field:'Space science & engineering', icon:'🌌',
      short:'A scientist and engineer who developed ultraviolet imaging technology used on Apollo 16, creating the first Moon-based astronomical observatory.',
      journey:[
        'Carruthers developed instruments that could detect far-ultraviolet light, which Earth’s atmosphere usually blocks.',
        'He developed the ultraviolet camera/spectrograph used during Apollo 16.',
        'Astronauts placed the instrument on the Moon in 1972, where it photographed Earth and other astronomical targets in ultraviolet light.',
        'His work helped scientists study Earth’s outer atmosphere and objects in space in wavelengths invisible to human eyes.'
      ],
      changed:'His instrument expanded how scientists could observe Earth’s geocorona and the universe from beyond the atmosphere.',
      question:'Why was putting an ultraviolet observatory on the Moon scientifically useful?',
      choices:['The Moon produces ultraviolet paint','Earth’s atmosphere blocks much far-ultraviolet light','The Moon has more oxygen','Telescopes only work at night'], correct:1,
      sourceTrail:[
        {org:'NASA', title:'Looking Back: Dr. George Carruthers and Apollo 16 Far Ultraviolet Camera/Spectrograph', url:'https://www.nasa.gov/image-article/looking-back-dr-george-carruthers-apollo-16-far-ultraviolet-camera-spectrograph/'},
        {org:'NASA', title:'Earth in Far-Ultraviolet', url:'https://www.nasa.gov/image-article/earth-in-far-ultraviolet/'}
      ]
    },
    {
      id:'kofoworola-pratt', name:'Kofoworola Abeni Pratt', years:'c.1915–1992', region:'Nigeria / United Kingdom', roots:'Nigerian', field:'Nursing & public health leadership', icon:'🩺',
      short:'A Nigerian nurse and health leader who trained in London, became a senior nursing leader in independent Nigeria and influenced nursing internationally.',
      journey:[
        'Pratt retrained as a nurse at St Thomas’ Hospital in London and continued studying midwifery, tropical medicine and nursing administration.',
        'She returned to Nigeria with advanced clinical and leadership experience.',
        'In 1964 she became the first Nigerian nurse appointed matron of University College Hospital, Ibadan, a role previously held by white British nurses under colonial rule.',
        'She later became chief nursing officer, helped develop professional nursing organisations and represented nursing internationally.'
      ],
      changed:'Her career shows how professional leadership, education and independence-era institution building changed opportunities within nursing.',
      question:'What makes Pratt’s journey more than a story about being “first”?',
      choices:['She only collected titles','She used training and leadership to build stronger nursing institutions','She stopped nurses from studying','She worked only in one hospital'], correct:1,
      sourceTrail:[{org:'Royal College of Nursing', title:'Fearless about being first — Kofoworola Abeni Pratt', url:'https://www.rcn.org.uk/magazines/History/2022/Jan/Fearless-about-being-first-Nigeria-Kofoworola-Abeni-Pratt'}]
    },
    {
      id:'olive-morris', name:'Olive Morris', years:'1952–1979', region:'Jamaica / United Kingdom', roots:'Jamaican-born Black British', field:'Community organising', icon:'✊🏾',
      short:'A community organiser in 1970s Britain who campaigned around racial, gender, housing and social equality and helped create organisations led by Black women.',
      journey:[
        'Morris moved from Jamaica to South London as a child and became active in community organising as a young adult.',
        'She worked on issues affecting Black communities, including housing, policing and racial discrimination.',
        'She was a founder member of the Brixton Black Women’s Group and was involved in wider Black and feminist organising.',
        'Although she died at 27, archives of her work continue to help researchers understand grassroots activism in 1970s Britain.'
      ],
      changed:'Her story highlights community organising: change can come from people building groups, documenting problems and acting together, not only from famous office-holders.',
      question:'What kind of historical evidence could help us understand grassroots organisers such as Olive Morris?',
      choices:['Only statues','Archives such as photographs, group records, leaflets and personal papers','Only rumours','Only fictional films'], correct:1,
      sourceTrail:[
        {org:'Black Cultural Archives', title:'Celebrating Olive Morris', url:'https://blackculturalarchives.org/blog/olivemorriscelebration'},
        {org:'Black Cultural Archives', title:'Black Women’s Movement Subject Guide', url:'https://blackculturalarchives.org/s/Black-Womens-Movement-Subject-Guide.pdf'}
      ]
    },
    {
      id:'claudia-jones', name:'Claudia Jones', years:'1915–1964', region:'Trinidad / United States / United Kingdom', roots:'Trinidad-born Black British', field:'Journalism & community organising', icon:'📰',
      short:'A journalist and political organiser who founded the West Indian Gazette in Britain and helped organise an early Caribbean carnival event in London.',
      journey:[
        'Jones was born in Trinidad, grew up in the United States and later lived in Britain after being deported from the US.',
        'In 1958 she launched the West Indian Gazette, a campaigning newspaper serving Black communities in Britain.',
        'She used journalism, politics and cultural organising to connect community issues with public action.',
        'In 1959 she helped organise a Caribbean carnival-style indoor event in London, part of the history that preceded today’s Notting Hill Carnival.'
      ],
      changed:'Her life links journalism, migration, politics and cultural celebration, showing how newspapers and community events can become tools for organising.',
      question:'Why is it useful to distinguish the 1959 indoor carnival from the later Notting Hill Carnival?',
      choices:['Because history is stronger when we keep timelines precise','Because dates never matter','Because they happened in the same room','Because all carnivals are identical'], correct:0,
      sourceTrail:[
        {org:'Black Cultural Archives', title:'Black Sound Subject Guide', url:'https://blackculturalarchives.org/s/Black-Sound-Subject-Guide.pdf'},
        {org:'Black Cultural Archives', title:'BCA x TfL — Claudia Jones', url:'https://blackculturalarchives.org/bca-x-tfl'}
      ]
    },
    {
      id:'arthur-wharton', name:'Arthur Wharton', years:'1865–1930', region:'Gold Coast (Ghana) / United Kingdom', roots:'Ghanaian-born', field:'Sport & social history', icon:'⚽',
      short:'A Ghanaian-born athlete remembered as the first professional Black footballer in England, whose career opens wider questions about race, sport and Victorian Britain.',
      journey:[
        'Wharton was born in the Gold Coast, in present-day Ghana, and came to Britain in the nineteenth century.',
        'He was a talented multi-sport athlete and became known particularly as a goalkeeper.',
        'He became the first professional Black footballer in England.',
        'His story helps historians examine Black presence in Britain well before the mid-twentieth-century migration stories that are more commonly taught.'
      ],
      changed:'Wharton’s career is evidence that Black British history stretches across many periods and fields, including Victorian sport.',
      question:'What mistaken idea does Wharton’s story help challenge?',
      choices:['That football was invented yesterday','That Black people were absent from British life before the twentieth century','That goalkeepers cannot run','That sport has no history'], correct:1,
      sourceTrail:[{org:'Black Cultural Archives', title:'Leisure Puzzle — Arthur Wharton', url:'https://blackculturalarchives.org/leisure-jigsaw'}]
    }
  ];

  const CULTURES = [
    {
      id:'kente', name:'Kente weaving', region:'Ghana', communities:'Asante and Ewe weaving traditions', icon:'🧵', theme:'Textile, mathematics & status',
      short:'Kente is made from narrow woven strips joined to form larger cloths. Asante and Ewe traditions developed distinctive approaches, and patterns, materials and use carry historical context.',
      explore:['Look for repeated units and symmetry in strip weaving.','Notice that Asante and Ewe traditions are related but not identical.','Ask who made, wore or commissioned a cloth and in what period.'],
      respect:'Do not reduce kente to “African pattern”. Name the community, place, period and use when the evidence allows it.',
      mission:'Design a paper strip pattern using repetition and symmetry, then label which features are your own design rather than copying a sacred or named pattern.',
      sourceTrail:[{org:'The Metropolitan Museum of Art', title:'Royal man’s kente (prestige cloth) — Asante-Akan', url:'https://www.metmuseum.org/art/collection/search/894795'}]
    },
    {
      id:'whakapapa', name:'Whakapapa & ancestry', region:'Aotearoa New Zealand', communities:'Māori', icon:'🌿', theme:'Ancestry, relationships & time',
      short:'Whakapapa connects people through generations and to a wider web of relationships. It is more than a simple family-tree exercise and carries Māori ways of understanding connection and time.',
      explore:['Think about how histories can be organised through relationships as well as dates.','Notice that a cultural concept may not translate exactly into one English word.','Use sources created with or by the community when learning cultural concepts.'],
      respect:'Treat whakapapa as a living Māori concept, not a decorative theme. Children should not be asked to disclose private family history to use the lesson.',
      mission:'Build a fictional “connections web” for a made-up explorer showing relationships to people, places and nature without entering real private family data.',
      sourceTrail:[{org:'Museum of New Zealand Te Papa Tongarewa', title:'Understanding ancestry — whakapapa', url:'https://www.tepapa.govt.nz/learn/for-educators/teaching-resources/ko-au-te-taiao/ko-au-te-taiao-create/who-are-our-ancestors-and-what-are-their-stories/activity-a-understanding-ancestry'}]
    },
    {
      id:'dia-de-muertos', name:'Día de los Muertos', region:'Mexico', communities:'Indigenous communities of Mexico and wider contemporary communities', icon:'🌼', theme:'Memory, family & living heritage',
      short:'The Indigenous festivity dedicated to the dead is a living tradition in Mexico that brings together remembrance of deceased relatives with longstanding Indigenous practices and Catholic influences.',
      explore:['Distinguish a living cultural practice from a costume or Halloween theme.','Notice how traditions can combine histories from different periods.','Ask how families and communities practise traditions differently.'],
      respect:'Do not teach one family’s practice as if every Mexican person celebrates in exactly the same way.',
      mission:'Create a respectful remembrance-symbol study using flowers, food, paper craft and family memory as research topics — without copying sacred or personal material.',
      sourceTrail:[{org:'UNESCO Intangible Cultural Heritage', title:'Indigenous festivity dedicated to the dead', url:'https://ich.unesco.org/en/RL/indigenous-festivity-dedicated-to-the-dead-00054'}]
    },
    {
      id:'ukiyo-e', name:'Ukiyo-e woodblock prints', region:'Japan', communities:'Edo-period urban Japanese culture', icon:'🖼️', theme:'Art, printing & popular culture',
      short:'Ukiyo-e developed as paintings and woodblock prints connected to urban life in Edo-period Japan. Print technology helped images reach a broad paying public.',
      explore:['Look at line, flat colour, cropping and repeated print production.','Connect the art to Edo-period urban culture rather than treating it as timeless “Japanese style”.','Compare how technology changes who can access art.'],
      respect:'Avoid copying culturally specific imagery without context. Focus on printmaking ideas, historical setting and credited artists.',
      mission:'Design a two-colour paper print inspired by the idea of repeated blocks, but use an original scene from your own everyday life.',
      sourceTrail:[{org:'The Metropolitan Museum of Art', title:'Art of the Pleasure Quarters and the Ukiyo-e Style', url:'https://www.metmuseum.org/ja/essays/art-of-the-pleasure-quarters-and-the-ukiyo-e-style'}]
    }
  ];

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function ageMeta(ageBand){ return {...(AGE_MODE[ageBand] || AGE_MODE['7-9'])}; }
  function listChangemakers(){ return clone(CHANGEMAKERS); }
  function listCultures(){ return clone(CULTURES); }
  function getChangemaker(id){ const found=CHANGEMAKERS.find(item=>item.id===id); return found?clone(found):null; }
  function getCulture(id){ const found=CULTURES.find(item=>item.id===id); return found?clone(found):null; }
  function sourceCount(){ return CHANGEMAKERS.reduce((n,x)=>n+x.sourceTrail.length,0)+CULTURES.reduce((n,x)=>n+x.sourceTrail.length,0); }

  window.OrishGlobalHistory = Object.freeze({ ageMeta, listChangemakers, listCultures, getChangemaker, getCulture, sourceCount });
})();
