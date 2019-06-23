import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseUser, UserService } from '../../../shared/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-request-page',
  templateUrl: './edit-request-page.component.html',
  styleUrls: ['./edit-request-page.component.scss']
})
export class EditRequestPageComponent implements OnInit, OnDestroy {
  request$: Observable<any>;
  title$: Observable<string>;
  destroyed$ = new Subject();
  users: BaseUser[];
  dataSource: MatTableDataSource<BaseUser>;
  filterInput = new FormControl();
  columns = ['firstName', 'lastName', 'email', 'country', 'faculty'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.users = await this.userService.users.pipe(first()).toPromise();
    this.dataSource = new MatTableDataSource<BaseUser>(this.users);
    this.filterInput.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(filterValue => (this.dataSource.filter = filterValue));
    this.dataSource.paginator = this.paginator;
    this.request$ = this.route.paramMap.pipe(
      switchMap(params => this.authService.getRequest(params.get('requestId'))),
      tap(request => this.filterInput.reset(request.email))
    );
    this.title$ = this.request$.pipe(map(request => `${request.firstName} ${request.lastName} (${request.email})`));
  }

  async approveRequest(user) {
    const request = await this.request$.pipe(first()).toPromise();
    await this.authService.approveRequest(request, user);
    await this.router.navigate(['office', 'requests']);
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
