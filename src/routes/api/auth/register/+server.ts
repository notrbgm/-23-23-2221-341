import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { authService } from "$lib/server/services/auth";
import { createSessionCookie } from "$lib/server/auth";

export async function POST({ request }: RequestEvent) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !password) {
      return new Response("Username and password are required", { status: 400 });
    }


    const existingUser = await authService.findUserByIdentifier(email || username);
    if (existingUser) {
      if (email && existingUser.email === email) {
        return new Response("Email already registered", { status: 400 });
      }
      if (existingUser.username === username) {
        return new Response("Username already taken", { status: 400 });
      }
    }


    const user = await authService.createUser(username, email, password);


    const token = await authService.generateToken(user);

    return json(user, {
      headers: {
        "Set-Cookie": createSessionCookie(token),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
