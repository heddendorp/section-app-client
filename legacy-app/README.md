# TUMi app **α**

![Logo](https://img.icons8.com/cotton/64/000000/around-the-globe.png)

This app is meant to provide all tolls necessary to organize the **ESN TUMi munich** events.

**α**: please not that the current available version of this app is very much in development and not intended to be used for anything more than clicking around to see where the journey might go

## Roadmap

### MVP 1

THe MVP describes the set of features that the app needs to provide any value over the current system of event registration and management.

- Event management
  - Option to see all available events and how many places are free on each of them
  - Possibility to see events that the user has signed up for
  - Overview for the office to plan events and check staus on registered tutors
- The tool should send confirmation emails whenever money was exchanged
- A balance of current available funds has to be visible _(ideally with a transaction history)_
- Some info page with helpful links and explanations
- Registration
  - Provide a way to register people from the administrative side
  - Allow users to create QR-codes that will speed up registration
- Platform support will be a terrible mix of **mobile only** for students and **desktop only** for administrative features, this will be resolved with a more responsive approach later on

### MVP 2

After internal testing of MVP 1 there will be an MVP 2 that describes the needed features for migrating to the new system and running events on it, the tasks will be defined while MVP 1 is used

### V 1

In V 1 the first non essential but highly useful features will be shipped

- Attendance keeping on events
- Option to diaply external events in the calendar
- Event related information sharing (such as links to shared photo albums and meeting points)
- Reminders and information emails
- Waitinglist option for very popular events

### V 1.1

V 1.1 will further expand the feutaureset of the app based on identified needs in V 1

## Tech things _(lifted from internal docs)_

### Platform: Web

I propose a web-app that can me used on PCs for registration, on the tutor phones and participant phones for info and attendance. Allowing for no-install use and easy updates, but currently has no support for iOS push notifications.

### Technologies

Further I propose an angular, angular/components and firebase stack that makes a server redundant, also angular is a very widely used and reliable. Additionally a state management library such as NGXS or NGRX might be needed when the app grows.
