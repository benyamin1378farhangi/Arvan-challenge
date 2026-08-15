import { cache } from "react";
import { createQueryClient } from "./queryClient";

export const getQueryClient = cache(createQueryClient);
