import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";

/**
 * GET /api/products — тауарлар тізімі (іздеу, санат бойынша сүзу, pagination)
 * Query params: q, category, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const categoryId = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    const conditions = [eq(products.isActive, 1)];
    if (q) conditions.push(ilike(products.nameKz, `%${q}%`));
    if (categoryId) conditions.push(eq(products.categoryId, parseInt(categoryId)));

    const whereClause = and(...conditions);

    const rows = await db
      .select({
        id: products.id,
        nameKz: products.nameKz,
        descriptionKz: products.descriptionKz,
        price: products.price,
        stock: products.stock,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        categoryName: categories.nameKz,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    return NextResponse.json({ products: rows, total: Number(count), page, limit });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "Серверде қате пайда болды" }, { status: 500 });
  }
}
