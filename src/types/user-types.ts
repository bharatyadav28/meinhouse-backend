import { z } from "zod";

import { createUserSchema } from "../@entities/user/user.model";

export type CreateUserType = z.infer<typeof createUserSchema>;
