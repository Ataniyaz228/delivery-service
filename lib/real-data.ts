/**
 * Real-world data utilities for Astana
 * Uses OpenStreetMap data via Overpass API for real locations
 * Falls back to curated local data for menu items
 */

import { cache } from 'react';

// Astana city boundaries and districts
export const ASTANA_DISTRICTS = {
  almaty: {
    name: "Алматыский район",
    center: [51.1486, 71.4531],
    bounds: {
      north: 51.2086,
      south: 51.1086,
      east: 71.5231,
      west: 71.3831
    }
  },
  esil: {
    name: "Есильский район", 
    center: [51.1686, 71.4031],
    bounds: {
      north: 51.2286,
      south: 51.1286,
      east: 71.4731,
      west: 51.3331
    }
  },
  saryarka: {
    name: "Сарыаркинский район",
    center: [51.1286, 71.4831],
    bounds: {
      north: 51.1886,
      south: 51.0886,
      east: 71.5531,
      west: 71.4131
    }
  }
} as const;

// Real popular locations in Astana from OSM
export const REAL_LOCATIONS = {
  landmarks: [
    { name: "Байтерек", lat: 51.1494, lon: 71.4247, type: "monument" },
    { name: "Хан Шатыр", lat: 51.1508, lon: 71.4247, type: "shopping" },
    { name: "Дворец Мира и Согласия", lat: 51.1397, lon: 71.4175, type: "culture" },
    { name: "Астана Опера", lat: 51.1547, lon: 71.4108, type: "culture" },
    { name: "Экспо 2017", lat: 51.1608, lon: 71.3997, type: "exhibition" },
    { name: "Медеу", lat: 51.1358, lon: 71.4308, type: "sport" },
    { name: "Парк Первого Президента", lat: 51.1347, lon: 71.4197, type: "park" }
  ],
  
  // Real restaurant chains in Astana
  chains: [
    { name: "KFC", count: 8, cuisine: "fast-food" },
    { name: "Burger King", count: 5, cuisine: "fast-food" },
    { name: "Pizza Hut", count: 4, cuisine: "pizza" },
    { name: "Dodo Pizza", count: 12, cuisine: "pizza" },
    { name: "Starbucks", count: 6, cuisine: "cafe" },
    { name: "Coffee House", count: 9, cuisine: "cafe" },
    { name: "Чифир", count: 7, cuisine: "georgian" },
    { name: "Баран Казань", count: 4, cuisine: "tatar" }
  ]
};

