import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import * as contentful from 'contentful';

import { isRouterReady } from '../../utils';
import PatientCard from '../../components/PatientCard';
import Spinner from '../../components/Spinner';

// const client = contentful.createClient({
//   space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
//   accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
// });

function Patient({ apiClient }) {
  const [patientRecord, setPatient] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  async function getPatient() {
    const { pid } = router.query;
    const patient = await apiClient.getEntry(pid);

    if (patient) {
      return patient;
    }
  }

  useEffect(() => {
    setLoading(true);

    async function queryPatient() {
      const individualPatient = await getPatient();

      setLoading(false);
      setPatient(individualPatient?.fields);
    }

    if (isRouterReady(router)) queryPatient();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {isLoading ? (
        <Spinner width={48} height={48} color="#6366f1" />
      ) : patientRecord ? (
        <PatientCard record={patientRecord} />
      ) : null}
    </div>
  );
}

export default Patient;
