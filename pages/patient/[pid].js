import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as contentful from 'contentful';

import { isRouterReady } from '../../utils';
import PatientCard from '../../components/PatientCard';

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

function Patient() {
  const [patientRecord, setPatient] = useState(null);
  const router = useRouter();

  async function getPatient() {
    const { pid } = router.query;
    const patient = await client.getEntry(pid);

    if (patient) {
      return patient;
    }
  }

  useEffect(() => {
    async function queryPatient() {
      const individualPatient = await getPatient();

      setPatient(individualPatient.fields);
    }

    if (isRouterReady(router)) queryPatient();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {patientRecord && <PatientCard record={patientRecord} />}
    </div>
  );
}

export default Patient;
