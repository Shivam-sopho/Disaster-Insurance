import Head from "next/head";
import { APP_NAME } from "../constants/appConstants";
import Hero from "../components/Hero/Hero";

export default function Home() {
  return (
    <div>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_NAME} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
      </main>
    </div>
  );
}
