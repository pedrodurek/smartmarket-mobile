import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountFullNamePage } from './account-full-name';

@NgModule({
  declarations: [
    AccountFullNamePage,
  ],
  imports: [
    IonicPageModule.forChild(AccountFullNamePage),
  ],
})
export class AccountFullNamePageModule {}
