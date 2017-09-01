import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalProductsPage } from './modal-products';

@NgModule({
  declarations: [
    ModalProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalProductsPage),
  ],
})
export class ModalProductsPageModule {}
