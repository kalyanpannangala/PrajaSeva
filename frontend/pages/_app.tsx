import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";

declare global {
  interface Window {
    google?: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const elementIds = ["google_translate_element", "google_translate_element_mobile"];

    const initTranslateElements = () => {
      const translateElement = window.google?.translate?.TranslateElement;

      if (!translateElement) {
        return false;
      }

      const inlineLayout = translateElement?.InlineLayout;
      const config = {
        pageLanguage: "en",
        includedLanguages: "hi,bn,te,ta,mr,gu,kn,ml,pa,ur,or,as,ne,sa,ks,sd",
        ...(typeof inlineLayout?.SIMPLE !== "undefined" ? { layout: inlineLayout.SIMPLE } : {}),
        autoDisplay: false,
      };

      elementIds.forEach((elementId) => {
        const element = document.getElementById(elementId);

        if (element && !element.hasChildNodes()) {
          try {
            new translateElement(config, elementId);
          } catch (error) {
            console.warn("Google Translate init skipped for", elementId, error);
          }
        }
      });

      return true;
    };

    const onRouteChangeComplete = () => {
      window.setTimeout(() => {
        initTranslateElements();
      }, 0);
    };

    const scriptId = "google-translate-script";
    let pollInterval: number | undefined;

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://translate.google.com/translate_a/element.js";
      script.async = true;
      script.onload = () => {
        initTranslateElements();
      };
      document.body.appendChild(script);
    } else {
      initTranslateElements();
    }

    pollInterval = window.setInterval(() => {
      if (initTranslateElements()) {
        window.clearInterval(pollInterval);
      }
    }, 150);

    window.setTimeout(() => {
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }
    }, 5000);

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
