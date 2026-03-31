import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function isAdmin(session: any) {
  return session?.user?.role === "admin";
}

/**
 * POST /api/admin/products — жаңа тауар қосу (тек admin)
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  try {
    const body = await req.json();
    const { nameKz, descriptionKz, categoryId, price, stock, imageUrl } = body;
    if (!nameKz?.trim() || !price) {
      return NextResponse.json({ error: "Атауы мен бағасы міндетті" }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      nameKz: nameKz.trim(),
      descriptionKz: descriptionKz?.trim() || null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      price: String(parseFloat(price)),
      stock: parseInt(stock) || 0,
      imageUrl: imageUrl?.trim() || null,
    }).returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/products]", error);
    return NextResponse.json({ error: "Тауарды жасау мүмкін болмады" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products?id=X — тауарды жою (тек admin)
 * Ескерту: Тапсырыстар тарихын бұзбау үшін "Soft Delete" (isActive = 0) қолданамыз.
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  try {
    const id = parseInt(new URL(req.url).searchParams.get("id") || "");
    if (isNaN(id)) return NextResponse.json({ error: "Жарамсыз ID" }, { status: 400 });
    
    // Soft Delete: isActive = 0
    await db.update(products).set({ isActive: 0 }).where(eq(products.id, id));
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/products]", error);
    return NextResponse.json({ error: "Тауарды жою мүмкін болмады" }, { status: 500 });
  }
}
