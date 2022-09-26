import { ValidationMessage } from '~/components/ValidationMessage';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { createRegistration } from '~/services/registrations.server';
import { useState } from 'react';
import { db } from '~/utils/db.server';

export let loader: LoaderFunction = async ({ request }) => {
  const countries = await fetch(
    'https://restcountries.com/v2/all?fields=name,alpha2Code'
  ).then((res) => res.json());
  const user = await authenticator.isAuthenticated(request);
  const registration = await db.registration.findFirst({
    where: { user: { id: user?.id } },
  });
  if (registration) {
    return redirect('/registration/status');
  }
  return Promise.all([countries, user]);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error('User not authenticated');
  }
  const [errors, registration] = await createRegistration(formData, user);
  if (errors) {
    const values = Object.fromEntries(formData);
    return { errors, values };
  }
  return { registration };
};

export default function RegistrationForm() {
  let [countries, user] = useLoaderData();
  const [esnMember, setEsnMember] = useState(false);
  const transition = useTransition();
  const actionData = useActionData();
  /*return (
    <section className="bg-slate-800 p-4 text-white md:p-8">
      <h2 className=" text-2xl font-black md:text-4xl">Registration</h2>
      <p className="mt-4 mb-8 md:text-lg">
        The registration deadline for the summer 2022 edition of Party Animals
        has passed. You can still take part in the TUMi orientation weeks.
      </p>
    </section>
  );*/
  return (
    <section className="bg-slate-800 p-4 text-white md:p-8">
      <h2 className=" text-2xl font-black md:text-4xl">Registration</h2>
      <p className="mt-4 mb-8 md:text-lg">
        Register here to join party animals. The registration includes the
        entire program outlined in the overview. You will be assigned to one of
        the eight groups of party animals and stay with them for the whole
        program. <br />
        We believe this is the best way to get to know each other and to start
        well in munich.
      </p>
      <Form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <div
            className="border-l-4 border-red-500 bg-red-900 p-4 text-red-100"
            role="alert"
          >
            <h3 className="mb-4 font-medium">Registration deadline passed!</h3>
            <p>
              You can still sign up, but you will be placed on the waitlist.
              Only if spots become free, you can get one.
            </p>
          </div>
        </div>
        {actionData?.errors.form ? (
          <div className="md:col-span-2">
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.form}
            />
          </div>
        ) : null}
        <h2 className="text-2xl font-bold md:col-span-2 md:text-4xl">
          Who are you?
        </h2>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="firstName"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            required
            defaultValue={actionData?.values?.firstName ?? user.firstName}
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            First name
          </span>
          {actionData?.errors.firstName ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.firstName}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="lastName"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            required
            defaultValue={actionData?.values?.lastName ?? user.lastName}
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Last name
          </span>
          {actionData?.errors.lastName ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.lastName}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="callBy"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="callBy"
            name="callBy"
            type="text"
            placeholder="Call By"
            required
            defaultValue={actionData?.values?.callBy ?? user.firstName}
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Call me by
          </span>
          {actionData?.errors.callBy ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.callBy}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="gender"
        >
          <select
            name="gender"
            id="gender"
            placeholder="Gender"
            required
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            defaultValue={actionData?.values?.gender}
          >
            <option value="">Select your gender</option>
            <option value="f">Female</option>
            <option value="m">Male</option>
            <option value="d">Other</option>
            <option value="n">Prefer not to say</option>
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Gender
          </span>
          {actionData?.errors.gender ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.gender}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="email"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            defaultValue={actionData?.values?.email ?? user.email}
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Email
          </span>
          {actionData?.errors.email ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.email}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="phone"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone"
            required
            defaultValue={actionData?.values?.phone}
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            WhatsApp Number
          </span>
          {actionData?.errors.phone ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.phone}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="country"
        >
          <select
            name="country"
            id="country"
            placeholder="Country"
            defaultValue={actionData?.values?.country}
            required
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
          >
            <option value="">Select your home country</option>
            {countries.map((country: { alpha2Code: string; name: string }) => (
              <option key={country.alpha2Code} value={country.alpha2Code}>
                {country.name}
              </option>
            ))}
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Home Country
          </span>
          {actionData?.errors.country ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.country}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="university"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="university"
            name="university"
            type="text"
            required
            defaultValue={actionData?.values?.university}
            placeholder="University"
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Home University
          </span>
          {actionData?.errors.university ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.university}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="status"
        >
          <select
            name="status"
            id="status"
            required
            defaultValue={actionData?.values?.status}
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
          >
            <option value="">Select your status</option>
            <option value="l">Local Student</option>
            <option value="i">International degree student</option>
            <option value="o">Exchange Student (started before october)</option>
            <option value="e">Exchange Student (starting in october)</option>
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Status
          </span>
          {actionData?.errors.status ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.status}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="diet"
        >
          <select
            name="diet"
            id="diet"
            required
            defaultValue={actionData?.values?.diet}
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
          >
            <option value="none">No restrictions</option>
            <option value="vegetarian">I am vegetarian</option>
            <option value="vegan">I am vegan</option>
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Dietary restrictions
          </span>
          {actionData?.errors.diet ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.diet}
            />
          ) : null}
        </label>
        <div className="flex items-center">
          <label htmlFor="sectionMember">
            <div className="flex flex-row space-x-4">
              <input
                type="checkbox"
                name="sectionMember"
                id="sectionMember"
                defaultValue={actionData?.values?.sectionMember}
                className="h-6 w-6 rounded-md border border-2 border-gray-200 bg-slate-800"
                onChange={(event) => setEsnMember(event.target.checked)}
              />
              <span>I am a member of an ESN section at home</span>
            </div>
            {actionData?.errors.sectionMember ? (
              <ValidationMessage
                isSubmitting={transition.state === 'submitting'}
                error={actionData?.errors?.sectionMember}
              />
            ) : null}
          </label>
        </div>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="esnSection"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="esnSection"
            name="esnSection"
            type="text"
            defaultValue={actionData?.values?.esnSection}
            placeholder="ESN Section"
            disabled={!esnMember}
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs peer-disabled:text-slate-500">
            My ESN section
          </span>
          {actionData?.errors.esnSection ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.esnSection}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="languages"
        >
          <input
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="languages"
            name="languages"
            type="text"
            required
            defaultValue={actionData?.values?.languages}
            placeholder="Languages"
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Indicate non-english languages (with levels) you speak
          </span>
          {actionData?.errors.languages ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.languages}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="dinner"
        >
          <select
            name="dinner"
            id="dinner"
            required
            defaultValue={actionData?.values?.dinner}
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
          >
            <option value="">Select your food option</option>
            <option value="schnitzel">
              Wiener Schnitzel of "Schwäbisch-Hällisches Landschwein" (pork)
              with lemon wedge, wild cranberries and fried potatoes, served with
              a small seasonal salad
            </option>
            <option value="fish">
              Breaded redfish fillet with lemon wedge, homemade remoulade sauce
              and colourfully garnished potato salad
            </option>
            <option value="spatzle">
              Creamy cheese dumplings "Allgäu style" with homemade fried onions
              and small seasonal salad
            </option>
            <option value="pork">
              Young pork roast with dark beer sauce, potato dumplings and local
              coleslaw
            </option>
            <option value="pasta">
              "Pasta sheep's cheese" with fresh market vegetables and herb
              tomato sauce
            </option>
            <option value="salad">
              "Salad Vienna" - colourful leaf salads with tomatoes, cucumbers,
              egg, served with golden-brown fried chicken breast, lime dip and
              garlic bread
            </option>
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Dinner food selection
          </span>
          {actionData?.errors.dinner ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.dinner}
            />
          ) : null}
        </label>
        <h2 className="mt-4 text-2xl font-bold md:col-span-2 md:text-4xl">
          What's your Party Animal?
        </h2>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="size"
        >
          <select
            name="size"
            id="size"
            required
            defaultValue={actionData?.values?.size}
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
          >
            <option value="">Select your shirt size</option>
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xl">XL</option>
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Shirt Size
          </span>
          {actionData?.errors.size ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.size}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3"
          htmlFor="oldie"
        >
          <select
            name="oldie"
            id="oldie"
            required
            defaultValue={actionData?.values?.oldie}
            className="peer w-full border-none bg-slate-800 px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
          >
            <option value="">Select</option>
            <option value="true">Yes! And I need more</option>
            <option value="false">No, can't wait to become one</option>
          </select>
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Have you been a Party Animal before?
          </span>
          {actionData?.errors.oldie ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.oldie}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3 md:col-span-2"
          htmlFor="expectations"
        >
          <textarea
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="expectations"
            name="expectations"
            rows={4}
            required
            defaultValue={actionData?.values?.expectations}
            placeholder="Expectations"
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            My expectations for Party Animals
          </span>
          {actionData?.errors.expectations ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.expectations}
            />
          ) : null}
        </label>
        <label
          className="relative block rounded-lg border-2 border-gray-200 p-3 md:col-span-2"
          htmlFor="requests"
        >
          <textarea
            className="peer w-full border-none bg-transparent px-0 pt-3.5 pb-0 text-sm placeholder-transparent focus:ring-0"
            id="requests"
            name="requests"
            rows={3}
            defaultValue={actionData?.values?.requests}
            placeholder="Expectations"
          />
          <span className="absolute left-3 -translate-y-1/3 text-xs font-medium text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-1/3 peer-focus:text-xs">
            Special requests
          </span>
          {actionData?.errors.requests ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.requests}
            />
          ) : null}
        </label>
        <h2 className="mt-4 text-2xl font-bold md:col-span-2 md:text-4xl">
          Understand some things
        </h2>
        <label htmlFor="pay">
          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              name="pay"
              id="pay"
              required
              defaultValue={actionData?.values?.pay}
              className="h-6 w-6 rounded-md border border-2 border-gray-200 bg-slate-800"
            />
            <span className="ml-3">
              I understand, that once I receive my spot confirmation I have to
              pay 89 euro within 24h to confirm it. Otherwise I will be excluded
              from Party Animals.
            </span>
          </div>

          {actionData?.errors.pay ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.pay}
            />
          ) : null}
        </label>
        <label htmlFor="friends">
          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              name="friends"
              id="friends"
              required
              defaultValue={actionData?.values?.friends}
              className="h-6 w-6 rounded-md border border-2 border-gray-200 bg-slate-800"
            />
            <span>
              I understand, that TUMi will create the groups. And I cannot
              influence in which group I will end up, or who my mates will be
              (this is to ensure diversity)
            </span>
          </div>
          {actionData?.errors.friends ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.friends}
            />
          ) : null}
        </label>
        <label htmlFor="covid">
          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              name="covid"
              id="covid"
              required
              defaultValue={actionData?.values?.covid}
              className="h-6 w-6 rounded-md border border-2 border-gray-200 bg-slate-800"
            />
            <span>
              I understand, that there could be cancellations on short notice
              and maybe not all participation fees could be refunded.
            </span>
          </div>
          {actionData?.errors.covid ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.covid}
            />
          ) : null}
        </label>
        <label htmlFor="vax">
          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              name="vax"
              id="vax"
              required
              defaultValue={actionData?.values?.vax}
              className="h-6 w-6 rounded-md border border-2 border-gray-200 bg-slate-800"
            />
            <span>
              I confirm that I classify as fully vaccinated according to german
              law. You can find out more{' '}
              <a
                className="text-blue-300 underline visited:text-purple-300 hover:text-blue-500"
                href="https://www.bmi.bund.de/SharedDocs/faqs/EN/topics/civil-protection/coronavirus/travel-restrictions-border-control/IV-restrictions-applying-to-air-and-sea-travel-outside-of-europe/what-rules-apply-for-fully-vaccinated-people.html"
                target="_blank"
              >
                here
              </a>
            </span>
          </div>
          {actionData?.errors.vax ? (
            <ValidationMessage
              isSubmitting={transition.state === 'submitting'}
              error={actionData?.errors?.vax}
            />
          ) : null}
        </label>
        <button className="mt-4 inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[3px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 md:col-span-2">
          <span className="block rounded-full bg-slate-800 px-8 py-3 font-medium hover:bg-transparent">
            {transition.state === 'submitting'
              ? 'Getting you started...'
              : 'Begin the journey'}
          </span>
        </button>
      </Form>
    </section>
  );
}
