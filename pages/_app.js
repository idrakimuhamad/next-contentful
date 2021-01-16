import client from '../services/client';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-white">
      <Header client={client} />
      <Component apiClient={client} {...pageProps} />
    </div>
  );
}

export default MyApp;
