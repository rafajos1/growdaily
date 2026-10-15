import type { Diet, Ingredient } from "./types";

export interface LibraryRecipe {
  name: string;
  description: string;
  minutes: number;
  diets: Diet[];
  ingredients: Ingredient[];
  steps: string[];
}

const V: Diet[] = ["vegetarian"];
const VG: Diet[] = ["vegetarian", "vegan", "dairy-free"];

/** Everyday recipes used when AI suggestions aren't available. Quantities serve about 2. */
export const RECIPES: LibraryRecipe[] = [
  {
    name: "Spinach & cheese omelette",
    description: "Fluffy eggs folded over wilted spinach and melted cheese.",
    minutes: 10,
    diets: [...V, "gluten-free"],
    ingredients: [{ item: "egg", quantity: "4" }, { item: "spinach", quantity: "2 handfuls" }, { item: "cheese", quantity: "1/2 cup, grated" }, { item: "butter", quantity: "1 tbsp" }],
    steps: ["Beat the eggs with a pinch of salt and pepper.", "Wilt the spinach in a pan with the butter, then push it to one side.", "Pour in the eggs, cook gently until almost set, scatter the cheese over half, fold and serve."],
  },
  {
    name: "Egg fried rice",
    description: "Leftover rice tossed hot with egg, peas and soy sauce.",
    minutes: 15,
    diets: [...V, "dairy-free"],
    ingredients: [{ item: "rice", quantity: "2 cups, cooked" }, { item: "egg", quantity: "2" }, { item: "peas", quantity: "1 cup" }, { item: "green onion", quantity: "2" }, { item: "soy sauce", quantity: "2 tbsp" }, { item: "oil", quantity: "1 tbsp" }],
    steps: ["Heat the oil in a large pan until very hot.", "Scramble the eggs, then add the rice and peas and stir-fry for 3–4 minutes.", "Season with soy sauce, top with sliced green onion."],
  },
  {
    name: "Garlic tomato pasta",
    description: "Pantry pasta with a quick garlicky tomato sauce.",
    minutes: 20,
    diets: VG,
    ingredients: [{ item: "pasta", quantity: "200 g" }, { item: "tomato", quantity: "1 can or 4 fresh" }, { item: "garlic", quantity: "3 cloves" }, { item: "oil", quantity: "2 tbsp" }, { item: "basil", quantity: "a few leaves" }],
    steps: ["Cook the pasta in salted water.", "Gently fry sliced garlic in oil, add the tomatoes and simmer 10 minutes, squashing them.", "Toss the drained pasta in the sauce with a splash of pasta water and torn basil."],
  },
  {
    name: "Chicken stir-fry",
    description: "Quick chicken and vegetables with a soy-ginger glaze.",
    minutes: 25,
    diets: ["dairy-free"],
    ingredients: [{ item: "chicken", quantity: "300 g" }, { item: "bell pepper", quantity: "1" }, { item: "broccoli", quantity: "1 small head" }, { item: "soy sauce", quantity: "3 tbsp" }, { item: "ginger", quantity: "1 thumb" }, { item: "garlic", quantity: "2 cloves" }, { item: "rice", quantity: "to serve" }],
    steps: ["Slice the chicken thin and stir-fry in a hot oiled pan until golden; set aside.", "Stir-fry the vegetables with grated ginger and garlic for 4 minutes.", "Return the chicken, add soy sauce and a splash of water, toss and serve over rice."],
  },
  {
    name: "Chickpea curry",
    description: "Creamy coconut chickpea curry, mostly from the cupboard.",
    minutes: 30,
    diets: [...VG, "gluten-free"],
    ingredients: [{ item: "chickpeas", quantity: "1 can" }, { item: "coconut milk", quantity: "1 can" }, { item: "onion", quantity: "1" }, { item: "garlic", quantity: "2 cloves" }, { item: "curry powder", quantity: "2 tbsp" }, { item: "spinach", quantity: "2 handfuls" }, { item: "rice", quantity: "to serve" }],
    steps: ["Soften the chopped onion and garlic in oil for 5 minutes.", "Stir in the curry powder for 1 minute, then add the chickpeas and coconut milk and simmer 15 minutes.", "Stir in the spinach until wilted; serve with rice."],
  },
  {
    name: "Bean & cheese quesadillas",
    description: "Crispy tortillas with beans, cheese and whatever veg you have.",
    minutes: 15,
    diets: V,
    ingredients: [{ item: "tortillas", quantity: "4" }, { item: "beans", quantity: "1 can" }, { item: "cheese", quantity: "1 cup, grated" }, { item: "bell pepper", quantity: "1" }, { item: "salsa", quantity: "to serve" }],
    steps: ["Mash the drained beans with a pinch of salt.", "Spread beans on half of each tortilla, add sliced pepper and cheese, fold.", "Cook in a dry pan 2–3 minutes per side until crisp; serve with salsa."],
  },
  {
    name: "Sheet-pan sausages & potatoes",
    description: "Everything roasted on one tray; almost no washing up.",
    minutes: 45,
    diets: ["gluten-free", "dairy-free"],
    ingredients: [{ item: "sausages", quantity: "4" }, { item: "potato", quantity: "4 medium" }, { item: "onion", quantity: "1" }, { item: "bell pepper", quantity: "1" }, { item: "oil", quantity: "2 tbsp" }],
    steps: ["Heat the oven to 220°C / 425°F.", "Toss chunks of potato, onion and pepper in oil, salt and pepper on a tray; roast 15 minutes.", "Add the sausages and roast another 25 minutes, turning once, until cooked through."],
  },
  {
    name: "Tuna & white bean salad",
    description: "No-cook salad with lemon, beans and tuna.",
    minutes: 10,
    diets: ["gluten-free", "dairy-free"],
    ingredients: [{ item: "tuna", quantity: "1 can" }, { item: "beans", quantity: "1 can, white" }, { item: "tomato", quantity: "2" }, { item: "red onion", quantity: "1/2" }, { item: "lemon", quantity: "1" }, { item: "oil", quantity: "2 tbsp" }],
    steps: ["Drain the tuna and beans.", "Chop the tomatoes and red onion finely.", "Toss everything with lemon juice, oil, salt and pepper."],
  },
  {
    name: "Mushroom risotto",
    description: "Slow-stirred, comforting and worth the time.",
    minutes: 45,
    diets: [...V, "gluten-free"],
    ingredients: [{ item: "rice", quantity: "1 cup, arborio" }, { item: "mushrooms", quantity: "250 g" }, { item: "onion", quantity: "1" }, { item: "stock", quantity: "1 litre" }, { item: "cheese", quantity: "1/2 cup parmesan" }, { item: "butter", quantity: "2 tbsp" }],
    steps: ["Fry the sliced mushrooms in half the butter until golden; set aside.", "Soften the onion, add the rice and stir 1 minute.", "Add hot stock a ladle at a time, stirring, for about 20 minutes until creamy.", "Stir in the mushrooms, cheese and remaining butter."],
  },
  {
    name: "Veggie noodle soup",
    description: "Light broth with noodles, greens and a soft egg.",
    minutes: 20,
    diets: [...V, "dairy-free"],
    ingredients: [{ item: "pasta", quantity: "150 g noodles" }, { item: "stock", quantity: "1 litre" }, { item: "egg", quantity: "2" }, { item: "spinach", quantity: "2 handfuls" }, { item: "soy sauce", quantity: "1 tbsp" }, { item: "green onion", quantity: "2" }],
    steps: ["Simmer the stock with soy sauce.", "Boil the eggs 6½ minutes, cool and peel.", "Cook the noodles in the broth, add the spinach for the last minute; top with halved eggs and green onion."],
  },
  {
    name: "Beef tacos",
    description: "Spiced ground beef in warm tortillas with fresh toppings.",
    minutes: 25,
    diets: ["dairy-free"],
    ingredients: [{ item: "beef", quantity: "300 g ground" }, { item: "tortillas", quantity: "6" }, { item: "onion", quantity: "1" }, { item: "tomato", quantity: "2" }, { item: "lettuce", quantity: "1/2 head" }, { item: "cumin", quantity: "1 tsp" }],
    steps: ["Brown the beef with the chopped onion, cumin, salt and pepper.", "Warm the tortillas in a dry pan.", "Fill with beef, chopped tomato and shredded lettuce."],
  },
  {
    name: "Greek yogurt overnight oats",
    description: "Make-ahead breakfast: oats, yogurt and fruit.",
    minutes: 5,
    diets: [...V, "gluten-free"],
    ingredients: [{ item: "oats", quantity: "1 cup" }, { item: "yogurt", quantity: "1 cup" }, { item: "milk", quantity: "1/2 cup" }, { item: "banana", quantity: "1" }, { item: "honey", quantity: "1 tbsp" }],
    steps: ["Mix the oats, yogurt, milk and honey.", "Cover and refrigerate overnight.", "Top with sliced banana in the morning."],
  },
  {
    name: "Black bean rice bowls",
    description: "Rice, spiced beans, corn and avocado in a bowl.",
    minutes: 20,
    diets: [...VG, "gluten-free"],
    ingredients: [{ item: "rice", quantity: "2 cups, cooked" }, { item: "beans", quantity: "1 can, black" }, { item: "corn", quantity: "1 cup" }, { item: "avocado", quantity: "1" }, { item: "lime", quantity: "1" }, { item: "cumin", quantity: "1 tsp" }],
    steps: ["Warm the beans with cumin, salt and a splash of water.", "Warm the corn in a dry pan until lightly charred.", "Build bowls of rice, beans, corn and sliced avocado; squeeze over lime."],
  },
  {
    name: "Lemon garlic salmon",
    description: "Pan-seared salmon with a buttery lemon sauce and greens.",
    minutes: 20,
    diets: ["gluten-free"],
    ingredients: [{ item: "salmon", quantity: "2 fillets" }, { item: "lemon", quantity: "1" }, { item: "garlic", quantity: "2 cloves" }, { item: "butter", quantity: "2 tbsp" }, { item: "broccoli", quantity: "1 small head" }],
    steps: ["Season the salmon and sear skin-side down in a hot oiled pan for 4 minutes, flip for 2.", "Steam or boil the broccoli for 4 minutes.", "Melt the butter with sliced garlic and lemon juice; spoon over the fish."],
  },
];
