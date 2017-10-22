import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@IonicPage()
@Component({
  	selector: 'page-signin',
  	templateUrl: 'signin.html',
})
export class SigninPage {

	private signin: any;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams,
		private auth: AuthProvider,
		private alert: AlertProvider,
		private spinnerDialog: SpinnerDialog,
		private events: Events,
		private storage: Storage,
		private push: Push
	) {
		this.signin = {};
	}

	ionViewDidLoad() {
		this.initPushNotification();
	}

	public signUp(): void {
		this.navCtrl.push('SignupPage');
	}

	public signIn(): void {

		this.spinnerDialog.show();
		this.auth.sendRequest('login', this.signin).subscribe((data) => {

			this.events.publish('account:profile', data.user);
			this.auth.login(data.user);
			this.navCtrl.setRoot('ProductsPage');
			this.spinnerDialog.hide();

		}, (error) => {

			this.alert.showSimpleAlert('Login', error);
			this.spinnerDialog.hide();

		});
	}

	public initPushNotification(): void {

		const options: PushOptions = {
		   android: {
		       senderID: '12345679'
		   },
		   ios: {
		       alert: 'true',
		       badge: true,
		       sound: 'true'
		   }
		};
		const pushObject: PushObject = this.push.init(options);
		pushObject.on('registration').subscribe((registration: any) => {
			this.signin.deviceToken = registration.registrationId;
		});

	}

}
