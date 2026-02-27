import { z } from "zod";


export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name is too long"),

  description: z.string().max(200, "Description is too long").optional(),

  parentId: z.string().uuid().optional(),

  level: z.number().int().min(0).optional(),

  sortOrder: z.number().int().min(0).optional(),

  isActive: z.boolean().optional(),

  imageId: z.string().uuid().optional(),

  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),

  productCount: z.number().int().min(0).optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
