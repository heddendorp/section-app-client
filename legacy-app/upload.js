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
const git = require('git-last-commit');
const execSync = require('child_process').execSync;
const version = require('./package.json').version;

git.getLastCommit(function(err, { subject }) {
  if (process.argv[process.argv.length - 1] === 'hosting') {
    execSync('firebase deploy -m "' + subject + ' (' + version + ')" --only hosting', { stdio: [0, 1, 2] });
  } else {
    execSync('firebase deploy -m "' + subject + ' (' + version + ')"', { stdio: [0, 1, 2] });
  }
});
