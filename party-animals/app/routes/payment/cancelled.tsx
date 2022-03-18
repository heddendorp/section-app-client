import { Link } from '@remix-run/react';

export default function Cancelled() {
  return (
    <div
      className="
    mt-6
    flex
    w-full
    items-center
    justify-center
    px-8
  "
    >
      <div className="rounded-md bg-white px-10 py-5 shadow-xl md:py-20 md:px-40">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-blue-600 md:text-9xl">
            Payment cancelled!
          </h1>

          <h6 className="mb-2 text-center text-lg font-bold text-gray-800 md:text-2xl md:text-3xl">
            You will not be charged
          </h6>

          <p className="mb-8 text-center text-gray-500 md:text-lg">
            You can try restarting that process or contact us at{' '}
            <a href="mailto:questions@esn-tumi.de">questions@esn-tumi.de</a>
          </p>

          <Link
            to="/registration"
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          >
            <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium hover:bg-transparent">
              Go to back to registration
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
