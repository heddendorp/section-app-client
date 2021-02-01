import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '@tumi/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list-page',
  templateUrl: './member-list-page.component.html',
  styleUrls: ['./member-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListPageComponent implements OnInit {
  public members$: Observable<any>;
  constructor(private users: UserService) {}

  ngOnInit(): void {
    this.members$ = this.users.getAllMembers$();
  }
}
