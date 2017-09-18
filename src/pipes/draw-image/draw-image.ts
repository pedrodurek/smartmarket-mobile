import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'drawImage',
})
export class DrawImagePipe implements PipeTransform {

  	transform(value: string) {
    	return 'data:image/jpeg;base64,'+value;
  	}
}
