import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

function isAdmin(session: any) { return session?.user?.role === "admin"; }

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const all = await db.select({
      id: users.id, name: users.name, email: users.email,
      role: users.role, phone: users.phone, address: users.address,
    }).from(users);
    return NextResponse.json(all);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
