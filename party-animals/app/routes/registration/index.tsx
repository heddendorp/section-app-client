import styles from '~/styles/registration.css';
import { Link } from '@remix-run/react';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function Index() {
  return (
    <main>
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
          The cost of party animals is 65 EUR per person, payable after we offer
          you a spot.
        </p>
        <p className="text-slate-300 ">
          If you still have questions about TUMi or Party Animals ypu can find
          us on facebook at&nbsp;
          <a
            className="text-blue-300 underline visited:text-purple-300 hover:text-blue-500"
            href="https://www.facebook.com/esntumi.munchen"
          >
            facebook.com/esntumi.munchen
          </a>
          .
        </p>
        <p className="text-slate-300 ">
          If you encounter technical trouble while signing up please
          contact&nbsp;
          <a
            className="text-blue-300 underline visited:text-purple-300 hover:text-blue-500"
            href="mailto:questions@esn-tumi.de?subject=[TUMi app] PA signup"
          >
            questions@esn-tumi.de
          </a>
          .
        </p>
        <h1 className="mb-4 mt-6 text-2xl font-black md:text-4xl">
          Frequently asked questions
        </h1>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div>
            <strong>Can I be in a group with my friends?</strong>
            <p>
              No. You can't decide what group you are in and the spirit of party
              animals is finding new friends along the way.
            </p>
          </div>
          <div>
            <strong>What if I'm not that much of a party-person?</strong>
            <p>
              If partying and the accompanying alcohol are not really your jam,
              check out the countless other orientation week events we have
              prepared for you.
            </p>
          </div>
          <div>
            <strong>What if I can only attend some events?</strong>
            <p>
              Please refer to the schedule to make sure that you can attend as
              many events as possible, Party Animals is meant to be done
              together. If the schedule doesn't work for you, check out some of
              the other events we have prepared for you in the first weeks.
            </p>
          </div>
          <div>
            <strong>Can I cancel after I signed up?</strong>
            <p>
              Yes. There will be a period for cancelling your registration, but
              please put some thought into it before you sign up.
            </p>
          </div>
          <div>
            <strong>How do you select who gets in?</strong>
            <p>
              Selection is mainly done by registration order, we do however try
              to keep the groups diverse a balanced.
            </p>
          </div>
          <div>
            <strong>Where can I find out more?</strong>
            <p>
              To find out more about Party Animals go to the info site we have
              made for you.
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
    </main>
  );
}
