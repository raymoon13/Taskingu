import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { createClient } from '../lib/supabase';
import { geminiClient } from '../lib/gemini';


export const task = {
    createTask: defineAction({
        accept: 'form',
        input: z.object({
            rawInput: z.string().min(1, "Raw input is required"),
            category: z.enum(['TASK', 'MEETING']).default('TASK'),
            effortTime: z.coerce.number().optional(),
        }),
        handler: async (input, { cookies, request }) => {
            // Auto-generate title and description from raw input
            // For now, use simple logic (later can be replaced with AI)
            if (!cookies) {
                throw new Error("Unauthorized");
            }

            const supabase = createClient({ request, cookies });
            const { data: { user } } = await supabase.auth.getUser();

            const rawInput = input.rawInput.trim();

            const { title, description } = await geminiClient.generateContent(rawInput);

            const { data, error } = await supabase.from("tasks").insert({
                raw_input: input.rawInput,
                user_id : user?.id,  
                title: title,
                description: description,
                category: input.category,
                effort_time: input.effortTime || 1,
            }).select();

            console.log("Task created:", data);

            if (error) {
                return { success: false, message: error.message };
            } else {
                return { success: true, message: "Task created successfully"};
            }
        }
    }),
    
}