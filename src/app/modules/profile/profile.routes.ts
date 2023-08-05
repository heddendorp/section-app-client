import { Routes } from '@angular/router';
import { ProfilePageComponent } from '@tumi/legacy-app/modules/profile/pages/profile-page/profile-page.component';
import { PhotoJourneyPageComponent } from '@tumi/legacy-app/modules/profile/pages/photo-journey-page/photo-journey-page.component';
import { NewUserPageComponent } from '@tumi/legacy-app/modules/profile/pages/new-user-page/new-user-page.component';
import { PublicProfilePageComponent } from '@tumi/legacy-app/modules/profile/pages/public-profile-page/public-profile-page.component';
import { CheckProfileIdGuard } from '@tumi/legacy-app/modules/profile/guards/check-profile-id.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProfilePageComponent,
    title: 'Profile',
  },
  { path: 'journey', component: PhotoJourneyPageComponent },
  { path: 'new', component: NewUserPageComponent, title: 'Welcome' },
  {
    path: ':userId',
    component: PublicProfilePageComponent,
    canActivate: [CheckProfileIdGuard],
  },
];
