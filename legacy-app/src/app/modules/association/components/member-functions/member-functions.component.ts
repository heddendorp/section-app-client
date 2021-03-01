import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@tumi/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-functions',
  templateUrl: './member-functions.component.html',
  styleUrls: ['./member-functions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberFunctionsComponent {
  @Input() members: User[];
  @Input() tutors: User[];
  constructor(private clipboard: Clipboard, private snack: MatSnackBar) {}

  copyMemberMails() {
    this.copyString(this.members.map((m) => m.email).join(';'));
  }

  copyTutorMails() {
    this.copyString(this.tutors.map((m) => m.email).join(';'));
  }

  private copyString(toCopy: string) {
    const pending = this.clipboard.beginCopy(toCopy);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
    this.snack.open('Emails copied!');
  }
}
