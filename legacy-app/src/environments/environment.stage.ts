/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export const environment = {
  production: true,
  staging: true,
  firebase: {
    apiKey: 'AIzaSyDe9EBfXdOx0dR8HLT1bLrDN5y2boIMoMQ',
    authDomain: 'tumi-events.firebaseapp.com',
    databaseURL: 'https://tumi-events.firebaseio.com',
    projectId: 'tumi-events',
    storageBucket: 'tumi-events.appspot.com',
    messagingSenderId: '1005990962176',
    appId: '1:1005990962176:web:d2c5279d59c23f49b064e5'
  },
  functionsOrigin: 'https://tumi-events.web.app'
};
