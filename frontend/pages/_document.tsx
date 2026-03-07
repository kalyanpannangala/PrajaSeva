import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/PS-Favicon.png" type="image/png" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                // Function to initialize a translate element if it exists and is empty
                function initElement(elementId) {
                  const element = document.getElementById(elementId);
                  if (element && !element.hasChildNodes() && window.google && window.google.translate) {
                    try {
                      new google.translate.TranslateElement(
                        {
                          pageLanguage: 'en',
                          includedLanguages: 'hi,bn,te,ta,mr,gu,kn,ml,pa,ur,or,as,ne,sa,ks,sd',
                          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                          autoDisplay: false
                        },
                        elementId
                      );
                    } catch (e) {
                      console.log('Translate init skipped for', elementId);
                    }
                  }
                }
                
                // Try to init all possible translate elements
                const elements = ['google_translate_element', 'google_translate_element_mobile'];
                elements.forEach(initElement);
                
                // Keep checking for new elements (for React dynamic rendering)
                let attempts = 0;
                const checkInterval = setInterval(() => {
                  attempts++;
                  elements.forEach(initElement);
                  if (attempts > 50) clearInterval(checkInterval); // Stop after 5 seconds
                }, 100);
              }
            `,
          }}
        />
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
