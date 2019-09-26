# <img src="https://esn-tumi.de/assets/images/blume.svg" alt="Logo" width="80px"> TUMi app **α**

This app is meant to provide all tolls necessary to organize the **ESN TUMi munich** events.

**α**: please not that the current available version of this app is very much in development and not intended to be used for anything more than clicking around to see where the journey might go

## Roadmap

To see the current status visit the [Features](/FEATURES.md) page.

### MVP 1 _(planned by august 2019)_

The MVP describes the set of features that the app needs to provide any value over the current system of event registration and management.

- Event management
  - Option to see all available events and how many places are free on each of them
  - Possibility to see events that the user has signed up for
  - Overview for the office to plan events and check status on registered tutors
- The tool should send confirmation emails whenever money was exchanged
- A balance of current available funds has to be visible _(ideally with a transaction history)_
- Some info page with helpful links and explanations
- Registration
  - Provide a way to register people from the administrative side
  - Allow users to create QR-codes that will speed up registration
- Platform support will be a terrible mix of **mobile only** for students and **desktop only** for administrative features, this will be resolved with a more responsive approach later on

### MVP 2 _(planned by october 2019)_

- Event management
  - Implement all additional event types
  - Move event signups to their own collection to save more metadata
- User management
  - Change the user signup to be open for everyone
  - Implement Facebook and EMail signup
  - Allow the office to change userdata
- Allow searching through transactions and generate invoices for users
- The tool should send confirmation emails whenever money was exchanged

### V 1 _(until february 2020)_

In V 1 the first non essential but highly useful features will be shipped

- Attendance keeping on events
- Option to display external events in the calendar
- Event related information sharing (such as links to shared photo albums and meeting points)
- Reminders and information emails
- Waiting list option for very popular events
- Implement tutor tools for late payments and event planning

### V 1.1

V 1.1 will further expand the feature set of the app based on identified needs in V 1

## Development

### Local setup

1.  Make sure you have both the angular cli, yarn and node installed on your machine
1.  Clone the repository, open a command line in the folder and run `yarn`
1.  You can start the development server by running `yarn start` now

## Tech things _(lifted from internal docs)_

### Platform: `Web`

I propose a web-app that can me used on PCs for registration, on the tutor phones and participant phones for info and attendance. Allowing for no-install use and easy updates, but currently has no support for iOS push notifications.

### Technologies

Further I propose an angular, angular/components and firebase stack that makes a server redundant, also angular is a very widely used and reliable. Additionally a state management library such as NGXS or NGRX might be needed when the app grows.
