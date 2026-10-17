import type about from "../../messages/tr/about.json";
import type blog from "../../messages/tr/blog.json";
import type common from "../../messages/tr/common.json";
import type events from "../../messages/tr/events.json";
import type home from "../../messages/tr/home.json";
import type offers from "../../messages/tr/offers.json";
import type projects from "../../messages/tr/projects.json";
import type team from "../../messages/tr/team.json";
import type { routing } from "./routing";

// Türkçe dosyalar "kaynak" kabul edilir: olmayan bir anahtar kullanılırsa TypeScript hata verir.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof common;
      home: typeof home;
      events: typeof events;
      team: typeof team;
      blog: typeof blog;
      offers: typeof offers;
      about: typeof about;
      projects: typeof projects;
    };
  }
}
