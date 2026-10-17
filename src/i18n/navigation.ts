import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Site içi linklerde `next/link` yerine buradaki `Link`'i kullanın.
 * Dil önekini (/tr, /en) ve basePath'i otomatik ekler.
 */
export const { Link, usePathname, useRouter, getPathname } = createNavigation(routing);
