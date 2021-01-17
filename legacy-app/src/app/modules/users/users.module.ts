import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  UserDetailsComponent,
  UserListPageComponent,
} from '@tumi/modules/users/container';
import { SharedModule } from '../shared';
import { UserTableComponent } from './components/user-table/user-table.component';

import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserListPageComponent,
    UserTableComponent,
    UserDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, UsersRoutingModule],
})
export class UsersModule {}
