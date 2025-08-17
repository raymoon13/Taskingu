import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { task } from './tasks';
import { auth } from './auth';

export const server = {
  task,
  auth,
  testing: defineAction({
    accept: 'form',
    input: z.object({
      message: z.string().min(2).max(100),
    }),
    handler: async (input) => {  // Changed from 'resolve' to 'handler'
      return { success: true, message: "Testing action successful!" };
    },
  })
}