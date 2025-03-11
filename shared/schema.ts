import { z } from "zod";

export const photoSchema = z.object({
  id: z.string(),
  imageData: z.string(),
  createdAt: z.date(),
  expiresAt: z.date()
});

export type Photo = z.infer<typeof photoSchema>;

export const insertPhotoSchema = photoSchema.omit({ id: true });
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
