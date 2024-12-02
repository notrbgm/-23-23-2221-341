import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export async function GET() {
  return json({
    vidsrc: env.VIDSRC_BASE_URL,
    vidsrcpro: env.VIDSRC_PRO_BASE_URL,
    embedsu: env.EMBEDSU_BASE_URL,
  });
}
