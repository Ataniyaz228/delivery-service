import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** GET /api/products/[id] — жеке тауар */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [product] = await db
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
      .where(eq(products.id, parseInt(id)));

    if (!product) return NextResponse.json({ error: "Тауар табылмады" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json({ error: "Серверде қате пайда болды" }, { status: 500 });
  }
}

