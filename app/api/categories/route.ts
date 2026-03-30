import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

/** GET /api/categories — санаттар тізімі */
export async function GET() {
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.nameKz));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({ error: "Серверде қате пайда болды" }, { status: 500 });
  }
}
