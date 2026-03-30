import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(z.object({ productId: z.number(), quantity: z.number().min(1) })).min(1),
  deliveryAddress: z.string().min(5),
  note: z.string().optional(),
});

/**
 * GET /api/orders — тапсырыстарымды алу
 * Admin болса ?all=true арқылы барлық тапсырыстарды алады
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 401 });

    const isAdmin = (session.user as any).role === "admin";
    const showAll = req.nextUrl.searchParams.get("all") === "true";
    const userId = parseInt((session.user as any).id);

    const rows = await db
      .select()
      .from(orders)
      .where(isAdmin && showAll ? undefined : eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Серверде қате пайда болды" }, { status: 500 });
  }
}

/**
 * POST /api/orders — жаңа тапсырыс беру
 * Body: { items: [{productId, quantity}], deliveryAddress, note? }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });

    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Деректер дұрыс емес" }, { status: 400 });

    const { items, deliveryAddress, note } = parsed.data;
    const userId = parseInt((session.user as any).id);

    // Тауарлардың бағасы мен санын тексеру
    let totalPrice = 0;
    const enrichedItems: { productId: number; quantity: number; unitPrice: number }[] = [];

    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      if (!product) return NextResponse.json({ error: `Тауар #${item.productId} табылмады` }, { status: 400 });
      if (product.stock < item.quantity) return NextResponse.json({ error: `"${product.nameKz}" жеткіліксіз` }, { status: 400 });
      const unitPrice = parseFloat(String(product.price));
      totalPrice += unitPrice * item.quantity;
      enrichedItems.push({ productId: item.productId, quantity: item.quantity, unitPrice });
    }

    // Тапсырыс жасау
    const [newOrder] = await db.insert(orders).values({
      userId,
      totalPrice: String(totalPrice),
      deliveryAddress,
      note: note || null,
    }).returning();

    // Тапсырыс элементтерін жасау + stock азайту
    for (const item of enrichedItems) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
      });
      await db
        .update(products)
        .set({ stock: products.stock - item.quantity })
        .where(eq(products.id, item.productId));
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Тапсырыс беру мүмкін болмады" }, { status: 500 });
  }
}
