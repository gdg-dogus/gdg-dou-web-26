/**
 * Sitenin genel ayarları. Sosyal medya linkleri, alan adı ve dış servisler burada.
 * Bir link değişirse sadece bu dosyayı güncelleyin.
 */
export const siteConfig = {
  url: "https://gdgoncampusdou.com.tr",
  repoUrl: "https://github.com/gdg-dogus",
  /** gdg.community.dev üzerindeki chapter numarası; etkinlikler buradan çekilir. */
  communityChapterId: 2744,
  socials: {
    whatsapp: "https://chat.whatsapp.com/JL2FcOdXFxgGb72P6BxvP9",
    instagram: "https://www.instagram.com/gdgoncampusdou",
    x: "https://x.com/gdgoncampusdou",
    linkedin: "https://www.linkedin.com/company/gdg-on-campus-dogus/",
    medium: "https://medium.com/@gdscdogus",
  },
} as const;

/** Header ve footer'daki sayfa linkleri. Sıra burada belirlenir. */
export const navItems = [
  { href: "/events", key: "events" },
  { href: "/team", key: "team" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/offers", key: "offers" },
  { href: "/about", key: "about" },
] as const;
