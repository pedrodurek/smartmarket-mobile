import { NgModule } from '@angular/core';
import { AdjustPricePipe } from './../pipes/adjust-price/adjust-price';
import { SlicePipe } from './../pipes/slice/slice';
@NgModule({
	declarations: [AdjustPricePipe,
    SlicePipe],
	imports: [],
	exports: [AdjustPricePipe,
    SlicePipe]
})
export class PipesModule {}
