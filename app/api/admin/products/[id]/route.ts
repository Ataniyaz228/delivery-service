import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function isAdmin(session: any) { return session?.user?.role === "admin"; }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const body = await req.json();
    const updates: any = {};
    if (body.price !== undefined) updates.price = String(parseFloat(body.price));
    if (body.stock !== undefined) updates.stock = parseInt(body.stock);
    if (body.nameKz !== undefined) updates.nameKz = body.nameKz;
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl || null;
    await db.update(products).set(updates).where(eq(products.id, parseInt(id)));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
