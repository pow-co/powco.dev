import Router, { useRouter } from "next/router";
import { useState } from "react";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { SplashScreen } from "../components";
import { RelayProvider } from "../context/RelayContext";
import { TuneProvider } from "../context/TuningContext";
import { TwetchProvider } from "../context/TwetchContext";
import { BitcoinProvider } from "../context/BitcoinContext";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  /*  const [loading, setLoading] = useState(false);
  const router = useRouter();

  Router.events.on("routeChangeStart", (url) => {
    if (url.startsWith("/t")) {
      setLoading(true);
    }
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  }); */

  return (
    <>
      <Head>
        <title>PowCo Dev | Top Github issues Ranked by Proof of Work</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://kit.fontawesome.com/090ca49637.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <Script
        src="https://one.relayx.io/relayone.js"
        strategy="beforeInteractive"
      />
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TwetchProvider>
          <RelayProvider>
            <BitcoinProvider>
              <TuneProvider>
                <Component {...pageProps} />
                <Toaster />
              </TuneProvider>
            </BitcoinProvider>
          </RelayProvider>
        </TwetchProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
