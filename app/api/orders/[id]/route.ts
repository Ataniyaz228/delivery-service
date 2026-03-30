import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** PATCH /api/orders/[id] — тапсырыс күйін өзгерту (тек admin) */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();
    const validStatuses = ["pending", "confirmed", "delivering", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Жарамсыз күй" }, { status: 400 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (!updated) return NextResponse.json({ error: "Тапсырыс табылмады" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/orders/[id]]", error);
    return NextResponse.json({ error: "Серверде қате пайда болды" }, { status: 500 });
  }
}
