import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Add your meta tags for social sharing here */}
      <Head>
        {/* Primary Meta Tags */}
        <title>Spacepong VR - Beer Pong in Space</title>
        <meta name="title" content="Spacepong VR - Beer Pong in Space" />
        <meta name="description" content="Experience intergalactic beer pong on your Meta Quest 2! Turn off gravity and play in outer space." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xr-rancho.vercel.app/" />
        <meta property="og:title" content="Spacepong VR - Beer Pong in Space" />
        <meta property="og:description" content="Experience intergalactic beer pong on your Meta Quest 2! Turn off gravity and play in outer space." />
        <meta property="og:image" content="/opengraph.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://xr-rancho.vercel.app/" />
        <meta property="twitter:title" content="Spacepong VR - Beer Pong in Space" />
        <meta property="twitter:description" content="Experience intergalactic beer pong on your Meta Quest 2! Turn off gravity and play in outer space." />
        <meta property="twitter:image" content="/opengraph.png" />
      </Head>
      
      {/* Render the rest of the app */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
