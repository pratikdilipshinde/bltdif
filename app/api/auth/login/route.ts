import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return jsonError("Email and password are required.", 400);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return jsonError("Please enter a valid email address.", 400);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("invalid login credentials")) {
        return jsonError("Invalid email or password.", 401);
      }

      if (msg.includes("email not confirmed")) {
        return jsonError("Please verify your email before logging in.", 403);
      }

      return jsonError(error.message || "Unable to login.", 401);
    }

    if (!data.user) {
      return jsonError("Unable to login.", 500);
    }

    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return jsonError("Something went wrong during login.", 500);
  }
}