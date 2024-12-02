import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { authService } from "$lib/server/services/auth";
import { createSessionCookie } from "$lib/server/auth";

export async function POST({ request }: RequestEvent) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return new Response("Username/Email and password are required", { status: 400 });
    }

    const user = await authService.validateUser(usernameOrEmail, password);
    if (!user) {
      return new Response("Invalid credentials", { status: 401 });
    }

    const token = await authService.generateToken(user);

    return json(user, {
      headers: {
        "Set-Cookie": createSessionCookie(token),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
