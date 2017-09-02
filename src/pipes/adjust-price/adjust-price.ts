import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'adjustPrice',
})
export class AdjustPricePipe implements PipeTransform {

	transform(value: any) {
		return parseFloat(value).toFixed(2);
	}

}
