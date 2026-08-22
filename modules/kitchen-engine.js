(() => {
  'use strict';

  const KEY = 'orish.v1.kitchen';
  const categories = ['Bread','Homemade Butter','Cakes','Microwave Cakes','No-Heat','Family Baking'];

  const m = (name, key, metricQty, metricUnit, imperialQty, imperialUnit, cupsQty, cupsUnit, noScaleQty, noScaleUnit) => ({
    name, key,
    metric:{qty:metricQty,unit:metricUnit}, imperial:{qty:imperialQty,unit:imperialUnit},
    cups:{qty:cupsQty,unit:cupsUnit}, noScales:{qty:noScaleQty,unit:noScaleUnit}
  });

  const recipes = [
    {
      id:'yogurt-flatbread', title:'Two-Ingredient Yogurt Flatbread', category:'Bread', icon:'🫓', baseServings:4, time:'20 min', difficulty:'Easy', heat:true,
      ingredients:['flour','yogurt'], equipment:['bowl','spoon','frying pan'], allergens:['wheat','milk'],
      objective:'Measure ingredients, observe dough texture and follow a safe cooking sequence.',
      amounts:[m('plain flour','flour',120,'g',4.25,'oz',1,'cup',8,'level tbsp'),m('thick yogurt','yogurt',120,'g',4.25,'oz',0.5,'cup',8,'tbsp')],
      steps:[
        ['child','Measure the flour into a bowl.',0],['together','Add the yogurt and mix until a soft dough forms.',0],['together','Divide the dough and flatten each piece on a clean surface.',0],['adult','A grown-up heats the pan and cooks the flatbreads until cooked through.',360],['adult','A grown-up checks the bread is safely cooked and cool enough to handle.',0]
      ]
    },
    {
      id:'quick-soda-bread', title:'Quick Soda Bread', category:'Bread', icon:'🍞', baseServings:8, time:'45 min', difficulty:'Explorer', heat:true,
      ingredients:['flour','baking soda','yogurt','milk'], equipment:['bowl','spoon','oven','baking tray'], allergens:['wheat','milk'],
      objective:'Explore how a raising agent changes dough while practising measuring and sequencing.',
      amounts:[m('plain flour','flour',300,'g',10.6,'oz',2.5,'cups',20,'level tbsp'),m('baking soda','baking soda',5,'g',0.18,'oz',1,'tsp',1,'level tsp'),m('yogurt','yogurt',180,'g',6.35,'oz',0.75,'cup',12,'tbsp'),m('milk','milk',60,'ml',2,'fl oz',0.25,'cup',4,'tbsp')],
      steps:[['child','Measure the dry ingredients into the bowl.',0],['together','Stir in the yogurt and milk to make a soft dough.',0],['together','Shape the dough on a lined baking tray without overworking it.',0],['adult','A grown-up uses the oven and bakes until the loaf is risen and cooked through.',1800],['adult','A grown-up checks doneness and lets the loaf cool before slicing.',0]]
    },
    {
      id:'mini-yeast-rolls', title:'Mini Yeast Rolls', category:'Bread', icon:'🥖', baseServings:6, time:'1 hr 30', difficulty:'Challenge', heat:true,
      ingredients:['flour','yeast','water','oil','salt'], equipment:['bowl','spoon','oven','baking tray'], allergens:['wheat'],
      objective:'Observe yeast, time a rise and compare dough before and after fermentation.',
      amounts:[m('strong or plain flour','flour',250,'g',8.8,'oz',2,'cups',16,'level tbsp'),m('fast-action yeast','yeast',4,'g',0.14,'oz',1,'tsp',1,'level tsp'),m('warm water','water',160,'ml',5.4,'fl oz',0.67,'cup',11,'tbsp'),m('oil','oil',15,'ml',0.5,'fl oz',1,'tbsp',1,'tbsp'),m('salt','salt',3,'g',0.1,'oz',0.5,'tsp',0.5,'level tsp')],
      steps:[['together','A grown-up checks the water is warm, not hot. Mix flour, yeast and salt.',0],['together','Add water and oil, then mix into a dough.',0],['together','Knead together on a clean surface until smoother.',300],['together','Cover and leave the dough to rise. Notice how it changes.',2400],['together','Shape six small rolls and place them on a lined tray.',0],['adult','A grown-up bakes the rolls and checks they are cooked through.',900],['adult','Cool before eating.',0]]
    },
    {
      id:'banana-oat-loaf', title:'Banana Oat Loaf', category:'Bread', icon:'🍌', baseServings:8, time:'50 min', difficulty:'Easy', heat:true,
      ingredients:['banana','oats','flour','milk','oil','baking powder'], equipment:['bowl','spoon','oven','loaf tin'], allergens:['wheat','milk'],
      objective:'Measure, mash and compare how wet and dry ingredients combine into a baked loaf.',
      amounts:[m('ripe banana','banana',240,'g',8.5,'oz',1,'cup mashed',16,'tbsp mashed'),m('oats','oats',80,'g',2.8,'oz',1,'cup',16,'tbsp'),m('plain flour','flour',120,'g',4.25,'oz',1,'cup',8,'level tbsp'),m('milk','milk',120,'ml',4,'fl oz',0.5,'cup',8,'tbsp'),m('oil','oil',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp'),m('baking powder','baking powder',5,'g',0.18,'oz',1,'tsp',1,'level tsp')],
      steps:[['child','Mash the banana in a large bowl.',0],['child','Measure in the oats and flour.',0],['together','Add milk, oil and baking powder and stir until combined.',0],['adult','A grown-up transfers the mixture to the tin and uses the oven.',2100],['adult','A grown-up checks the centre is cooked and cools the loaf before slicing.',0]]
    },

    {
      id:'jar-butter', title:'Shake-a-Jar Butter', category:'Homemade Butter', icon:'🧈', baseServings:8, time:'15 min', difficulty:'Easy', heat:false,
      ingredients:['double cream'], equipment:['clean jar'], allergens:['milk'],
      objective:'Observe a physical change as cream separates into butter and buttermilk.',
      amounts:[m('double cream','double cream',250,'ml',8.5,'fl oz',1,'cup',17,'tbsp')],
      steps:[['together','Pour the cream into a clean jar, leaving room to shake.',0],['together','Fasten the lid tightly and check it together.',0],['child','Shake the jar. Take turns if arms get tired.',420],['adult','When butter separates, a grown-up drains the buttermilk safely.',0],['together','Press the butter gently and talk about how the cream changed.',0]]
    },
    {
      id:'whipped-butter', title:'Whipped Butter', category:'Homemade Butter', icon:'🥣', baseServings:8, time:'10 min', difficulty:'Easy', heat:false,
      ingredients:['double cream'], equipment:['bowl','whisk'], allergens:['milk'],
      objective:'Compare liquid cream with whipped and separated fat while practising observation.',
      amounts:[m('double cream','double cream',250,'ml',8.5,'fl oz',1,'cup',17,'tbsp')],
      steps:[['together','Pour the cream into a large bowl.',0],['together','Whisk until the cream becomes very thick.',180],['together','Keep whisking and watch for the liquid and butter to separate.',180],['adult','A grown-up drains the liquid and checks food safety.',0]]
    },
    {
      id:'herb-butter', title:'Garden Herb Butter', category:'Homemade Butter', icon:'🌿', baseServings:6, time:'8 min', difficulty:'Easy', heat:false,
      ingredients:['butter','herbs'], equipment:['bowl','spoon'], allergens:['milk'],
      objective:'Practise measuring small quantities and explore smell, texture and flavour combinations.',
      amounts:[m('soft butter','butter',100,'g',3.5,'oz',0.44,'cup',7,'tbsp'),m('prepared chopped herbs','herbs',10,'g',0.35,'oz',2,'tbsp',2,'tbsp')],
      steps:[['adult','A grown-up safely washes and prepares the herbs.',0],['child','Spoon the soft butter into a bowl.',0],['together','Mix in the herbs and notice the smell and colour.',0],['adult','A grown-up stores the butter safely in the fridge.',0]]
    },
    {
      id:'cinnamon-butter', title:'Cinnamon Honey Butter', category:'Homemade Butter', icon:'✨', baseServings:6, time:'5 min', difficulty:'Easy', heat:false, restrictedAgeBands:['0-2'], restrictionNote:'Honey is not suitable for children under 12 months. Because the 0–2 profile does not collect exact age, this recipe is hidden in that age band.',
      ingredients:['butter','honey','cinnamon'], equipment:['bowl','spoon'], allergens:['milk'],
      objective:'Use ratios and small measurements to make a simple flavoured butter.',
      amounts:[m('soft butter','butter',100,'g',3.5,'oz',0.44,'cup',7,'tbsp'),m('honey','honey',15,'ml',0.5,'fl oz',1,'tbsp',1,'tbsp'),m('ground cinnamon','cinnamon',1.5,'g',0.05,'oz',0.5,'tsp',0.5,'tsp')],
      steps:[['child','Put the soft butter into a bowl.',0],['child','Measure the honey and cinnamon.',0],['together','Mix until evenly combined.',0],['adult','A grown-up checks allergies and stores leftovers safely.',0]]
    },

    {
      id:'vanilla-cupcakes', title:'Simple Vanilla Cupcakes', category:'Cakes', icon:'🧁', baseServings:6, time:'35 min', difficulty:'Explorer', heat:true,
      ingredients:['flour','sugar','butter','egg','milk','baking powder','vanilla'], equipment:['bowl','spoon','oven','muffin tin'], allergens:['wheat','milk','egg'],
      objective:'Measure a simple cake ratio and observe how heat changes batter into cake.',
      amounts:[m('plain flour','flour',100,'g',3.5,'oz',0.83,'cup',7,'level tbsp'),m('sugar','sugar',80,'g',2.8,'oz',0.4,'cup',6,'level tbsp'),m('soft butter','butter',80,'g',2.8,'oz',0.35,'cup',5.5,'tbsp'),m('egg','egg',1,'egg',1,'egg',1,'egg',1,'egg'),m('milk','milk',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp'),m('baking powder','baking powder',4,'g',0.14,'oz',1,'tsp',1,'tsp'),m('vanilla','vanilla',2.5,'ml',0.08,'fl oz',0.5,'tsp',0.5,'tsp')],
      steps:[['together','Mix the soft butter and sugar until combined.',0],['together','Add the egg and vanilla and mix carefully.',0],['child','Measure in the flour and baking powder.',0],['together','Stir in the milk until the batter is smooth.',0],['adult','A grown-up portions the batter if needed and uses the oven.',1080],['adult','A grown-up checks the cakes are cooked and cool before eating.',0]]
    },
    {
      id:'banana-mini-cakes', title:'Banana Oat Mini Cakes', category:'Cakes', icon:'🍌', baseServings:6, time:'30 min', difficulty:'Easy', heat:true,
      ingredients:['banana','oats','egg','baking powder'], equipment:['bowl','spoon','oven','muffin tin'], allergens:['egg'],
      objective:'Explore natural sweetness, texture and simple measuring in a four-ingredient bake.',
      amounts:[m('ripe banana','banana',180,'g',6.3,'oz',0.75,'cup mashed',12,'tbsp mashed'),m('oats','oats',90,'g',3.2,'oz',1.1,'cups',18,'tbsp'),m('egg','egg',1,'egg',1,'egg',1,'egg',1,'egg'),m('baking powder','baking powder',4,'g',0.14,'oz',1,'tsp',1,'tsp')],
      steps:[['child','Mash the banana.',0],['together','Mix in the egg.',0],['child','Add oats and baking powder and stir.',0],['adult','A grown-up portions the mixture and uses the oven.',900],['adult','Cool before serving.',0]]
    },
    {
      id:'lemon-yogurt-cake', title:'Lemon Yogurt Cake', category:'Cakes', icon:'🍋', baseServings:8, time:'45 min', difficulty:'Explorer', heat:true,
      ingredients:['flour','sugar','yogurt','oil','egg','lemon','baking powder'], equipment:['bowl','spoon','oven','cake tin'], allergens:['wheat','milk','egg'],
      objective:'Practise measuring and investigate how acid, raising agent and heat affect cake structure.',
      amounts:[m('plain flour','flour',180,'g',6.35,'oz',1.5,'cups',12,'level tbsp'),m('sugar','sugar',100,'g',3.5,'oz',0.5,'cup',8,'level tbsp'),m('yogurt','yogurt',150,'g',5.3,'oz',0.63,'cup',10,'tbsp'),m('oil','oil',60,'ml',2,'fl oz',0.25,'cup',4,'tbsp'),m('egg','egg',2,'eggs',2,'eggs',2,'eggs',2,'eggs'),m('prepared lemon juice/zest','lemon',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp'),m('baking powder','baking powder',8,'g',0.28,'oz',2,'tsp',2,'tsp')],
      steps:[['adult','A grown-up safely prepares the lemon zest/juice.',0],['together','Mix yogurt, oil, eggs and lemon.',0],['child','Measure flour, sugar and baking powder.',0],['together','Fold wet and dry ingredients together.',0],['adult','A grown-up transfers to the tin and uses the oven.',1800],['adult','Check doneness and cool completely before slicing.',0]]
    },
    {
      id:'chocolate-tray-cake', title:'Simple Chocolate Tray Cake', category:'Cakes', icon:'🍫', baseServings:9, time:'45 min', difficulty:'Explorer', heat:true,
      ingredients:['flour','sugar','cocoa','milk','oil','egg','baking powder'], equipment:['bowl','spoon','oven','baking tin'], allergens:['wheat','milk','egg'],
      objective:'Use ratios, combine dry/wet ingredients and observe structural change during baking.',
      amounts:[m('plain flour','flour',180,'g',6.35,'oz',1.5,'cups',12,'level tbsp'),m('sugar','sugar',120,'g',4.25,'oz',0.6,'cup',9,'level tbsp'),m('cocoa','cocoa',25,'g',0.9,'oz',0.25,'cup',4,'tbsp'),m('milk','milk',150,'ml',5,'fl oz',0.63,'cup',10,'tbsp'),m('oil','oil',60,'ml',2,'fl oz',0.25,'cup',4,'tbsp'),m('egg','egg',1,'egg',1,'egg',1,'egg',1,'egg'),m('baking powder','baking powder',8,'g',0.28,'oz',2,'tsp',2,'tsp')],
      steps:[['child','Measure flour, sugar, cocoa and baking powder.',0],['together','Add milk, oil and egg and mix until smooth.',0],['adult','A grown-up transfers the batter and uses the oven.',1800],['adult','A grown-up checks it is cooked through and cools it before cutting.',0]]
    },

    {
      id:'cocoa-mug-cake', title:'Microwave Cocoa Mug Cake', category:'Microwave Cakes', icon:'☕', baseServings:1, time:'7 min', difficulty:'Easy', heat:true,
      ingredients:['flour','sugar','milk','oil','cocoa'], equipment:['microwave','microwave-safe mug','spoon'], allergens:['wheat','milk'],
      objective:'Measure small quantities and observe rapid heating in a microwave-safe container.',
      amounts:[m('plain flour','flour',30,'g',1.05,'oz',4,'tbsp',4,'level tbsp'),m('sugar','sugar',25,'g',0.9,'oz',2,'tbsp',2,'level tbsp'),m('cocoa','cocoa',8,'g',0.28,'oz',1,'tbsp',1,'tbsp'),m('milk','milk',60,'ml',2,'fl oz',4,'tbsp',4,'tbsp'),m('oil','oil',15,'ml',0.5,'fl oz',1,'tbsp',1,'tbsp')],
      steps:[['child','Measure the dry ingredients into a microwave-safe mug.',0],['together','Add milk and oil and stir until smooth.',0],['adult','A grown-up uses the microwave. Cooking time varies by microwave.',75],['adult','A grown-up checks temperature and lets the mug cool before anyone touches or tastes it.',0]]
    },
    {
      id:'vanilla-mug-cake', title:'Vanilla Mug Cake', category:'Microwave Cakes', icon:'🌼', baseServings:1, time:'7 min', difficulty:'Easy', heat:true,
      ingredients:['flour','sugar','milk','oil','vanilla','baking powder'], equipment:['microwave','microwave-safe mug','spoon'], allergens:['wheat','milk'],
      objective:'Practise spoon measures and compare batter before and after microwave heating.',
      amounts:[m('plain flour','flour',32,'g',1.1,'oz',4,'tbsp',4,'level tbsp'),m('sugar','sugar',25,'g',0.9,'oz',2,'tbsp',2,'level tbsp'),m('milk','milk',60,'ml',2,'fl oz',4,'tbsp',4,'tbsp'),m('oil','oil',15,'ml',0.5,'fl oz',1,'tbsp',1,'tbsp'),m('vanilla','vanilla',2.5,'ml',0.08,'fl oz',0.5,'tsp',0.5,'tsp'),m('baking powder','baking powder',1.5,'g',0.05,'oz',0.25,'tsp',0.25,'tsp')],
      steps:[['child','Measure flour, sugar and baking powder into the mug.',0],['together','Add milk, oil and vanilla and stir smooth.',0],['adult','A grown-up uses the microwave and watches for overflow.',75],['adult','Let the mug cool and check the centre before serving.',0]]
    },
    {
      id:'banana-mug-cake', title:'Banana Mug Cake', category:'Microwave Cakes', icon:'🍌', baseServings:1, time:'8 min', difficulty:'Easy', heat:true,
      ingredients:['banana','flour','milk','oil','baking powder'], equipment:['microwave','microwave-safe mug','spoon'], allergens:['wheat','milk'],
      objective:'Mash, measure and compare how banana changes moisture and sweetness in a small cake.',
      amounts:[m('banana','banana',60,'g',2.1,'oz',0.25,'cup mashed',4,'tbsp mashed'),m('plain flour','flour',30,'g',1.05,'oz',4,'tbsp',4,'level tbsp'),m('milk','milk',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp'),m('oil','oil',10,'ml',0.34,'fl oz',2,'tsp',2,'tsp'),m('baking powder','baking powder',1.5,'g',0.05,'oz',0.25,'tsp',0.25,'tsp')],
      steps:[['child','Mash the banana in the mug.',0],['child','Add flour and baking powder.',0],['together','Stir in milk and oil until combined.',0],['adult','A grown-up uses the microwave.',80],['adult','Cool and check temperature before serving.',0]]
    },
    {
      id:'apple-mug-cake', title:'Apple Cinnamon Mug Cake', category:'Microwave Cakes', icon:'🍎', baseServings:1, time:'9 min', difficulty:'Easy', heat:true,
      ingredients:['apple','flour','milk','oil','cinnamon','baking powder'], equipment:['microwave','microwave-safe mug','spoon'], allergens:['wheat','milk'],
      objective:'Use safe prepared fruit, spoon measures and sensory observation in a small microwave bake.',
      amounts:[m('prepared grated apple','apple',50,'g',1.75,'oz',0.33,'cup',5,'tbsp'),m('plain flour','flour',30,'g',1.05,'oz',4,'tbsp',4,'level tbsp'),m('milk','milk',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp'),m('oil','oil',10,'ml',0.34,'fl oz',2,'tsp',2,'tsp'),m('cinnamon','cinnamon',1,'g',0.04,'oz',0.25,'tsp',0.25,'tsp'),m('baking powder','baking powder',1.5,'g',0.05,'oz',0.25,'tsp',0.25,'tsp')],
      steps:[['adult','A grown-up washes and safely grates/chops the apple.',0],['child','Measure flour, cinnamon and baking powder into the mug.',0],['together','Add apple, milk and oil and stir.',0],['adult','A grown-up uses the microwave.',85],['adult','Cool and check temperature before serving.',0]]
    },

    {
      id:'banana-oat-cup', title:'Banana Oat Breakfast Cup', category:'No-Heat', icon:'🥣', baseServings:1, time:'5 min', difficulty:'Easy', heat:false,
      ingredients:['banana','oats','yogurt'], equipment:['bowl','spoon'], allergens:['milk'],
      objective:'Practise mashing, measuring and describing texture without heat.',
      amounts:[m('banana','banana',120,'g',4.25,'oz',0.5,'cup mashed',8,'tbsp mashed'),m('oats','oats',30,'g',1.05,'oz',0.38,'cup',6,'tbsp'),m('yogurt','yogurt',60,'g',2.1,'oz',0.25,'cup',4,'tbsp')],
      steps:[['child','Peel and mash the banana in the bowl.',0],['child','Measure the oats and yogurt.',0],['together','Stir everything together and describe the texture.',0],['adult','A grown-up checks any toppings, allergies and food safety.',0]]
    },
    {
      id:'fruit-yogurt-builder', title:'Fruit & Yogurt Builder', category:'No-Heat', icon:'🍓', baseServings:1, time:'5 min', difficulty:'Easy', heat:false,
      ingredients:['yogurt','fruit'], equipment:['bowl','spoon'], allergens:['milk'],
      objective:'Sort colours/textures and practise simple portion measures.',
      amounts:[m('yogurt','yogurt',100,'g',3.5,'oz',0.42,'cup',7,'tbsp'),m('prepared fruit','fruit',80,'g',2.8,'oz',0.5,'cup',8,'tbsp')],
      steps:[['adult','A grown-up washes and safely cuts fruit that needs a knife.',0],['child','Spoon yogurt into the bowl.',0],['child','Add the prepared fruit.',0],['together','Compare colours, smells and textures.',0]]
    },
    {
      id:'oat-bites', title:'No-Bake Oat Bites', category:'No-Heat', icon:'⚪', baseServings:6, time:'10 min', difficulty:'Easy', heat:false, restrictedAgeBands:['0-2'], restrictionNote:'Honey is not suitable for children under 12 months. Because the 0–2 profile does not collect exact age, this recipe is hidden in that age band.',
      ingredients:['oats','sunflower seed butter','honey'], equipment:['bowl','spoon'], allergens:['seed'],
      objective:'Measure sticky/dry ingredients and explore how ratios affect texture.',
      amounts:[m('oats','oats',90,'g',3.2,'oz',1.1,'cups',18,'tbsp'),m('sunflower seed butter','sunflower seed butter',60,'g',2.1,'oz',0.25,'cup',4,'tbsp'),m('honey','honey',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp')],
      steps:[['child','Measure oats into a bowl.',0],['together','Add sunflower seed butter and honey and mix.',0],['together','Roll into small bites with clean hands.',0],['adult','A grown-up checks allergy suitability and stores them safely.',0]]
    },
    {
      id:'fridge-cheesecake', title:'Fridge Cheesecake Cup', category:'No-Heat', icon:'🍰', baseServings:2, time:'10 min', difficulty:'Easy', heat:false,
      ingredients:['biscuits','cream cheese','yogurt','fruit'], equipment:['bowl','spoon','cup'], allergens:['wheat','milk'],
      objective:'Layer ingredients, compare textures and practise simple fractions/portions.',
      amounts:[m('plain biscuits','biscuits',40,'g',1.4,'oz',0.33,'cup crumbs',5,'tbsp crumbs'),m('cream cheese','cream cheese',80,'g',2.8,'oz',0.33,'cup',5,'tbsp'),m('yogurt','yogurt',40,'g',1.4,'oz',0.17,'cup',3,'tbsp'),m('prepared fruit','fruit',60,'g',2.1,'oz',0.4,'cup',6,'tbsp')],
      steps:[['together','Crush the biscuits in a safe way and divide between cups.',0],['together','Mix cream cheese and yogurt.',0],['child','Spoon the creamy layer over the crumbs.',0],['adult','A grown-up prepares fruit if cutting is needed.',0],['child','Add the prepared fruit and chill before serving.',0]]
    },

    {
      id:'pizza-faces', title:'Family Pizza Faces', category:'Family Baking', icon:'🍕', baseServings:4, time:'35 min', difficulty:'Explorer', heat:true,
      ingredients:['flour','yogurt','tomato sauce','cheese'], equipment:['bowl','spoon','oven','baking tray'], allergens:['wheat','milk'],
      objective:'Use fractions and design choices while following a shared family cooking sequence.',
      amounts:[m('plain flour','flour',160,'g',5.6,'oz',1.33,'cups',11,'level tbsp'),m('yogurt','yogurt',160,'g',5.6,'oz',0.67,'cup',11,'tbsp'),m('tomato sauce','tomato sauce',80,'g',2.8,'oz',0.33,'cup',5,'tbsp'),m('grated cheese','cheese',80,'g',2.8,'oz',0.75,'cup',12,'tbsp')],
      steps:[['child','Measure flour into a bowl.',0],['together','Mix in yogurt to make dough and divide into four.',0],['together','Flatten the bases and spread tomato sauce.',0],['child','Use approved toppings and cheese to make designs.',0],['adult','A grown-up uses the oven and checks the pizzas are cooked.',900],['adult','Cool before serving.',0]]
    },
    {
      id:'family-scones', title:'Family Scones', category:'Family Baking', icon:'🥐', baseServings:6, time:'30 min', difficulty:'Explorer', heat:true,
      ingredients:['flour','butter','milk','baking powder'], equipment:['bowl','spoon','oven','baking tray'], allergens:['wheat','milk'],
      objective:'Explore dough texture, measuring and gentle mixing as a family.',
      amounts:[m('plain flour','flour',225,'g',7.9,'oz',1.88,'cups',15,'level tbsp'),m('cold butter','butter',55,'g',1.95,'oz',0.25,'cup',4,'tbsp'),m('milk','milk',140,'ml',4.7,'fl oz',0.58,'cup',9,'tbsp'),m('baking powder','baking powder',8,'g',0.28,'oz',2,'tsp',2,'tsp')],
      steps:[['together','Measure flour and baking powder.',0],['together','Rub in the butter with clean fingertips until crumbly.',0],['together','Add milk gradually and bring the dough together.',0],['together','Pat the dough out and shape scones. A grown-up handles any sharp cutter if used.',0],['adult','A grown-up uses the oven.',720],['adult','Check the centres are cooked and cool before eating.',0]]
    },
    {
      id:'oat-cookies', title:'Family Oat Cookies', category:'Family Baking', icon:'🍪', baseServings:8, time:'30 min', difficulty:'Easy', heat:true,
      ingredients:['oats','flour','butter','sugar','milk'], equipment:['bowl','spoon','oven','baking tray'], allergens:['wheat','milk'],
      objective:'Practise ratios and observe how a soft mixture changes texture during baking.',
      amounts:[m('oats','oats',100,'g',3.5,'oz',1.25,'cups',20,'tbsp'),m('plain flour','flour',80,'g',2.8,'oz',0.67,'cup',5.5,'level tbsp'),m('soft butter','butter',70,'g',2.5,'oz',0.31,'cup',5,'tbsp'),m('sugar','sugar',50,'g',1.75,'oz',0.25,'cup',4,'level tbsp'),m('milk','milk',30,'ml',1,'fl oz',2,'tbsp',2,'tbsp')],
      steps:[['child','Measure oats, flour and sugar.',0],['together','Mix in soft butter and milk to make a soft mixture.',0],['together','Shape eight small cookies on a lined tray.',0],['adult','A grown-up uses the oven.',720],['adult','Cool before serving.',0]]
    },
    {
      id:'fruit-crumble', title:'Family Fruit Crumble', category:'Family Baking', icon:'🍏', baseServings:6, time:'45 min', difficulty:'Explorer', heat:true,
      ingredients:['fruit','flour','oats','butter','sugar'], equipment:['bowl','spoon','oven','baking dish'], allergens:['wheat','milk'],
      objective:'Compare fruit and crumb textures, use ratios and follow a shared preparation sequence.',
      amounts:[m('prepared fruit','fruit',500,'g',17.6,'oz',3.5,'cups',56,'tbsp'),m('plain flour','flour',120,'g',4.25,'oz',1,'cup',8,'level tbsp'),m('oats','oats',60,'g',2.1,'oz',0.75,'cup',12,'tbsp'),m('butter','butter',80,'g',2.8,'oz',0.35,'cup',5.5,'tbsp'),m('sugar','sugar',50,'g',1.75,'oz',0.25,'cup',4,'level tbsp')],
      steps:[['adult','A grown-up washes, peels or cuts fruit as needed and places it in the baking dish.',0],['child','Measure flour, oats and sugar into a bowl.',0],['together','Rub in the butter until the mixture is crumbly.',0],['child','Sprinkle the crumble over the prepared fruit.',0],['adult','A grown-up uses the oven until the fruit is soft and topping is cooked.',1800],['adult','Let it cool to a safe temperature before serving.',0]]
    }
  ];

  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function write(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  const aliases = {
    'plain flour':'flour','self raising flour':'flour','self-raising flour':'flour','strong flour':'flour','bread flour':'flour',
    'caster sugar':'sugar','granulated sugar':'sugar','brown sugar':'sugar','greek yogurt':'yogurt','natural yoghurt':'yogurt','yoghurt':'yogurt',
    'cream':'double cream','heavy cream':'double cream','whipping cream':'double cream','jar':'clean jar','mug':'microwave-safe mug',
    'microwave mug':'microwave-safe mug','tray':'baking tray','sheet pan':'baking tray','pan':'frying pan','herb':'herbs','mixed herbs':'herbs',
    'sunflower butter':'sunflower seed butter','seed butter':'sunflower seed butter','tomato puree':'tomato sauce','passata':'tomato sauce',
    'grated cheese':'cheese','lemon juice':'lemon','lemon zest':'lemon','bicarbonate of soda':'baking soda','bicarb':'baking soda',
    'baking powder':'baking powder','egg':'egg','eggs':'egg','apple':'apple','berries':'fruit','strawberries':'fruit','banana':'banana'
  };

  function cleanList(value) {
    const items=String(value || '').split(/,|\n/).map(item => item.replace(/[<>]/g,'').trim().toLowerCase()).filter(Boolean).slice(0,80).map(item=>aliases[item]||item);
    return [...new Set(items)];
  }

  function getSetup(profileId) {
    const all = read();
    return all[profileId] || { ingredients:[], equipment:['bowl','spoon'], allergyNote:'Parent has not added a food-safety note.' };
  }

  function saveSetup(profileId, input) {
    const all = read();
    all[profileId] = {
      ingredients: cleanList(input.ingredients),
      equipment: cleanList(input.equipment),
      allergyNote: String(input.allergyNote || '').replace(/[<>]/g,'').trim().slice(0,160) || 'Parent has not added a food-safety note.'
    };
    write(all); return all[profileId];
  }

  function matches(profileId, ageBand='7-9') {
    const setup = getSetup(profileId), pantry = new Set(setup.ingredients), equipment = new Set(setup.equipment);
    return recipes.filter(recipe => !(recipe.restrictedAgeBands || []).includes(ageBand)).map(recipe => {
      const missingIngredients = recipe.ingredients.filter(item => !pantry.has(item));
      const missingEquipment = recipe.equipment.filter(item => !equipment.has(item));
      const missingTotal = missingIngredients.length + missingEquipment.length;
      return { ...recipe, missingIngredients, missingEquipment, missingTotal, canMake: missingTotal===0, almost: missingTotal>0 && missingTotal<=2 };
    }).sort((a,b) => Number(b.canMake)-Number(a.canMake) || Number(b.almost)-Number(a.almost) || a.missingTotal-b.missingTotal || a.title.localeCompare(b.title));
  }

  function getRecipe(id) { return recipes.find(recipe => recipe.id === id) || null; }

  function fmtNumber(value) {
    if (Number.isInteger(value)) return String(value);
    const whole=Math.floor(value), frac=value-whole;
    const fractions=[[0.125,'⅛'],[0.25,'¼'],[0.333,'⅓'],[0.5,'½'],[0.667,'⅔'],[0.75,'¾']];
    const match=fractions.reduce((best,item)=>Math.abs(item[0]-frac)<Math.abs((best?.[0] ?? 99)-frac)?item:best,null);
    if (match && Math.abs(match[0]-frac)<0.035) return `${whole||''}${match[1]}`;
    return String(Math.round(value*100)/100);
  }

  function formatIngredients(recipe, mode='metric', factor=1) {
    const key = mode==='no-scales' ? 'noScales' : mode;
    return recipe.amounts.map(item => {
      const chosen=item[key] || item.metric;
      const quantity=chosen.qty*factor;
      let note='';
      if (/egg/.test(chosen.unit) && !Number.isInteger(quantity)) note=' — beat first and use the needed portion with an adult';
      return `${fmtNumber(quantity)} ${chosen.unit} ${item.name}${note}`.replace(/\s+/g,' ').trim();
    });
  }

  function filterMatches(profileId, category='all', ageBand='7-9') {
    return matches(profileId, ageBand).filter(item => category==='all' || item.category===category);
  }

  window.OrishKitchen = { recipes, categories, getSetup, saveSetup, matches, filterMatches, getRecipe, formatIngredients, cleanList };
})();
