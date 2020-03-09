import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { LoginWithFacebook, LoginWithGoogle, LoginWithOauth } from '../../../shared/state/auth.actions';
import { MailSigninComponent } from '../../../components/mail-signin/mail-signin.component';
import { environment } from '../../../../environments/environment';
import { AuthState } from '../../../shared/state/auth.state';
import { Observable, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { allFaculties, allTypes } from '../../../shared/uni-data';
import { Student, UserService } from '../../../shared/services/user.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-pa-registration-page',
  templateUrl: './pa-registration-page.component.html',
  styleUrls: ['./pa-registration-page.component.scss']
})
export class PaRegistrationPageComponent implements OnInit, OnDestroy {
  personalData: FormGroup;
  partyData: FormGroup;
  acceptData: FormGroup;
  faculties = allFaculties;
  studentTypes = allTypes;
  consentControl = new FormControl(!!JSON.parse(localStorage.getItem('pa-consent')));
  isStaging = environment.staging;
  @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;
  @Select(AuthState.user) user$: Observable<Student>;
  destroyed$ = new Subject();
  countries;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private store: Store,
    private http: HttpClient,
    public userService: UserService,
    public analytics: AngularFireAnalytics
  ) {
  }

  ngOnInit() {
    this.analytics.logEvent('pa_registration_visit');
    this.countries = this.http.get('https://restcountries.eu/rest/v2/all', { params: { fields: 'name;alpha2Code' } });
    this.personalData = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      callBy: [''],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.pattern('[+][ 0-9]+')],
      country: ['', Validators.required],
      university: ['', Validators.required],
      faculty: ['', Validators.required],
      type: ['', Validators.required],
      esnMember: [false, Validators.required],
      esnSection: ['', Validators.required]
    });
    this.partyData = this.fb.group({
      referred: [false, Validators.required],
      referrer: ['', Validators.required],
      expectations: ['', Validators.required],
      requests: [''],
      size: ['', Validators.required],
      oldie: [false, Validators.required]
    });
    this.acceptData = this.fb.group({
      pay: [false, Validators.requiredTrue],
      friends: [false, Validators.requiredTrue]
    });
    this.personalData.get('esnSection').disable();
    this.partyData.get('referrer').disable();
    this.user$
      .pipe(
        takeUntil(this.destroyed$),
        filter(user => !!user)
      )
      .subscribe(user => {
        console.log(user);
        this.personalData.patchValue(user);
        if (user.partyData) {
          this.partyData.patchValue(user.partyData);
        }
      });
    this.consentControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(consent => localStorage.setItem('pa-consent', JSON.stringify(consent)));
    this.personalData
      .get('esnMember')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(active => {
        if (active) {
          this.personalData.get('esnSection').enable();
        } else {
          this.personalData.get('esnSection').disable();
        }
      });

    this.partyData
      .get('referred')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(active => {
        if (active) {
          this.partyData.get('referrer').enable();
        } else {
          this.partyData.get('referrer').disable();
        }
      });
  }

  async saveUserdata() {
    await this.analytics.logEvent('pa_registration_start');
    const user = await this.user$.pipe(first()).toPromise();
    if (this.personalData.valid && user) {
      const value = this.personalData.value;
      const newUser = { ...user, ...value, paStatus: 'started' };
      // console.log(newUser);
      await this.userService.save(newUser);
    }
  }

  async savePartyData() {
    const user = await this.user$.pipe(first()).toPromise();
    if (this.partyData.valid && user) {
      const partyData = this.partyData.value;
      const newUser = { ...user, partyData };
      // console.log(newUser);
      await this.userService.save(newUser);
    }
  }

  async sendApplication() {
    const user = await this.user$.pipe(first()).toPromise();
    await this.analytics.logEvent('pa_registration_complete', { gender: user.gender, country: user.country });
    if (this.acceptData.valid && user) {
      const value = { paStatus: 'applied', paApplicationTime: new Date() };
      const newUser = { ...user, ...value };
      // console.log(newUser);
      await this.userService.save(newUser);
    }
  }

  googleLogin() {
    this.store.dispatch(new LoginWithGoogle());
  }

  facebookLogin() {
    this.store.dispatch(new LoginWithFacebook());
  }

  oauthLogin(provider: string) {
    this.store.dispatch(new LoginWithOauth(provider));
  }

  passwordLogin() {
    this.dialog.open(MailSigninComponent);
  }

  ngOnDestroy(): void {
    this.destroyed$.complete();
  }
}
