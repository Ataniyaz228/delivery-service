import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
});

/** POST /api/auth/register — жаңа пайдаланушы тіркеу */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Деректер дұрыс емес" }, { status: 400 });

    const { name, email, password, phone, address } = parsed.data;
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) return NextResponse.json({ error: "Бұл email тіркелген" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      name, email, passwordHash, phone: phone || null, address: address || null,
    }).returning({ id: users.id, name: users.name, email: users.email });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Тіркелу мүмкін болмады" }, { status: 500 });
  }
}
