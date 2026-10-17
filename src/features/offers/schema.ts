import { z } from "zod";
import { localizedList, localizedString } from "@/lib/localized";

export const offerCategories = [
  "developer_tools",
  "productivity",
  "design",
  "cloud",
  "lifestyle",
] as const;

/** content/offers/<id>.json */
export const offerSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().trim().min(1),
    category: z.enum(offerCategories),
    url: z.url(),
    logo: z.string(),
    /** Koyu temada farklı logo gerekiyorsa */
    logoDark: z.string().optional(),
    order: z.number().int().default(100),
    summary: localizedString,
    description: localizedString,
    /** Teklifi almak için adımlar */
    steps: localizedList,
    tags: localizedList.optional(),
  })
  .strict();

export type Offer = z.infer<typeof offerSchema>;
