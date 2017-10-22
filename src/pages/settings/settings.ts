import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
  	selector: 'page-settings',
  	templateUrl: 'settings.html',
})
export class SettingsPage {

	private isRepositor: Boolean;

  	constructor(
  		private auth: AuthProvider,
  		private alert: AlertProvider
  	) {
  	}

  	ionViewDidLoad() {

    	this.alert.showSpinner();
		this.auth.sendRequest('settings/get', {}).subscribe((data) => {

			this.isRepositor = data.repositorMode;
			this.alert.hideSpinner();

		}, (error) => {

			this.showAlert(error);
			this.alert.hideSpinner();

		});

  	}

  	public enableRepositor(): void {

  		this.alert.showSpinner();
		this.auth.sendRequest('settings/set', {'repositorMode': this.isRepositor}).subscribe((data) => {

			this.showAlert(data.message);
			this.alert.hideSpinner();

		}, (error) => {

			this.showAlert(error);
			this.alert.hideSpinner();

		});


  	}

  	private showAlert(message: string) {
		this.alert.showSimpleAlert('Configurações', message);
	}

	public trainSystem() {

		this.alert.showSpinner();
		this.auth.sendRequest('train/request', {}).subscribe((data) => {

			this.showAlert(data.message);
			this.alert.hideSpinner();

		}, (error) => {

			this.alert.showSimpleAlert('Falha no envio', error);
			this.alert.hideSpinner();
			
		});

	}

}
