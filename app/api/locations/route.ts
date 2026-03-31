import { NextRequest, NextResponse } from "next/server";
import { fetchOSMRestaurants, calculateDistance, calculateDeliveryTime, calculateDeliveryFee, ASTANA_DISTRICTS } from "@/lib/real-data";

// Cache for OSM data (5 minutes)
let osmCache: any[] | null = null;
let cacheTime = 0;

/**
 * GET /api/locations — Get real restaurant locations in Astana
 * Query params: lat, lon, radius (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || String(ASTANA_DISTRICTS.almaty.center[0]));
    const lon = parseFloat(searchParams.get("lon") || String(ASTANA_DISTRICTS.almaty.center[1]));
    const radius = parseInt(searchParams.get("radius") || "2000");

    // Check cache (5 min)
    const now = Date.now();
    if (osmCache && now - cacheTime < 300000) {
      return NextResponse.json(osmCache);
    }

    // Fetch from OSM
    const restaurants = await fetchOSMRestaurants(lat, lon, radius);
    
    // If OSM fails or returns empty, use fallback data
    if (restaurants.length === 0) {
      const fallback = [
        { id: "fb1", name: "Dodo Pizza", cuisine: "pizza", lat: 51.1494, lon: 71.4247, address: "пр. Туран 1", phone: "+7 777 123 4567", openingHours: "09:00-23:00", rating: 4.8 },
        { id: "fb2", name: "Burger King", cuisine: "fast_food", lat: 51.1508, lon: 71.4247, address: "ТРЦ Хан Шатыр", phone: "+7 777 234 5678", openingHours: "10:00-22:00", rating: 4.6 },
        { id: "fb3", name: "Sushi Master", cuisine: "japanese", lat: 51.1397, lon: 71.4175, address: "ул. Кенесары 15", phone: "+7 777 345 6789", openingHours: "11:00-23:00", rating: 4.7 },
        { id: "fb4", name: "Coffee House", cuisine: "cafe", lat: 51.1547, lon: 71.4108, address: "пр. Мангилик Ел 8", phone: "+7 777 456 7890", openingHours: "08:00-22:00", rating: 4.5 },
        { id: "fb5", name: "Чифир", cuisine: "georgian", lat: 51.1608, lon: 71.3997, address: "ул. Сыганак 4", phone: "+7 777 567 8901", openingHours: "12:00-00:00", rating: 4.9 },
      ];
      
      // Add distance and delivery info
      const enriched = fallback.map((r: any) => ({
        ...r,
        distance: calculateDistance(lat, lon, r.lat, r.lon),
        deliveryTime: calculateDeliveryTime(calculateDistance(lat, lon, r.lat, r.lon)),
        deliveryFee: calculateDeliveryFee(calculateDistance(lat, lon, r.lat, r.lon)),
      }));
      
      osmCache = enriched;
      cacheTime = now;
      return NextResponse.json(enriched);
    }

    // Enrich OSM data with distance and delivery info
    const enriched = restaurants.map((r: any) => ({
      ...r,
      distance: calculateDistance(lat, lon, r.lat, r.lon),
      deliveryTime: calculateDeliveryTime(calculateDistance(lat, lon, r.lat, r.lon)),
      deliveryFee: calculateDeliveryFee(calculateDistance(lat, lon, r.lat, r.lon)),
    }));

    osmCache = enriched;
    cacheTime = now;

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[GET /api/locations]", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
