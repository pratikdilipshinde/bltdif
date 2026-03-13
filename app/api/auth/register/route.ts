export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { signSession } from "@/app/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const firstname = (body.firstname ?? "").trim() || null;
    const lastname = (body.lastname ?? "").trim() || null;
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { firstname, lastname, email, passwordHash },
      select: { id: true, email: true, role: true, firstname: true, lastname: true },
    });

    const token = await signSession({
      id: user.id,
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    const res = NextResponse.json({ ok: true, user });
    res.cookies.set("bltdif_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Register failed." }, { status: 500 });
  }
}
