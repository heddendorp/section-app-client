import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-requests-page',
  templateUrl: './requests-page.component.html',
  styleUrls: ['./requests-page.component.scss']
})
export class RequestsPageComponent implements OnInit {
  requests$: Observable<any[]>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.requests$ = this.authService.openRequests;
  }
}
