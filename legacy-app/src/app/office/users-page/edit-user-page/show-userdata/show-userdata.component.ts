import { Component, Input, OnInit } from '@angular/core';
import { Student, UserService } from '../../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDataChangeComponent } from '../../../../shared/components/user-data-change/user-data-change.component';

@Component({
  selector: 'app-show-userdata',
  templateUrl: './show-userdata.component.html',
  styleUrls: ['./show-userdata.component.scss']
})
export class ShowUserdataComponent implements OnInit {
  @Input() user: Student;

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {}

  async changeData() {
    const result = await this.dialog
      .open(UserDataChangeComponent, { data: { user: this.user }, disableClose: true })
      .afterClosed()
      .toPromise();
    if (result) {
      await this.userService.save(result);
    }
  }
}
