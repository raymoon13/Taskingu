import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export function createClient({
    request,
    cookies,
}: {
    request: Request;
    cookies: AstroCookies;
}) {
    const cookieHeader = request.headers.get("Cookie") || "";

    return createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    const cookies = parseCookieHeader(cookieHeader);
                    return cookies.map(({ name, value }) => ({
                        name,
                        value: value ?? "",
                    }));
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookies.set(name, value, options)
                    );
                },
            },
        }
    );
}