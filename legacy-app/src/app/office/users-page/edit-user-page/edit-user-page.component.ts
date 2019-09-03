import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student, UserService } from '../../../shared/services/user.service';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-page',
  templateUrl: './edit-user-page.component.html',
  styleUrls: ['./edit-user-page.component.scss']
})
export class EditUserPageComponent implements OnInit {
  $user: Observable<Student>;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.$user = this.route.paramMap.pipe(
      switchMap(params =>
        this.userService.getFullDetails(params.get('userId')).pipe(startWith(this.route.snapshot.data[0]))
      )
    );
  }
}
