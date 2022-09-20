import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header/Header";
import { APP_NAME } from "../constants/appConstants";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Header title={APP_NAME} />
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
