/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // --- HOUSE BAKES ---
  {
    id: 'bake-1',
    name: 'Multigrain Croissant',
    description: 'Freshly baked daily using rich butter, laminated lovingly for 3 days and loaded with healthy organic seeds.',
    price: 180,
    category: 'House Bakes',
    dietary: ['Vegetarian', 'Signature', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Preparation',
        required: true,
        choices: ['Served Warm (Recommended)', 'Room Temperature']
      }
    ]
  },
  {
    id: 'bake-2',
    name: 'Pain au Chocolat',
    description: 'Artisanal golden puff pastry with double layers of high-grade single-origin dark chocolate batons.',
    price: 195,
    category: 'House Bakes',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Preparation',
        required: true,
        choices: ['Served Warm', 'Room Temperature']
      }
    ]
  },
  {
    id: 'bake-3',
    name: 'Everything Bagel',
    description: 'Thick hand-rolled bagel with a chewy exterior, topped with garlic, onion, poppy seeds, and sesame.',
    price: 125,
    category: 'House Bakes',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Add-ons',
        required: false,
        choices: ['No Add-ons', 'Premium Cream Cheese (+₹70)', 'Flavoured Butter (+₹60)', 'Special Jam (+₹50)']
      }
    ]
  },
  {
    id: 'bake-4',
    name: 'Jalapeno Cheddar Bagel',
    description: 'Our house bagel baked with fiery fresh jalapeno wheels and a savory crust of baked sharp cheddar cheese.',
    price: 150,
    category: 'House Bakes',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Add-ons',
        required: false,
        choices: ['No Add-ons', 'Premium Cream Cheese (+₹70)', 'Flavoured Butter (+₹60)']
      }
    ]
  },

  // --- COFFEES ---
  {
    id: 'coffee-1',
    name: 'Cappuccino',
    description: 'Classic rich double espresso shot of 100% Organic Arabica beans, cut with steamed milk and silky micro-foam.',
    price: 220,
    category: 'Coffees',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Milk Choice',
        required: true,
        choices: ['Organic Whole Milk', 'Oat Milk (+₹50)', 'Almond Milk (+₹50)']
      }
    ]
  },
  {
    id: 'coffee-2',
    name: 'Vietnamese Cold Brew',
    description: 'Strong, smooth cold extraction dripped from select Arabica beans, layered with rich sweetened condensed milk.',
    price: 260,
    category: 'Coffees',
    dietary: ['Vegetarian', 'Signature'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'coffee-3',
    name: 'Lavender Citrus Cold Brew',
    description: 'Exquisite slow steep cold brew infused with local lavender sprigs and fresh sweet lemon citrus nectar.',
    price: 260,
    category: 'Coffees',
    dietary: ['Vegetarian', 'Dairy-Free'],
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'coffee-4',
    name: 'Frosted Orange Coffee',
    description: 'A striking citrusy coffee fusion blending double espresso, fresh frosted orange juice, and ice.',
    price: 240,
    category: 'Coffees',
    dietary: ['Vegetarian', 'Dairy-Free'],
    image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'coffee-5',
    name: 'Cortado',
    description: 'Equal parts premium rich espresso and hot textured milk, creating a perfectly balanced bold coffee experience.',
    price: 220,
    category: 'Coffees',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1510972527909-a01440b7db77?auto=format&fit=crop&q=80&w=600'
  },

  // --- APPETIZERS ---
  {
    id: 'app-1',
    name: 'Taiwanese Popcorn Chicken',
    description: 'Crispy, crunchy chicken nuggets marinated in authentic five-spice blend, served piping hot with signature Bang Bang dip.',
    price: 385,
    category: 'Appetizers',
    dietary: ['Non-Vegetarian'],
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'app-2',
    name: 'Pesto Chicken Arancini',
    description: 'Golden fried Italian rice spheres stuffed with finely shredded pesto chicken and cheese, served with marinara drizzle.',
    price: 385,
    category: 'Appetizers',
    dietary: ['Non-Vegetarian', 'Contains Gluten'],
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'app-3',
    name: 'Jalapeno Cream Cheese Poppers',
    description: 'Zesty breaded jalapenos filled to the brim with velvet cream cheese, fried until beautifully golden and gooey.',
    price: 355,
    category: 'Appetizers',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'app-4',
    name: 'Crispy Lotus Root',
    description: 'Paper-thin lotus root discs flash-fried, seasoned with sea salt, ground pepper, and hints of savory herbs.',
    price: 345,
    category: 'Appetizers',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'app-5',
    name: 'Oven Roasted Corn Ribs',
    description: 'Sweet corn cob wedges tossed with olive oil, smoked paprika, and dry rub, roasted till caramelized.',
    price: 315,
    category: 'Appetizers',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600'
  },

  // --- PIZZAS ---
  {
    id: 'pizza-1',
    name: 'Classic Margherita Pizza',
    description: 'Authentic 11-inch hand-stretched crust topped with robust heritage tomato sauce, fresh mozzarella cheese, and fresh basil.',
    price: 345,
    category: 'Pizzas',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Extra Toppings',
        required: false,
        choices: ['No Extras', 'Extra Cheese (+₹80)', 'Fresh Jalapenos (+₹40)', 'Sautéed Mushrooms (+₹60)']
      }
    ]
  },
  {
    id: 'pizza-2',
    name: 'Loaded Veggie Pizza',
    description: 'Garden abundance with crisp peppers, red onions, mushrooms, juicy olives, and pickled jalapenos on a fresh base.',
    price: 395,
    category: 'Pizzas',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'pizza-3',
    name: 'Spicy Paneer Tikka Pizza',
    description: 'Indian fusion! Toasted hand-stretched crust topped with fiery marinated paneer tikka cubes, onions, green chilies, and herbs.',
    price: 395,
    category: 'Pizzas',
    dietary: ['Vegetarian', 'Eggless', 'Signature'],
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'pizza-4',
    name: 'Chicken Meatball Pizza',
    description: 'Juicy chicken meatballs spread generously over spicy tomato sauce, melted mozzarella, and dynamic basil sprinkles.',
    price: 345,
    category: 'Pizzas',
    dietary: ['Non-Vegetarian'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'
  },

  // --- MAINS ---
  {
    id: 'main-1',
    name: 'Mediterranean Bowl',
    description: 'Hummus, crisp golden falafel, Greek feta, pickled veggies, garden greens, and house tahini dressing in a wellness bowl.',
    price: 425,
    category: 'Mains',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'main-2',
    name: 'Chicken Katsu Curry',
    description: 'Crispy panko-breaded golden chicken breast served with aromatic rich Japanese curry sauce over hot steamed rice.',
    price: 445,
    category: 'Mains',
    dietary: ['Non-Vegetarian', 'Signature'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'main-3',
    name: 'Spaghetti Aglio & Olio',
    description: 'Simple Italian perfection: premium spaghetti tossed in extra virgin olive oil, fragrant sliced garlic, chili flakes, and black olives.',
    price: 355,
    category: 'Mains',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Protein Add-on',
        required: false,
        choices: ['No Added Protein', 'Grilled Chicken (+₹100)', 'Butter Garlic Prawns (+₹150)']
      }
    ]
  },
  {
    id: 'main-4',
    name: 'Veggie Lasagne',
    description: 'Layers of fresh pasta sheet, oven-baked with rich seasonal veggies, seasoned tomato sauce, creamy bechamel, and mozzarella.',
    price: 395,
    category: 'Mains',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
  },

  // --- SALADS & SUSHI ---
  {
    id: 'salad-1',
    name: 'Classic Caesar Salad',
    description: 'Crisp romaine lettuce tossed in rich creamy Caesar dressing, loaded with butter croutons and snows of Parmesan cheese.',
    price: 345,
    category: 'Salads & Sushi',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600',
    options: [
      {
        name: 'Topping Add-on',
        required: false,
        choices: ['No Additions', 'Grilled Chicken (+₹100)', 'Avocado Slices (+₹80)']
      }
    ]
  },
  {
    id: 'salad-2',
    name: 'Veg California Sushi Roll',
    description: 'Elegant inside-out sushi roll packed with crisp cucumber, creamy avocado, vinegared rice, and black sesame coating.',
    price: 385,
    category: 'Salads & Sushi',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'salad-3',
    name: 'Prawn Tempura Sushi Roll',
    description: 'Crisp, hot prawn tempura and spicy kewpie mayo rolled together, topped with toasted sesame and microgreens.',
    price: 485,
    category: 'Salads & Sushi',
    dietary: ['Non-Vegetarian', 'Signature'],
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=600'
  },

  // --- DESSERTS ---
  {
    id: 'dessert-1',
    name: 'Rosewater Tres Leches',
    description: 'A decadent client masterpiece: airy sponge cake soaked in three luxury milks, perfumed beautifully with premium rosewater.',
    price: 345,
    category: 'Desserts',
    dietary: ['Vegetarian', 'Signature'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dessert-2',
    name: 'Dubai Chocolate Cheese Cake',
    description: 'Our viral luxury cheesecake infused with rich Belgian chocolate and crunchy toasted pistachio knafeh swirls.',
    price: 365,
    category: 'Desserts',
    dietary: ['Vegetarian', 'Contains Nuts'],
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dessert-3',
    name: 'Baked Tiramisu',
    description: 'Classic Italian espresso-soaked savoiardi finger cookies layered under an cloud of vanilla mascarpone cheese.',
    price: 365,
    category: 'Desserts',
    dietary: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dessert-4',
    name: 'Biscoff Serradura',
    description: 'Macau Portuguese sawdust pudding with velvet layers of sweet cream and crushed iconic Lotus Biscoff biscuit crumbs.',
    price: 315,
    category: 'Desserts',
    dietary: ['Vegetarian', 'Eggless'],
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600'
  }
];

export const SERVICE_HOURS = [
  '08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'
];
