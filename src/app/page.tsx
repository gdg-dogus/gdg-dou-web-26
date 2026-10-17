import { routing } from "@/i18n/routing";

// Statik sitede sunucu olmadığı için kök adres (/) varsayılan dile yönlendirilir.
// next/navigation'daki redirect() statik çıktıda sadece JavaScript ile çalıştığı için
// burada HTML'in kendi yönlendirmesi (meta refresh) kullanılıyor.
const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${routing.defaultLocale}/`;

// Hedef sayfa yüklenene kadar bu sayfa ekranda kalır (dev'de ilk derleme birkaç saniye sürer).
// Beyaz ekran yanıp sönmesin diye next-themes'in seçtiği temayı uygulayıp hemen yönlendiriyoruz.
const redirectScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}location.replace(${JSON.stringify(target)})`;

export default function RootPage() {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <meta name="color-scheme" content="light dark" />
        <link rel="canonical" href={target} />
        <title>GDG on Campus DOU</title>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: sabit, kullanıcı girdisi içermeyen yönlendirme betiği */}
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
      <body>
        <noscript>
          <a href={target} className="m-4 inline-block text-primary underline underline-offset-4">
            GDG on Campus DOU
          </a>
        </noscript>
      </body>
    </html>
  );
}
