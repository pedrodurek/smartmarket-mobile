import { Injectable } from '@angular/core';
import { URL, TIMEOUT_REQUEST } from '../../providers/global/global';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions, Response } from  '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AuthProvider {

	constructor(
		private http: Http,
		private utilsProvider: UtilsProvider,
		private storage: Storage
	) {
	}

	public syncProducts(json) {

		return new Promise((resolve, reject) => {

			this.sendRequest('product/sync', json).subscribe((data) => {
					
				this.syncProductsWithImage(data.productsWithImage).then((value) => {
					resolve(data.productsWithoutImage.concat(value));
				}).catch((error1) => {
					reject(error1);
				});

			}, (error3) => {
				reject(error3);
			});

		});

	}

	public syncProductsWithImage(json) {

		var promisses = [];
		json.forEach((value) => {

			promisses.push(new Promise((resolve, reject) => {

				this.sendRequest('product/get', value).subscribe((data) => {
					resolve(data);
				}, (error) => {
					reject(error);
				});

			}));

		});
		return Promise.all(promisses);

	}

	public sendRequest(sufix, json) {

		// Another way (starting with do):
		// .do(res: Response => { })...
		console.log(json);
		let headers = new Headers({ 
			'Content-Type': 'application/json', 
    	});
  		let options = new RequestOptions({ headers: headers });
		return this.http.post(URL+sufix, json, options)
			.timeout(TIMEOUT_REQUEST*1000)
			.do(this.logResponse)
			.map(this.extractData)
			.catch(this.handleError);	

	}

	public isLogged() {

		return new Promise((resolve, reject) => {

			this.storage.get('profile').then((result) => {
    			resolve(result);
  			});

		});

	}

	public login(profile) {
		this.storage.set('profile', profile);
	}

	public logout() {
		this.storage.remove('profile');
	}

	private logResponse(res: Response) {
		console.log(res);
	}

	private extractData(res: Response) {
		return res.json();
	}

	private handleError(res: Response | any) {
		console.log(res);
		return Observable.throw(res.json().message || 'Falha na conexão com o servidor, tente novamente!');
	}

}
