import { Route } from '@angular/router';

export const SETTINGS_ROUTES: (Route & {
  children: (Route & { data: { title: string; icon: string } })[];
})[] = [
  {
    path: '',
    loadComponent: () =>
      import('./settings-tabs/settings-tabs.component').then(
        (m) => m.SettingsTabsComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'section',
        pathMatch: 'full',
        data: {
          title: 'Section',
          icon: 'icon-data-configuration',
        },
      },
      {
        path: 'section',
        loadComponent: () =>
          import(
            './tabs/section-settings-tab/section-settings-tab.component'
          ).then((m) => m.SectionSettingsTabComponent),
        data: {
          title: 'Section',
          icon: 'icon-data-configuration',
        },
      },
      {
        path: 'registration',
        loadComponent: () =>
          import(
            './tabs/de-registration-settings-tab/de-registration-settings-tab.component'
          ).then((m) => m.DeRegistrationSettingsTabComponent),
        data: {
          title: 'Registration',
          icon: 'icon-task',
        },
      },
      {
        path: 'user-data',
        loadComponent: () =>
          import(
            './tabs/registration-data-settings-tab/registration-data-settings-tab.component'
          ).then((m) => m.RegistrationDataSettingsTabComponent),
        data: {
          title: 'User data collection',
          icon: 'icon-edit-user-male',
        },
      },
      {
        path: 'site-content',
        loadComponent: () =>
          import(
            './tabs/site-content-settings-tab/site-content-settings-tab.component'
          ).then((m) => m.SiteContentSettingsTabComponent),
        data: {
          title: 'Site content',
          icon: 'icon-signing-a-document',
        },
      },
    ],
  },
];
