import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// GitHub Pages'te proje sayfası alt yolda yayınlanır (ör. /gdg-dou-web-26).
// Deploy workflow'u bu değeri otomatik verir; özel alan adına geçince boş kalır.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
