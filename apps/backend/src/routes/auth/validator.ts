import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schemaAuth = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const zAuthValidator = zValidator("form", schemaAuth, (result, c) => {
  if (!result.success) {
    return c.json({ success: false, message: result.error.errors[0].message });
  }
});
