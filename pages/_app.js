import { client, writeClient } from '../services/client';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-white">
      <Header client={client} />
      <Component apiClient={client} writeClient={writeClient} {...pageProps} />
    </div>
  );
}

export default MyApp;
