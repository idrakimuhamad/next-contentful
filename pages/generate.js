import { useRef, useState } from 'react';
import Head from 'next/head';
import QRious from 'qrious';
import Spinner from '../components/Spinner';

function HomePage({ apiClient }) {
  function onInput(event) {
    setPid(event.target.value);

    if (error) {
      setError('');
    }
  }

  function generateQr() {
    if (canvas?.current) {
      const loc = location.origin;
      const patientUrl = `${loc}/patient/${pid}`;
      const qr = new QRious({
        element: canvas.current,
        value: patientUrl,
      });
    }
  }

  async function getPatient() {
    try {
      const patient = await apiClient.getEntry(pid);

      if (patient) {
        console.log(patient);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function processQr() {
    if (pid && pid.length) {
      setLoading(true);

      // check patient entry
      const isExist = await getPatient();

      if (isExist) {
        generateQr();
      } else {
        setError(`Patient doesn't seems to exists. Please check the record.`);
      }

      setLoading(false);
    }
  }

  const [pid, setPid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvas = useRef(null);

  return (
    <>
      <Head>
        <title>Next.js + Covid</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Generate Patient's QR
            </h1>
            <p className="mb-8 leading-relaxed">
              Paste the Patient's ID from the record
            </p>
            <div className="flex w-full md:justify-start justify-center items-end">
              <div className="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
                <label
                  htmlFor="hero-field"
                  className="leading-7 text-sm text-gray-600">
                  Patient's ID
                </label>
                <input
                  type="text"
                  id="hero-field"
                  name="hero-field"
                  className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-purple-200 focus:bg-transparent focus:border-purple-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onChange={onInput}
                  value={pid}
                  spellCheck={false}
                />
              </div>
              <button
                className="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg"
                onClick={processQr}>
                Generate
              </button>
            </div>
            <p className="text-sm mt-2 text-gray-500 mb-2 w-full">
              Make sure its a valid ID. Check the info tab of the patient entry.
            </p>
            {error.length > 0 && (
              <p className="text-sm mt-2 text-red-500 mb-2 w-full">{error}</p>
            )}
          </div>
          <div className="flex items-center justify-center lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <div className="flex items-center justify-center w-60 h-60">
              {loading && <Spinner width={24} height={24} color="#6366f1" />}
              <canvas
                ref={canvas}
                className={`object-cover object-center rounded w-60 h-60 ${
                  loading || error ? 'opacity-0' : ''
                }`}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
