import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPhotosPage } from './product-photos';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProductPhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPhotosPage),
    PipesModule
  ],
})
export class ProductPhotosPageModule {}
