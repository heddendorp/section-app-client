import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  UserDetailsComponent,
  UserListPageComponent,
} from '@tumi/modules/users/container';

const routes: Routes = [
  { path: '', component: UserListPageComponent },
  { path: ':id', component: UserDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
