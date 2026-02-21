import z from "zod";


export const RegisterSchema = z.object({
    email: z.email(),
    name: z.string().min(2, "Name must be at least 2 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});



export const LogInSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 character")
})


export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LogInInput = z.infer<typeof LogInSchema>;