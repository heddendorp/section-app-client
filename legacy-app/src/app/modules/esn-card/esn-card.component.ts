import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@tumi/models';
import { AuthService, CountryService } from '@tumi/services';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-esn-card',
  templateUrl: './esn-card.component.html',
  styleUrls: ['./esn-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsnCardComponent implements OnInit {
  public user$: Observable<User>;
  public country$: Observable<string>;
  constructor(private auth: AuthService, private country: CountryService) {}

  ngOnInit(): void {
    this.user$ = this.auth.user$;
    this.country$ = this.user$.pipe(
      switchMap((user) => this.country.getName(user.country))
    );
  }
}
