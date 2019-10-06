# Features

Get an overview of features that are implemented and planned for the app

## Shipped ✔

### Users

- Authentication vie Facebook, Google, Microsoft and email
- Types: Regular, Tutor, Editor, Admin
- Data Collection: Name, Origin, Faculty, Type and Degree (optional Phone Number)
- View and Edit options for Admins

### Events

- External events with outbound Links
- Regular events
  - With online registration and office registration
  - With payment and payment at event
- Confirmation Mails for Event registrations
- Display all needed Infos to students and tutors
- Editable by the Admins and Editors
  - Includes Markdown parsing for the description
- _Run Events_ Page for Tutors to see al necessary info
  - Lists of singed up users and Tutors
  - Confirm attendance and payment for users
  - Collect money from the office and see who has the money
- Users can get QR codes for fast registration in the office
- Event refunds
- Waiting list for events that are already full
- Ticket Trackers: Events where only the number of sold Tickets is important
- List of saved events to sign up for multiple events efficiently

### Pages

- Special Advertisement Page for the Party Animals
- General information about TUMi
- Imprint and Data Privacy pages

### Communication

- Email confirmation for any regular event registration
- Email receipts for payments at events
- Daily slack update with events missing tutors

### Finances

- Balance tracking for money that should be in the office
- Downloadable receipts for any transaction

### Others

- Tutor list for easier internal communication

## In Development ⚠

### Events

- Internal Events just for Tutors
- Update wait list when the event-data changes _(Such as available spots)_
- Add a meeting point (google maps link)

### Data Privacy

- Still in review

### Others

- Office _God-mode_ to change almost anything without being bound to regular constraints

## Planned ⭕

### Users

- Trigger password reset
- Run Tutor applications and board feedback
- Track internal position: Newbie, Oldie, Board ...
- Allow teams to manage their own events
- Handle users that are only tutor for one specific event

### Events

- Provide calendar integration
- Collect additional Info at registration
- Implement event planning features
- Check for event overlaps
- Allow display of events hosted by other sections

### Communication

- Push notifications for reminders
- Reminder emails before events
- Automated sending of the detailed event info for all events

### Party Animals

- Add the party animals registration
- Allow party animals group assignment
- Display party animals events

### Pages

- Add esnCard info page

### Core

- Rewrite using state management
  - Will increase speed due to local caching
  - Will reduce server load because not everything is directly read on the firebase
  - Allows better state recovery when relaunching the application
- Update to firebase analytics and remote config
  - Arrived in the sdk v7 and once implemented in @angular/fire tracking should be updated for it
- Find a way of syncing events of the office and users during the registration
- **Write tests**

### Others

- Expand PWA functionality and handle offline devices
- Improve performance and keep up with library developments
- Offer more documentation and general info, possibly in a github wiki
- Allow using a phone to scan QR codes so no special hardware is required

## Possible ❓

- Bot interface for messenger or slack to access app information
- Additional stats pages or tools
- Account balance functionality for easier payments
- Party size to allow signing up groups
- Add a markdown editor for event editing
- Online payment gateway
- **Multi tenant** version
  - Possibly this could be extended into a more general app that works for multiple sections
  - Requires some research and trail runs for other sections
  - Can either run as one app with a flat fee or in a _per section_ deployment
  - Cost splitting has to be looked at for this
