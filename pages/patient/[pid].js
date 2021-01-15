import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as contentful from 'contentful';
import QRious from 'qrious';

import Post from '../../components/post';
import { isRouterReady } from '../../utils';

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

function Patient() {
  const [patientRecord, setPatient] = useState(null);
  const router = useRouter();
  const canvas = useRef(null);

  async function getPatient() {
    const { pid } = router.query;
    const patient = await client.getEntry(pid);

    if (patient) {
      return patient;
    }
  }

  function generateQr() {
    if (canvas?.current) {
      const qr = new QRious({
        element: canvas.current,
        value: location.href,
      });
    }
  }

  useEffect(() => {
    async function queryPatient() {
      const individualPatient = await getPatient();

      setPatient(individualPatient.fields);

      generateQr();
    }

    if (isRouterReady(router)) queryPatient();
  }, [router]);

  return (
    <>
      <div
        style={{
          padding: 24,
        }}>
        {patientRecord && (
          <>
            <h1>{patientRecord.fullName}</h1>
            <h1>{patientRecord.address}</h1>
            <h1>
              Covid Results:{' '}
              {patientRecord.covidStatusFlag ? 'Positive' : 'Negative'}
            </h1>
            <canvas ref={canvas}></canvas>
          </>
        )}
      </div>
    </>
  );
}

export default Patient;
