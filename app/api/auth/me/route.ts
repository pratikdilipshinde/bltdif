export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/auth/jwt";

export async function GET() {
  try {
    // ✅ Next.js (newer versions): cookies() is async
    const cookieStore = await cookies();
    const token = cookieStore.get("bltdif_session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload: any = await verifySession(token);

    // Support both styles: payload.sub or payload.id
    const userId = payload?.sub ?? payload?.id;
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstname: true,
        lastname: true,
      },
    });

    return NextResponse.json({ user: user ?? null }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
