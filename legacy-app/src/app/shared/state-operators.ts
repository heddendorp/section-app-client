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

import * as moment from 'moment';

export function addOrReplace<T>(sortBy: string = null) {
  const idKey = 'id';
  return (state: any, entities: T[]) => {
    const nextEntities = { ...state.entities };
    const nextIds = [...state.ids];
    let nextState = state;
    entities.forEach(entity => {
      const id = entity[idKey];
      nextEntities[id] = entity;
      if (!nextIds.includes(id)) {
        nextIds.push(id);
      }
      nextState = {
        ...nextState,
        entities: nextEntities,
        ids: nextIds
      };
    });

    if (sortBy && entities.length && entities[0][sortBy]) {
      if (moment(entities[0][sortBy]).isValid()) {
        const sortedIds = nextState.ids
          .map(id => nextState.entities[id])
          .sort((a, b) => a[sortBy].diff(b[sortBy]))
          .map(e => e.id);
        nextState = {
          ...nextState,
          ids: sortedIds
        };
      }

      if (typeof entities[0][sortBy] === 'string') {
        const sortedIds = nextState.ids
          .map(id => nextState.entities[id])
          .sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
              return -1;
            }
            if (a[sortBy] > b[sortBy]) {
              return 1;
            }
            return 0;
          })
          .map(e => e.id);
        nextState = {
          ...nextState,
          ids: sortedIds
        };
      }
    }

    return {
      ...nextState
    };
  };
}
