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

/** PATCH /api/products/[id] — тауарды жаңарту */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const allowed = ["nameKz", "descriptionKz", "price", "stock", "imageUrl", "isActive"] as const;
    const update: Partial<Record<typeof allowed[number], any>> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Жаңарту өрістері жоқ" }, { status: 400 });
    }
    await db.update(products).set(update).where(eq(products.id, parseInt(id)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/products/[id]]", error);
    return NextResponse.json({ error: "Серверде қате пайда болды" }, { status: 500 });
  }
}
