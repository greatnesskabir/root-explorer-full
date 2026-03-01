import { z } from "zod";
import { roots } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  roots: {
    search: {
      method: "POST" as const,
      path: "/api/roots/search" as const,
      input: z.object({
        query: z.string().min(1, "Please enter an Arabic word or root"),
      }),
      responses: {
        200: z.custom<typeof roots.$inferSelect>(),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
    recent: {
      method: "GET" as const,
      path: "/api/roots/recent" as const,
      responses: {
        200: z.array(z.custom<typeof roots.$inferSelect>()),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
