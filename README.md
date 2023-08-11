# ESN section app

This is the third version of the TUMi app you know and love, currently the active client at tumi.esn.world.

**Jump to local development [here](#run-locally)**

## Features

If you are interested in learning how to use this, read the following docs. This gives you an idea about how the app works and benefits our ESN section.

- [Event creation process](./help/event-journey.md)
- [Administration features](./help/admin-features.md)

## Tips

- [How to select icons](./help/icons.md)

### Concept

The TUMi app is meant to improve the day to day business of an ESN section by automating all steps that take time when organising and running events. Additionally, it aims to give the section greater insight to what's going on.  
Currently the app is made to support the processes inside the TUMi ESN section which operates in a decentralised and lean way. But it can support other modes of operation as well, just reach out.

### Feature list

- Events (learn more in the [Event creation process](./help/event-journey.md))
  - Template library: A place with templates for every event that the section has organised. Making it easy for members to find inspiration and organise something new.
  - Event list: The main public part of the app is the event list that shows all planned events in list and calendar form, students and members can always see what's up here.
  - Registration: The app can handle the entire registration process for events, this includes collecting money or additional information from every users.
  - Event Organisation: The section members are supported with users lists and collection of Email addresses to easily prepare the event and reach all participants.
  - Check in: At the event, every user can present a QR code that verifies their registration to the section member and also captures that the user attended the event.
  - Feedback: After every event the users are asked to provide feedback automatically that helps improve future events.
- Section management
  - Easily mark your members in the app to give them access to the functionality and keep an overview of your section.
  - Collect digital receipts from members running an event and store them securely and easily found for bookkeeping.
  - Instantly get a list of all members email addresses to invite them to your Assembly.
- Administration (learn more in the [Administration features](./admin-features.md))
  - Keep an overview about what's going on with lists of all users, all registrations and other relevant information.
  - Know what you are up to with automatic statistics and graphs to show how you are doing.
  - Also support organisers that are not the section if you want to promote an event.
- Registration management
  - Users can cancel registrations until a specified time before the event starts and receive automatic refunds
  - Users can swap places without having to manage the money as the system handles all transactions.
- Ease of use
  - No need to know about development or server hosting as our platform can support multiple ESN sections.
  - No need to pay as of now as we are running on a microsoft sponsorship and have no cost.
  - Profit from continuous improvements as time goes on.
  - Open source: the code is right here.
  - Profit form customisation to make the tool right for your section as well.
  - You can use a custom domain or get a `<section>.esn.world` domain form us.

### Planned features ( also check the [issues](https://github.com/heddendorp/section-app-client/issues) )

- Finances
  - The app should be capable of listing **all** transactions the section makes and show the financial state at any time.
  - Export lists of your events and their costs for taxes or STIBET.
  - Keep track of which member paid what at which event and if they got their money back.
  - Even support advanced use cases such as cash payment at an event or unforeseen costs.
- Social features
  - The app should become more social, allowing the students to build a profile.
  - People should be able to connect with others they met at events.
- Add more advanced signup methods such as waitlists or random spot assignments
- Customisation
  - Make the app easily configurable for other sections to fit their needs.
  - Offer a way to add some content pages in order to promote partners or share relevant information.

## Run Locally

Clone the project

```bash
  git clone https://github.com/heddendorp/section-app-client.git
```

Go to the project directory

```bash
  cd section-app-client
```

Install dependencies

```bash
  yarn install
```

### Without local server (for frontend only)

This uses the server running on `server.esn.world` which is also used by the live version.

```bash
  yarn dev:light
```

Since the `loccalhost` is mapped to TUMi by default, you can set your tenant in the local storage. Open your browsers devtools and run the following command in the console:

```js
localStorage.setItem('tenantId', '<your ID>');
```

Your tenant id is the first part of your section's domain, e.g. `tumi.esn.world` has the tenant id `tumi`.

## Documentation

Relevant documentation for this project is listed below to give you a starting point.

- [Angular docs](https://angular.io/docs)
- [Angular material docs](https://material.angular.io/components/categories)  
  For things like the formfields and some buttons, this is the UI library.
  It would be nice to move further to Tailwind and reduce reliance on this library.
- [Apollo Angular](https://apollo-angular.com/docs/)  
  For data loading and most server communication.
- [TailwindCSS](https://tailwindcss.com/docs/utility-first)  
  For general styling in the app instead of custom CSS.
