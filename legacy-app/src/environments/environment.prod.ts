/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2020  Lukas Heddendorp
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
  staging: false,
  firebase: {
    apiKey: 'AIzaSyDiDVg6ggmSY-Z8Iu5dWO83Mg4GTmt8Zl0',
    authDomain: 'esn-tumi.firebaseapp.com',
    databaseURL: 'https://esn-tumi.firebaseio.com',
    projectId: 'esn-tumi',
    storageBucket: 'esn-tumi.appspot.com',
    messagingSenderId: '756904945827',
    appId: '1:756904945827:web:c4b8570bf907f627',
    measurementId: 'G-HN3R0ZJRDD'
  },
  functionsOrigin: 'https://esn-tumi.de'
};
