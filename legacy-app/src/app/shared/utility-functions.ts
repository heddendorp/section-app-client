import { TumiEvent } from './services/event.service';

export const getFreeSpots = (event: TumiEvent) => {
  const participants = event.usersSignedUp;
  const quota = participants / event.participantSpots;
  if (quota < 0.5) {
    return 'Many free spots';
  } else if (quota < 0.8) {
    return 'Some spots left';
  } else if (quota < 1) {
    return 'Few spots left';
  } else {
    return 'Event is full';
  }
};