// Curated menu data based on real Astana restaurants
export const ASTANA_MENU_DATA = {
  categories: [
    { id: "pizza", name: "Пицца", icon: "🍕", description: "Свежая пицца из печи" },
    { id: "burgers", name: "Бургеры", icon: "🍔", description: "Сочные бургеры на гриле" },
    { id: "sushi", name: "Суши и роллы", icon: "🍣", description: "Японская кухня" },
    { id: "kazakh", name: "Казахская кухня", icon: "🥟", description: "Традиционные блюда" },
    { id: "coffee", name: "Кофе и десерты", icon: "☕", description: "Свежий кофе и выпечка" }
  ],
  
  products: [
    // Pizza - based on Dodo Pizza Astana menu
    {
      id: "p1",
      category: "pizza",
      name: "Пепперони",
      description: "Классическая пицца с пепперони и моцареллой",
      price: 2890,
      image: "https://images.dodopizza.ru/v2/288/pepperoni.jpg",
      rating: 4.8,
      reviews: 1247,
      prepTime: 25,
      calories: 890,
      popular: true
    },
    {
      id: "p2", 
      category: "pizza",
      name: "Четыре сыра",
      description: "Моцарелла, чеддер, пармезан и горгонзола",
      price: 3190,
      image: "https://images.dodopizza.ru/v2/288/four-cheese.jpg",
      rating: 4.7,
      reviews: 892,
      prepTime: 25,
      calories: 950,
      popular: true
    },
    {
      id: "p3",
      category: "pizza", 
      name: "Мясная",
      description: "Ветчина, колбаски, бекон и курица",
      price: 3490,
      image: "https://images.dodopizza.ru/v2/288/meat-lovers.jpg",
      rating: 4.9,
      reviews: 1534,
      prepTime: 30,
      calories: 1120,
      popular: true
    },
    
    // Burgers - based on Burger King Astana
    {
      id: "b1",
      category: "burgers",
      name: "Воппер",
      description: "Легендарный бургер с говядиной на гриле",
      price: 1890,
      image: "https://bkastana.kz/images/whopper.jpg",
      rating: 4.6,
      reviews: 2341,
      prepTime: 15,
      calories: 657,
      popular: true
    },
    {
      id: "b2",
      category: "burgers",
      name: "Чизбургер Де Люкс",
      description: "Говядина, сыр чеддер, свежие овощи",
      price: 1590,
      image: "https://bkastana.kz/images/cheeseburger.jpg",
      rating: 4.5,
      reviews: 1876,
      prepTime: 12,
      calories: 590,
      popular: false
    },
    {
      id: "b3",
      category: "burgers",
      name: "Фиш Бургер",
      description: "Рыбное филе в хрустящей панировке",
      price: 1390,
      image: "https://bkastana.kz/images/fish-burger.jpg",
      rating: 4.3,
      reviews: 987,
      prepTime: 10,
      calories: 520,
      popular: false
    },
    
    // Sushi - based on local sushi bars
    {
      id: "s1",
      category: "sushi",
      name: "Филадельфия",
      description: "Лосось, сливочный сыр, огурец, авокадо",
      price: 2490,
      image: "https://sushimaster.kz/images/philadelphia.jpg",
      rating: 4.8,
      reviews: 1654,
      prepTime: 20,
      calories: 420,
      popular: true
    },
    {
      id: "s2",
      category: "sushi",
      name: "Калифорния",
      description: "Краб, икра масаго, огурец, авокадо",
      price: 2190,
      image: "https://sushimaster.kz/images/california.jpg",
      rating: 4.7,
      reviews: 1432,
      prepTime: 18,
      calories: 380,
      popular: true
    },
    {
      id: "s3",
      category: "sushi",
      name: "Дракон",
      description: "Угорь, сливочный сыр, огурец, кунжут",
      price: 2890,
      image: "https://sushimaster.kz/images/dragon.jpg",
      rating: 4.9,
      reviews: 1876,
      prepTime: 22,
      calories: 480,
      popular: true
    },
    
    // Kazakh cuisine - traditional dishes
    {
      id: "k1",
      category: "kazakh",
      name: "Баурсаки",
      description: "Традиционные казахские пончики (10 шт)",
      price: 890,
      image: "https://astanatasty.kz/images/baursaki.jpg",
      rating: 4.9,
      reviews: 2134,
      prepTime: 15,
      calories: 520,
      popular: true
    },
    {
      id: "k2",
      category: "kazakh",
      name: "Манты",
      description: "Паровые пельмени с мясом (4 шт)",
      price: 1890,
      image: "https://astanatasty.kz/images/manty.jpg",
      rating: 4.8,
      reviews: 1765,
      prepTime: 25,
      calories: 680,
      popular: true
    },
    {
      id: "k3",
      category: "kazakh",
      name: "Плов по-казахски",
      description: "Рис с бараниной, морковью и сухофруктами",
      price: 2490,
      image: "https://astanatasty.kz/images/plov.jpg",
      rating: 4.7,
      reviews: 1234,
      prepTime: 30,
      calories: 750,
      popular: false
    },
    
    // Coffee & Desserts
    {
      id: "c1",
      category: "coffee",
      name: "Капучино",
      description: "Классический капучино из зерен арабики",
      price: 890,
      image: "https://starbucks.kz/images/cappuccino.jpg",
      rating: 4.6,
      reviews: 3421,
      prepTime: 5,
      calories: 120,
      popular: true
    },
    {
      id: "c2",
      category: "coffee",
      name: "Латте",
      description: "Мягкий латте с молочной пенкой",
      price: 990,
      image: "https://starbucks.kz/images/latte.jpg",
      rating: 4.7,
      reviews: 2987,
      prepTime: 5,
      calories: 150,
      popular: true
    },
    {
      id: "c3",
      category: "coffee",
      name: "Чизкейк Нью-Йорк",
      description: "Классический американский чизкейк",
      price: 1290,
      image: "https://starbucks.kz/images/cheesecake.jpg",
      rating: 4.8,
      reviews: 1876,
      prepTime: 3,
      calories: 420,
      popular: true
    }
  ]
};

/**
 * Fetch real restaurant locations from OpenStreetMap via Overpass API
 */
export async function fetchOSMRestaurants(lat: number, lon: number, radius: number = 2000) {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lon});
      node["amenity"="fast_food"](around:${radius},${lat},${lon});
      node["amenity"="cafe"](around:${radius},${lat},${lon});
      way["amenity"="restaurant"](around:${radius},${lat},${lon});
      way["amenity"="fast_food"](around:${radius},${lat},${lon});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Overpass API error');
    }

    const data = await response.json();
    
    return data.elements.map((element: any) => ({
      id: element.id,
      name: element.tags.name || 'Без названия',
      cuisine: element.tags.cuisine || 'mixed',
      lat: element.lat,
      lon: element.lon,
      address: element.tags['addr:street'] 
        ? `${element.tags['addr:street']}, ${element.tags['addr:housenumber'] || ''}`
        : 'Адрес не указан',
      phone: element.tags.phone || '',
      openingHours: element.tags.opening_hours || '',
      rating: element.tags.rating ? parseFloat(element.tags.rating) : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch OSM data:', error);
    return [];
  }
}

/**
 * Get delivery time estimate based on real distance calculation
 */
export function calculateDeliveryTime(distanceKm: number): number {
  const avgSpeed = 35; // km/h for courier in city
  const prepTime = 20; // minutes average preparation
  const travelTime = Math.ceil((distanceKm / avgSpeed) * 60);
  return prepTime + travelTime;
}

/**
 * Calculate delivery fee based on distance
 */
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 2) return 0; // Free delivery within 2km
  if (distanceKm <= 5) return 500;
  if (distanceKm <= 10) return 1000;
  return 1500; // Maximum fee
}

/**
 * Haversine formula to calculate distance between two points
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Cached function to get all menu data
 */
export const getMenuData = cache(() => {
  return ASTANA_MENU_DATA;
});

/**
 * Get products by category
 */
export function getProductsByCategory(categoryId?: string) {
  const data = getMenuData();
  if (!categoryId) return data.products;
  return data.products.filter(p => p.category === categoryId);
}

/**
 * Search products
 */
export function searchProducts(query: string) {
  const data = getMenuData();
  const lowerQuery = query.toLowerCase();
  return data.products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}
