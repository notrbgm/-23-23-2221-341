import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { authService } from "$lib/services/auth";
import { RateLimitService } from "$lib/services/rate-limit";

export async function POST({ request }: RequestEvent) {
  const { token, newPassword } = await request.json();

  if (!token || !newPassword) {
    return json(
      { error: "Token and new password are required" },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return json(
      { error: "Password must be at least 8 characters long" },
      { status: 400 },
    );
  }

  const rateLimit = RateLimitService.checkPasswordResetLimit(token);
  if (!rateLimit.allowed) {
    return json({
      error: `Too many attempts. Please try again in ${Math.ceil(rateLimit.timeLeft! / 60)} minutes.`
    }, { status: 429 });
  }

  try {
    const userId = await authService.validateResetToken(token);
    if (!userId) {
      return json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    await authService.updatePassword(userId, newPassword);
    await authService.clearResetToken(userId);

    return json({ message: "Your password has been successfully reset" });
  } catch (error) {
    console.error("Password reset error:", error);
    return json(
      {
        error: "An error occurred while resetting your password. Please try again."
      },
      { status: 500 },
    );
  }
}
