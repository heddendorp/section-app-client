import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberRights, MemberStatus, User } from '@tumi/models';
import { UserService } from '@tumi/services';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-member-details-page',
  templateUrl: './member-details-page.component.html',
  styleUrls: ['./member-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailsPageComponent implements OnInit {
  user$: Observable<User>;
  constructor(private users: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params) => this.users.getOne$(params.get('userId') as string))
    );
  }

  async updateRights(rights: MemberRights) {
    const user = await this.user$.pipe(first()).toPromise();
    await this.users.update(user.id, { rights });
  }

  async makeFullMember() {
    const user = await this.user$.pipe(first()).toPromise();
    await this.users.update(user.id, {
      joinedAsFullMember: new Date(),
      status: MemberStatus.full,
    });
  }
}
