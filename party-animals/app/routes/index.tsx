import styles from '~/styles/landing.css';
import { Link } from '@remix-run/react';
import { itemURL } from '~/utils';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function Index() {
  return (
    <main>
      <section className="pa-start">
        <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
          <h1 className="mb-4 text-4xl font-black md:text-6xl">Welcome!</h1>
          <p className="mb-4 md:text-lg">
            Some years ago the TUMi secret council sat together and developed
            the ultimate way to kick off exchange in Munich. They came up with
            the Orientationweeks+ programme. Since then we have been perfecting
            this idea every semester without any regard for the health of our
            tutors. Last semester one student called it "The ultimate Munich
            student life safari", here and around the world it is known as{' '}
            <strong>Party Animals</strong>!<br />
            If 9 days of being a party animal sound a little intense to you or
            you would prefer to get started on you own time, check out the
            extensive program of single events in our orientationweeks.
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <Link
              className=" inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[4px] text-center hover:text-white focus:outline-none focus:ring active:text-opacity-75"
              to="/registration"
            >
              <span className="block rounded-full bg-slate-800 px-8 py-3 text-center text-lg font-bold hover:bg-transparent">
                Sign up now!
              </span>
            </Link>
            <a
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[4px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
              href="https://tumi.esn.world/events"
            >
              <span className="block rounded-full bg-slate-800 px-8 py-3 text-center text-lg font-bold hover:bg-transparent">
                Check out the Orientationweeks
              </span>
            </a>
          </div>
        </div>
      </section>
      <section className="font-culture bg-slate-200 p-4 py-8 sm:p-8">
        <h2 className="mb-4 text-2xl font-black md:text-4xl">
          Not a big party person?
        </h2>
        <div className="flex flex-row space-x-2">
          <div className="flex flex-col space-y-4">
            <p className="mb-4 md:text-lg">
              No worries! For the first time this semester we have just the
              thing for you! <br /> Check out the{' '}
              <strong>Culture Creatures</strong> a five day program of cultural
              events and activities.
            </p>
            <div>
              <a
                className="mt-4 h-12 bg-slate-900 p-4 px-8 font-medium uppercase tracking-wider text-white"
                href="https://tumi.esn.world/events"
              >
                LEARN MORE
              </a>
            </div>
          </div>
          <div className="grow">
            <img
              className="mx-auto hidden h-36 sm:block"
              src={itemURL('venus-de-milo:laces')}
              alt=""
            />
          </div>
        </div>
      </section>
      <section className="pa-schedule p-4 py-8 sm:p-8">
        <h2 className="mb-4 text-2xl font-black md:text-4xl">Schedule</h2>
        <p className="mb-4 md:text-lg">
          We have planned this preliminary schedule for you. This is mainly a
          guide to indicate when the Party Animals events will happen and give
          you an impression of the time needed. <br />
          Changes to this program can happen if our plans don't work out as
          hoped
        </p>
        <div className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('handshake:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Sat 01.10.</strong>
              <p>Kick-off</p>
              <p>Noon and evening</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('food-and-wine:nolan')}
              alt="food-and-wine:nolan"
              className="w-16"
            />
            <div>
              <strong>Sat 01.10.</strong>
              <p>Dinner</p>
              <p>Food and a drink on us!</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('compass:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Sun 02.10.</strong>
              <p>City Rally</p>
              <p>Morning + Noon</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('cocktail:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Sun 02.10.</strong>
              <p>Cocktail Party</p>
              <p>Evening</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2 sm:col-span-2">
            <img
              src={itemURL('castle:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Mon 03.10. - Tue 04.10.</strong>
              <p>Castle Trip + party</p>
              <p>Morning till noon</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('treasure-map:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Wed 05.10.</strong>
              <p>Treasure Hunt</p>
              <p>Morning</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('lecturer:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Wed 05.10.</strong>
              <p>TUM welcome event</p>
              <p>13:00 - 14:30</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('question-mark:nolan')}
              alt="question-mark:nolan"
              className="w-16"
            />
            <div>
              <strong>Different days</strong>
              <p>Pub quiz</p>
              <p>Evening</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('micro:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Different days</strong>
              <p>Karaoke night</p>
              <p>Evening</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('homebrew:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Different days</strong>
              <p>Pub Crawl</p>
              <p>Evening</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('beer:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Different days</strong>
              <p>Brewery Tour</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('city:nolan')}
              alt="world-map:nolan"
              className="w-16"
            />
            <div>
              <strong>Sat 08.10</strong>
              <p>City Trip</p>
              <p>All day</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('trophy:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Sun 09.10</strong>
              <p>Beerlympics</p>
              <p>All day</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 rounded-lg border border-slate-100 border-opacity-20 p-2">
            <img
              src={itemURL('circled:nolan')}
              alt="handshake:nolan"
              className="w-16"
            />
            <div>
              <strong>Tue 11.10</strong>
              <p>Beerlympics backup date</p>
              <p>All day</p>
            </div>
          </div>
        </div>
        <p className="mt-4 md:text-lg">
          You can sign up for the entire program to experience it with you group
          of party animals!
        </p>
      </section>
      <section className="bg-slate-800 p-4 sm:p-8">
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl sm:col-span-2">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/beerlympics.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  "The best experience to start exchange with"
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Show your talents at the Beerlympics
                </h5>

                <p className="text-md mt-1 text-white">
                  We cannot wait to welcome you to the green and beautiful
                  scenery of Munich, the perfect place for a warm get together
                  with your future best friends for the semester and beyond.
                  Bring out the athlete that lies within you and impress them
                  from the very start! But don’t worry, it’s not about winning.
                  Much more importantly, we will be playing beautiful games and
                  enjoy tasty Bavarian beer culture, combined into one beautiful
                  competition, where the only losers are those who choose not to
                  participate!
                </p>
              </div>
            </div>
          </div>
          {/*<div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/badger.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Black Badgers!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  With boss badgers Omar and David
                </h5>

                <p className="text-md mt-1 text-white">
                  Hey guys! <br />
                  Come join us and be part of the beautiful, brilliant and
                  bombastic Black Badgers. You'll have an amazing time together
                  partying, experiencing German culture and making amazing new
                  friends from all over the world.
                </p>
              </div>
            </div>
          </div>*/}
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/gavin.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Black Badgers!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  With boss badgers Omar and David
                </h5>

                <p className="text-md mt-1 text-white">
                  Hey guys! <br />
                  Come join us and be part of the beautiful, brilliant and
                  bombastic Black Badgers. You'll have an amazing time together
                  partying, experiencing German culture and making amazing new
                  friends from all over the world.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/castle.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  "A never-ending party!"
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  We'll make sure you have a good time getting started
                </h5>

                <p className="text-md mt-1 text-white">
                  Join us for unforgettable impressions of Munich by night!
                  Brought to you by dedicated students from our local ESN
                  sections. Just like you, they want nothing more than to make
                  our time in Bavaria’s capital so enjoyable, that we will look
                  back onto it forever. And trust us, they can! Do not miss out
                  on this wonderful experience, where we truly put the “Party”
                  in Party Animals!
                </p>
              </div>
            </div>
          </div>
          {/*<div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/tiger.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Teal Tigers!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Marc, Ilinca and Colin will take care of you
                </h5>

                <p className="text-md mt-1 text-white">
                  It's not like you can do anything about it, but we are the
                  group you'll wish you had been a part of! We're looking
                  forward to meet you, party with you, and provide you with
                  great first impressions of Munich and what's to come during
                  your exchange here! Get ready to make friends for life!
                </p>
              </div>
            </div>
          </div>*/}
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/board.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  (A part of) the TUMi board
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  We'll make sure you have a good time getting started
                </h5>

                <p className="text-md mt-1 text-white">
                  In the beginning of september we travelled to small bavarian
                  town and stayed in a very cold 200 year old house to get away
                  form the city. <br /> Why? We needed to sit down and plan the
                  best possible nine days that can kick off{' '}
                  <strong>your</strong> exchange. We're excited to be welcoming
                  you to Munich and Germany and we're looking forward to meeting
                  you!
                </p>
              </div>
            </div>
          </div>
          {/*<div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/goat.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Green Goats!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Seen here: your main tutor Deniz
                </h5>
                <p className="text-md mt-1 text-white">
                  Hey, I'm Deniz and I will be one of the fabulous tutor squad
                  that will accompany you these 2 amusing, intense and memorable
                  weeks! <br />
                  Get ready for the best time of your life aka the Greatest of
                  All Time “the GOAT” 🐐
                </p>
              </div>
            </div>
          </div>*/}
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl sm:col-span-2">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/brewery.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  "Came for the alcohol, stayed for the friends"
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Spend some chill time with us and your new friends
                </h5>

                <p className="text-md mt-1 text-white">
                  As traditional every semester, during Party Animals we also
                  organize a walking tour to one of the many beautiful lakes
                  around Munich. As seen above, no matter how cold or warm, the
                  event is a blast! This is just a small tease, to get you
                  excited about the beautiful summer months to come during your
                  stay!
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/penguin.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Pink Penguins!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Go hard with Cem and Gerry
                </h5>
                <p className="text-md mt-1 text-white">
                  Hello, future Pink Penguin🐧, my name is Cem (📸on the left)
                  and I was born and raised in Bayern, but have turkish roots. I
                  had my Erasmus semester in Aarhus, DK and being a Party Animal
                  (-Tutor) the 2nd time with Gerry (📸on the right).
                  <br />
                  You will definitely come for the party 🎉, but what's more
                  important: you're going to stay for the good friends you´ll
                  make during that time. Join the legendary Pink Penguins to be
                  part of the madness we create and experience how to party in
                  the 👑CemPions League🍻.
                </p>
              </div>
            </div>
          </div>
          {/*<div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/rhino.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Red Rhinos!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  And alpha Rhinos Pedro and Tung
                </h5>
                <p className="text-md mt-1 text-white">
                  Our Students once said: <br />
                  "Red Rhinos: the great herd I've always wanted to be a part
                  of" and "you guys have made this semester the craziest
                  experience in my life". These sentences make up our promise to
                  you from the Red Rhinos for the ultimate Erasmus experience.
                </p>
              </div>
            </div>
          </div>*/}
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/orga.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Red Rhinos!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  And alpha Rhinos Pedro and Tung
                </h5>
                <p className="text-md mt-1 text-white">
                  Our Students once said: <br />
                  "Red Rhinos: the great herd I've always wanted to be a part
                  of" and "you guys have made this semester the craziest
                  experience in my life". These sentences make up our promise to
                  you from the Red Rhinos for the ultimate Erasmus experience.
                </p>
              </div>
            </div>
          </div>
          {/*<div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/tutors/bear.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  Join the Blue Bears!
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Embark on a wild ride with Altug
                </h5>
                <p className="text-md mt-1 text-white">
                  Hellooo Blue Bears! Welcome to the party animals 💪🏼 The
                  craziest semester approaches so, get ready for an insane time
                  together which you will never forget 🔥 We are Irem, Mayisa,
                  Enrique and Altuğ who will accompany you during the whole
                  semester. German, Russian, Turkish and Dominican cultures are
                  clashing and we hope to expand by you. We all were part also
                  the last semester in the same group which were by far the best
                  group. Experience is talking 😎 What is expecting you? Two
                  weeks and beyond of alcohol, party, sightseeing, new people
                  and cultures. We can‘t wait to meet you and all your different
                  cultures 🌍 Stay tuned and willkommen in Minga 🥨🍻 (Bavarian
                  name of Munich) mia g‘frein uns auf eich!
                </p>
              </div>
            </div>
          </div>*/}
          <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-xl sm:col-span-2">
            <div className="block h-full overflow-hidden rounded-xl bg-white">
              <img
                className="h-auto w-full object-cover"
                src="/images/rally.jpg"
              />
              <div className="h-full bg-gray-900 p-4">
                <h4 className="text-lg font-bold text-white">
                  "The joy of multinational bonding"
                </h4>
                <h5 className="mb-4 text-lg text-slate-200">
                  Get to know people and culture from all over the world
                </h5>

                <p className="text-md mt-1 text-white">
                  Because we are experienced, we know that you should never
                  drink on an empty stomach. That is why, one of our events,
                  called "International Dinner" is so beloved! Every participant
                  is encouraged to cook something from their own culture, so
                  that in only one evening you would have tried delicious food
                  from more than 10-15 different countries! Join us, to bring
                  the yummy in your tummy (aka TUMi, pun intended).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pa-end">
        <Link
          to="registration"
          className="absolute bottom-6 left-6 right-6 text-4xl font-black text-white md:text-6xl"
        >
          Sign up now!
        </Link>
      </section>
    </main>
  );
}
