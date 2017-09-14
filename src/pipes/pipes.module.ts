import { NgModule } from '@angular/core';
import { AdjustPricePipe } from './../pipes/adjust-price/adjust-price';
import { SlicePipe } from './../pipes/slice/slice';
import { DrawImagePipe } from './../pipes/draw-image/draw-image';
@NgModule({
	declarations: [AdjustPricePipe,
    SlicePipe,
    DrawImagePipe],
	imports: [],
	exports: [AdjustPricePipe,
    SlicePipe,
    DrawImagePipe]
})
export class PipesModule {}
