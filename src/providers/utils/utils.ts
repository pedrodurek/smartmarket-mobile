import { Injectable } from '@angular/core';

@Injectable()
export class UtilsProvider {

	constructor() {
		console.log('Hello UtilsProvider Provider');
	}

	public isEmpty(str): boolean {
        return (!str || str.length === 0);
    }

}
