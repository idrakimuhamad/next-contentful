import client from '../services/client';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header client={client} />
      <Component apiClient={client} {...pageProps} />
    </>
  );
}

export default MyApp;
