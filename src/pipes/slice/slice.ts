import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'slice',
})
export class SlicePipe implements PipeTransform {

	transform(value: string, ...args) {

		if (value != null && args.length > 1) {

			let wordList = value.split(args[0]);
			return wordList[args[1]];
				
		}
		return '';
		
	}
}
