import { readJsonDir } from "@/lib/content";
import { offerSchema } from "./schema";

export function getOffers() {
  return readJsonDir("offers", offerSchema).sort((a, b) => a.order - b.order);
}
