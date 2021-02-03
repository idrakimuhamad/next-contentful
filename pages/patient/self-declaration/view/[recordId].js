import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Spinner from '../../../../components/Spinner';
import { isRouterReady } from '../../../../utils';

function SelfDeclaration({ apiClient }) {
  const [record, setRecord] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  async function getRecord() {
    const { recordId } = router.query;
    const response = await apiClient.getEntry(recordId);

    if (response) {
      return response;
    }
  }

  useEffect(() => {
    setLoading(true);

    async function queryPatient() {
      const submissionRecord = await getRecord();

      setRecord(submissionRecord?.fields);
      setLoading(false);
    }

    if (isRouterReady(router)) queryPatient();
  }, [router]);

  return (
    <>
      <Head>
        <title>Self Declaration Form</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center">
        {isLoading ? (
          <Spinner width={48} height={48} color="#059669" />
        ) : record ? (
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Self Declaration Submission
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    View the declaration submission by patient.
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Note that, this cannot be updated after submission.
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Please contact admin for any amendment.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <fieldset>
                      <div className="mb-4">
                        <legend className="text-base font-medium text-gray-900">
                          Personal Details
                        </legend>
                      </div>
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            autoComplete="full-name"
                            className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={record.fullName}
                            readOnly
                          />
                        </div>
                        <div className="col-span-6">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <textarea
                            type="text"
                            name="address"
                            id="address"
                            autoComplete="address"
                            rows="3"
                            className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={record.address}
                            readOnly
                          />
                        </div>
                      </div>
                    </fieldset>

                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          History of Allergies to Vaccines
                        </legend>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="vaccines_yes"
                            name="alergiesToVaccines"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={record.historyOfAllergies}
                            readOnly
                          />
                          <label
                            htmlFor="vaccines_yes"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="vaccines_no"
                            name="alergiesToVaccines"
                            type="radio"
                            value="false"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={!record.historyOfAllergies}
                            readOnly
                          />
                          <label
                            htmlFor="vaccines_no"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                      </div>
                      {record.historyOfAllergies && (
                        <div className="mt-4">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            type="text"
                            name="alergiesToVaccinesExplaination"
                            id="alergiesToVaccinesExplaination"
                            rows="3"
                            className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={record.explanationAllergiesToVaccines}
                            readOnly
                          />
                        </div>
                      )}
                    </fieldset>
                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          History of Severe Allergies including Status
                          Asthmaticus
                        </legend>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="severeAllergiesYes"
                            name="severeAllergies"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={record.historyOfSevereAllergies}
                            readOnly
                          />
                          <label
                            htmlFor="severeAllergiesYes"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="severeAllergiesNo"
                            name="severeAllergies"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={!record.historyOfSevereAllergies}
                            readOnly
                          />
                          <label
                            htmlFor="severeAllergiesNo"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                        {record.historyOfSevereAllergies && (
                          <div className="mt-4">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700">
                              Explaination
                            </label>
                            <textarea
                              type="text"
                              name="severeAllergiesExplaination"
                              id="severeAllergiesExplaination"
                              rows="3"
                              className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={record.explanationSevereAllergies}
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                    </fieldset>
                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          Immunocompromised Individuals - Cancer, chemotheraphy
                        </legend>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="immunocompromisedIndividualsYes"
                            name="immunocompromisedIndividuals"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={record.immunocompromisedIndividuals}
                            readOnly
                          />
                          <label
                            htmlFor="immunocompromisedIndividualsYes"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="immunocompromisedIndividualsNo"
                            name="immunocompromisedIndividuals"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={!record.immunocompromisedIndividuals}
                            readOnly
                          />
                          <label
                            htmlFor="immunocompromisedIndividualsNo"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                        {record.immunocompromisedIndividuals && (
                          <div className="mt-4">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700">
                              Explaination
                            </label>
                            <textarea
                              type="text"
                              name="immunocompromisedIndividualsExplaination"
                              id="immunocompromisedIndividualsExplaination"
                              rows="3"
                              className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={record.explanationImmunocompIndividuals}
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                    </fieldset>
                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          Are you a Pregnant Mother?
                        </legend>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="pregnantMother_yes"
                            name="pregnantMother"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={record.pregnantMother}
                            readOnly
                          />
                          <label
                            htmlFor="pregnantMother_yes"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="pregnantMother_no"
                            name="pregnantMother"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={!record.pregnantMother}
                            readOnly
                          />
                          <label
                            htmlFor="pregnantMother_no"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          Lactating Mother?
                        </legend>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="lactatingMother_yes"
                            name="lactatingMother"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={record.lactatingMother}
                            readOnly
                          />
                          <label
                            htmlFor="lactatingMother_yes"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="lactatingMother_no"
                            name="lactatingMother"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            checked={!record.lactatingMother}
                            readOnly
                          />
                          <label
                            htmlFor="lactatingMother_no"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SelfDeclaration;
