import "../styles/globals.css";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { NFTContextProvider } from "../context/NFTContext";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import { Navbar, Footer } from "../components";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Goerli}>
      <NFTContextProvider>
        <ThemeProvider attribute="class">
          <div className="dark:bg-nft-dark min-h-screen flex-col">
            <Navbar />
            <div className="pt-32">
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
          <Script
            src="https://kit.fontawesome.com/6bc4cce561.js"
            crossOrigin="anonymous"
          />
        </ThemeProvider>
      </NFTContextProvider>
    </ThirdwebProvider>
  );
}
