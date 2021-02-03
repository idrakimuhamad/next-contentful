import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Spinner from '../../../components/Spinner';
import Alert from '../../../components/Alert';
import { isRouterReady } from '../../../utils';

const INITIAL_STATE = {
  fullName: '',
  address: '',
  alergiesToVaccines: false,
  alergiesToVaccinesExplaination: '',
  severeAllergies: false,
  severeAllergiesExplaination: '',
  immunocompromisedIndividuals: false,
  immunocompromisedIndividualsExplaination: '',
  pregnantMother: false,
  lactatingMother: false,
};

function SelfDeclaration({ apiClient, writeClient }) {
  const [formState, setForm] = useState(INITIAL_STATE);
  const [isLoading, setLoading] = useState(false);
  const [alertObj, setAlert] = useState({
    alertType: '',
    message: '',
  });
  const timer = useRef();
  const router = useRouter();

  async function getPatient() {
    const { pid } = router.query;
    const patient = await apiClient.getEntry(pid);

    if (patient) {
      return patient;
    }
  }

  function updatePatientRecord(sdId) {
    const { pid } = router.query;
    writeClient
      .getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
      .then((space) => space.getEnvironment('master'))
      .then((environment) => environment.getEntry(pid))
      .then((entry) => {
        entry.fields = {
          ...entry.fields,
          selfDeclaration: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: sdId,
              },
            },
          },
        };
        return entry.update();
      })
      .then((entry) => entry.publish())
      .then((entry) => {
        console.log(`Patient Entry ${entry.sys.id} updated.`);

        // reset the state
        setForm(INITIAL_STATE);
        setLoading(false);
        showAlert('success', 'Submitted successfully');
      })
      .catch((err) => {
        setLoading(false);
        showAlert('error', err.message || 'Something wrong happen');
      });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { pid } = router.query;

    if (!pid) return;

    if (!formState.fullName || !formState.address) {
      showAlert('error', 'Full name and address are required.');
      return;
    }

    if (
      (formState.alergiesToVaccines &&
        !formState.alergiesToVaccinesExplaination) ||
      (formState.severeAllergies && !formState.severeAllergiesExplaination) ||
      (formState.immunocompromisedIndividuals &&
        !formState.immunocompromisedIndividualsExplaination)
    ) {
      showAlert('error', 'Please enter an explaination in the given field.');
      return;
    }

    // loading
    setLoading(true);

    writeClient
      .getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
      .then((space) => space.getEnvironment('master'))
      .then((environment) =>
        environment.createEntryWithId('selfDeclaration', nanoid(), {
          fields: {
            fullName: {
              'en-US': formState.fullName,
            },
            address: {
              'en-US': formState.address,
            },
            historyOfAllergies: {
              'en-US': formState.alergiesToVaccines,
            },
            historyOfSevereAllergies: {
              'en-US': formState.severeAllergies,
            },
            immunocompromisedIndividuals: {
              'en-US': formState.immunocompromisedIndividuals,
            },
            pregnantMother: {
              'en-US': formState.pregnantMother,
            },
            lactatingMother: {
              'en-US': formState.lactatingMother,
            },
            explanationAllergiesToVaccines: {
              'en-US': formState.alergiesToVaccinesExplaination,
            },
            explanationSevereAllergies: {
              'en-US': formState.severeAllergiesExplaination,
            },
            explanationImmunocompIndividuals: {
              'en-US': formState.immunocompromisedIndividualsExplaination,
            },
          },
        })
      )
      .then((entry) => entry.publish())
      .then((entry) => {
        console.log(`Entry ${entry.sys.id} published.`);
        //   update the Patient record to link the self-declaration
        updatePatientRecord(entry.sys.id);
      })
      .catch((err) => {
        setLoading(false);
        showAlert('error', err.message || 'Something wrong happen');
      });
  }

  function showAlert(type, msg) {
    console.log(msg);
    timer.current && clearTimeout(timer.current);

    setAlert({
      alertType: type,
      message: msg,
    });

    timer.current = setTimeout(() => {
      setAlert({
        alertType: '',
        message: '',
      });
    }, 5000);
  }

  function handleOnChange(event) {
    setForm({
      ...formState,
      [event.target.name]: event.target.value,
    });
  }

  function handleOnRadioChange(event) {
    setForm({
      ...formState,
      [event.target.name]: event.target.value === 'true',
    });
  }

  useEffect(() => {
    async function queryPatient() {
      const individualPatient = await getPatient();

      setForm({
        ...formState,
        fullName: individualPatient?.fields.fullName,
        address: individualPatient?.fields.address,
      });
    }

    if (isRouterReady(router)) queryPatient();
  }, [router]);

  return (
    <>
      <Head>
        <title>Self Declaration Form</title>
      </Head>

      {!!alertObj.alertType.length && (
        <Alert type={alertObj.alertType} message={alertObj.message} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Self Declaration Form
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <fieldset>
                      <div className="mb-4">
                        <legend className="text-base font-medium text-gray-900">
                          Personal Details
                        </legend>
                        <p className="text-sm text-gray-500">
                          We will use this details to contact you for further
                          clarification.
                        </p>
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
                            onChange={handleOnChange}
                            value={formState.fullName}
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
                            onChange={handleOnChange}
                            value={formState.address}
                          />
                        </div>
                      </div>
                    </fieldset>

                    <fieldset>
                      <div>
                        <legend className="text-base font-medium text-gray-900">
                          History of Allergies to Vaccines
                        </legend>
                        <p className="text-sm text-gray-500">
                          If yes, please explain in the fields.
                        </p>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="vaccines_yes"
                            name="alergiesToVaccines"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            onChange={handleOnRadioChange}
                            value="true"
                            checked={formState.alergiesToVaccines}
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
                            onChange={handleOnRadioChange}
                            checked={!formState.alergiesToVaccines}
                          />
                          <label
                            htmlFor="vaccines_no"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                      </div>
                      {formState.alergiesToVaccines && (
                        <div className="mt-4">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700">
                            Please explain further
                          </label>
                          <textarea
                            type="text"
                            name="alergiesToVaccinesExplaination"
                            id="alergiesToVaccinesExplaination"
                            rows="3"
                            className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            onChange={handleOnChange}
                            value={formState.alergiesToVaccinesExplaination}
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
                        <p className="text-sm text-gray-500">
                          If yes, please explain in the fields.
                        </p>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="severeAllergiesYes"
                            name="severeAllergies"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            onChange={handleOnRadioChange}
                            value="true"
                            checked={formState.severeAllergies}
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
                            onChange={handleOnRadioChange}
                            value="false"
                            checked={!formState.severeAllergies}
                          />
                          <label
                            htmlFor="severeAllergiesNo"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                        {formState.severeAllergies && (
                          <div className="mt-4">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700">
                              Please explain further
                            </label>
                            <textarea
                              type="text"
                              name="severeAllergiesExplaination"
                              id="severeAllergiesExplaination"
                              rows="3"
                              className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              onChange={handleOnChange}
                              value={formState.severeAllergiesExplaination}
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
                        <p className="text-sm text-gray-500">
                          If yes, please explain in the fields.
                        </p>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="immunocompromisedIndividualsYes"
                            name="immunocompromisedIndividuals"
                            type="radio"
                            className="focus:ring-green-700 h-4 w-4 text-green-800 border-gray-300"
                            onChange={handleOnRadioChange}
                            value="true"
                            checked={formState.immunocompromisedIndividuals}
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
                            onChange={handleOnRadioChange}
                            value="false"
                            checked={!formState.immunocompromisedIndividuals}
                          />
                          <label
                            htmlFor="immunocompromisedIndividualsNo"
                            className="ml-3 block text-sm font-medium text-gray-700">
                            No
                          </label>
                        </div>
                        {formState.immunocompromisedIndividuals && (
                          <div className="mt-4">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700">
                              Please explain further
                            </label>
                            <textarea
                              type="text"
                              name="immunocompromisedIndividualsExplaination"
                              id="immunocompromisedIndividualsExplaination"
                              rows="3"
                              className="mt-1 focus:ring-green-700 focus:border-green-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              onChange={handleOnChange}
                              value={
                                formState.immunocompromisedIndividualsExplaination
                              }
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
                            onChange={handleOnRadioChange}
                            value="true"
                            checked={formState.pregnantMother}
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
                            onChange={handleOnRadioChange}
                            value="false"
                            checked={!formState.pregnantMother}
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
                            onChange={handleOnRadioChange}
                            value="true"
                            checked={formState.lactatingMother}
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
                            onChange={handleOnRadioChange}
                            value="false"
                            checked={!formState.lactatingMother}
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

                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700">
                      {isLoading ? <Spinner color="white" /> : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelfDeclaration;
