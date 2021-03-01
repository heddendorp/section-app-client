import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '@tumi/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberStatus, User } from '../../../../models';

@Component({
  selector: 'app-member-list-page',
  templateUrl: './member-list-page.component.html',
  styleUrls: ['./member-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListPageComponent implements OnInit {
  public members$: Observable<User[]>;
  public tutors$: Observable<User[]>;
  public memberCount$: Observable<{ full: number; trial: number }>;
  constructor(private users: UserService) {}

  ngOnInit(): void {
    this.members$ = this.users.getAllMembers$();
    this.tutors$ = this.users.getTutorNonMembers$();
    this.memberCount$ = this.members$.pipe(
      map((members) => ({
        full: members.filter((member) => member.status === MemberStatus.full)
          .length,
        trial: members.filter((member) => member.status === MemberStatus.trial)
          .length,
      }))
    );
  }
}
