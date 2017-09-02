import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
  	selector: 'page-change-password',
  	templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

	private account: any;
	private password: string;
	private repeatPassword: string;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams,
		private viewCtrl: ViewController,
		private alert: AlertProvider
	) {
		this.account = navParams.get('account');
	}

	ionViewDidLoad() {

	}

	public changePassword() {

		if (this.password.length < 8) {

			this.showAlert('A senha deve conter no mínimo 8 caracteres.');
			return;

		} else if (this.password != this.repeatPassword) {

			this.showAlert('As senhas não coincidem. Tente novamente.');
			return;

		}
		this.alert.showAcceptAlert(
			'Alterar Senha',
			'Tem certeza que deseja alterar sua senha?',
			() => {

				this.alert.showSpinner();
				this.showAlert('Senha alterada com sucesso!');
				this.alert.hideSpinner();
				this.navCtrl.pop();

			}
		)


	}

	private showAlert(message: string) {
		this.alert.showSimpleAlert('Alterar Senha', message);
	}

}
