import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createClient } from "../lib/supabase";

export const auth = {
    login : defineAction({
        accept:'form',
        input: z.object({
            email: z.string().email("Invalid email"),
            password: z.string().min(6, "Password must be at least 6 characters"),
        }),
        handler: async (input, { cookies, request }) => {
            const supabase = createClient({ request, cookies });
            const { data, error } = await supabase.auth.signInWithPassword({
                email: input.email,
                password: input.password,
            });

            if (error) {
                return { success: false, message: error.message };
            }

            return { success: true, message: data.user.email };
        },
    }), 
    register: defineAction({
        accept: 'form',
        input: z.object({
            email: z.string().email("Invalid email"),
            password: z.string().min(6, "Password must be at least 6 characters"),
        }),
        handler: async (input, { cookies, request }) => {
            const supabase = createClient({ request, cookies });
            const { data, error } = await supabase.auth.signUp({
                email: input.email,
                password: input.password,
            });

            if (error) {
                return { success: false, message: error.message };
            }

            return { success: true, message: data.user?.email };
        }
    }),
    signOut: defineAction({
        handler: async (_, {request, cookies})=> {
            const supabase = createClient({ request, cookies });
            await supabase.auth.signOut();
            return { success: true };
        }
    })
}