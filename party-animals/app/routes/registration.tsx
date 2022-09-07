import styles from '~/styles/registration.css';
import { Link, Outlet } from '@remix-run/react';
import { itemURL } from '~/utils';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function Registration() {
  return (
    <main className="text-white">
      <section className="intro">
        <h1 className="mb-6 text-4xl font-black md:text-6xl">
          Party Animals registration
        </h1>
        <p className="mb-4 md:text-lg">
          Hey there! <br />
          We're happy to see that you're interested in joining the{' '}
          <strong>Party Animals</strong>. Please read through the remaining info
          we have for you and follow the instructions to sign up. It's going to
          be awesome having you on board.
          <br />
          The cost of party animals is 89 EUR per person, payable after we offer
          you a spot. This includes the cost of all activities and travels. We
          cannot cover additional drinks and food that you may want during the
          events though.
        </p>
        {/*<p className="text-slate-300 ">
          If you still have questions about TUMi or Party Animals ypu can find
          us on facebook at&nbsp;
          <a
            className="text-blue-300 underline visited:text-purple-300 hover:text-blue-500"
            href="https://www.facebook.com/esntumi.munchen"
          >
            facebook.com/esntumi.munchen
          </a>
          .
        </p>*/}
        <p className="text-slate-300 ">
          If you encounter technical trouble while signing up please
          contact&nbsp;
          <a
            className="text-blue-300 underline visited:text-purple-300 hover:text-blue-500"
            href="mailto:questions@esn-tumi.de?subject=[Party Animals] Technical trouble"
          >
            questions@esn-tumi.de
          </a>
          .
        </p>
        <h1 className="mb-4 mt-6 text-2xl font-black md:text-4xl">
          Frequently asked questions
        </h1>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>Can I be in a group with my friends?</strong>
            <p>
              No. You can't decide what group you are in and the spirit of party
              animals is finding new friends along the way.
            </p>
          </div>
          <div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>What if I'm not that much of a party-person?</strong>
            <p>
              If partying and the accompanying alcohol are not really your jam,
              check out the countless other orientation week events we have
              prepared for you.
            </p>
          </div>
          <div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>What if I can only attend some events?</strong>
            <p>
              Please refer to the schedule to make sure that you can attend as
              many events as possible, Party Animals is meant to be done
              together. If the schedule doesn't work for you, check out some of
              the other events we have prepared for you in the first weeks.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4 md:col-span-2 md:flex-row md:space-x-4 md:space-y-0">
            <img src={itemURL('coronavirus:nolan')} className="w-16" />
            <div>
              <strong>What about the pandemic?</strong>
              <p>
                Party Animals is a program with a lot of contact which we
                believe is crucial for making friends. Thus, we require you to{' '}
                <strong>
                  classify as fully vaccinated according to german law
                </strong>
                . You can find out more{' '}
                <a
                  className="text-blue-300 underline visited:text-purple-300 hover:text-blue-500"
                  href="https://www.bmi.bund.de/SharedDocs/faqs/EN/topics/civil-protection/coronavirus/travel-restrictions-border-control/IV-restrictions-applying-to-air-and-sea-travel-outside-of-europe/what-rules-apply-for-fully-vaccinated-people.html"
                  target="_blank"
                >
                  here
                </a>
                . <br />
                In case of new regulations parts of the program could be moved,
                substituted or canceled. We do our best to replace it as
                appropriately as possible, but can't guarantee it.
              </p>
            </div>
          </div>
          {/*<div>
            <strong>Can I cancel after I signed up?</strong>
            <p>
              Yes. There will be a period for cancelling your registration, but
              please put some thought into it before you sign up.
            </p>
          </div>*/}
          <div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>How do you select who gets in?</strong>
            <p>
              Selection is mainly done by registration order, we do however try
              to keep the groups diverse and balanced.
            </p>
          </div>
          {/*<div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>Are you worried?</strong>
            <p>
              We would not have brought back Party Animals if we did not think
              that it would work and be great. We are confident that it will not
              be impacted by the pandemic.
            </p>
          </div>*/}
          <div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>Where can I find out more?</strong>
            <p>
              To find out more about the program go to the overview or reach us
              on instagram, facebook and via mail. You can also join our
              telegram group for this semester.
            </p>
            <div className="mt-2 flex space-x-2">
              <a href="https://www.instagram.com/tumi.esn/" target="_blank">
                <img
                  src={itemURL('instagram-new:fluency')}
                  className="w-8"
                  alt=""
                />
              </a>
              <a
                href="https://www.facebook.com/esntumi.munchen"
                target="_blank"
              >
                <img
                  src={itemURL('facebook-new:fluency')}
                  className="w-8"
                  alt=""
                />
              </a>
              <a href="https://t.me/+GDxAsMO1m7VlZTBk" target="_blank">
                <img
                  src={itemURL('telegram-app:fluency')}
                  className="w-8"
                  alt=""
                />
              </a>
              <a
                href="mailto:questions@esn-tumi.de?subject=[Party Animals] "
                target="_blank"
              >
                <img
                  src={itemURL('email-sign:fluency')}
                  className="w-8"
                  alt=""
                />
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-white bg-gray-300 bg-opacity-10 p-4">
            <strong>What's next?</strong>
            <p>
              Keep the following dates in mind:
              <ul className="list-inside list-disc">
                <li>
                  <strong>20.09. 18:00</strong>: Applications close
                </li>
                <li>
                  <strong>23.09. 18:00</strong>: First round of admissions
                </li>
                <li>
                  <strong>25.09. 18:00</strong>: Second round of admissions
                </li>
              </ul>
              Check your mails to confirm your registration.
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
        >
          <span className="block rounded-full bg-slate-800 px-8 py-3 text-sm font-medium hover:bg-transparent">
            Go to overview
          </span>
        </Link>
      </section>
      <Outlet />
    </main>
  );
}
