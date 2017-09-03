import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

@IonicPage()
@Component({
  	selector: 'page-signup',
  	templateUrl: 'signup.html',
})
export class SignupPage {

	private signup: any;
	private repetpassword: string;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams,
		private alert: AlertProvider,
		private auth: AuthProvider,
		public spinnerDialog: SpinnerDialog
	) {
		this.signup = {};
	}

	ionViewDidLoad() {
	}

	public submitSignup(): void {

		if (this.signup.password.length < 8) {

			this.showAlert('A senha deve conter no mínimo 8 caracteres.');
			return;

		}
		console.log(this.signup.password+' '+this.repetpassword);
		if (this.signup.password != this.repetpassword) {

			this.showAlert('As senhas não coincidem. Tente novamente.');
			return;

		}
		this.spinnerDialog.show();
		this.auth.sendRequest('user/register', this.signup).subscribe((data) => {

			this.showAlert(data.message);
			this.spinnerDialog.hide();

		}, (error) => {

			this.showAlert(error);
			this.spinnerDialog.hide();

		});

	}

	private showAlert(message: string) {
		this.alert.showSimpleAlert('Cadastro', message);
	}

}
