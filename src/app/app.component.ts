import { Component } from '@angular/core';
import { Platform, AlertController, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { DatabaseProvider } from '../providers/database/database';
import { AuthProvider } from '../providers/auth/auth';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
	
    rootPage: any;
	private profile: any;

	constructor(
		private platform: Platform, 
		private statusBar: StatusBar, 
		private splashScreen: SplashScreen,
		private keyboard: Keyboard,
		private alertCtrl: AlertController,
		private app: App,
		private events: Events,
		private db: DatabaseProvider,
		private auth: AuthProvider
	) {

		this.profile = {};

		platform.ready().then(() => {

			statusBar.styleLightContent();
			splashScreen.hide();
			keyboard.hideKeyboardAccessoryBar(false);
			db.initDatabase().then(() => {

				console.log('DB Initialized');
				auth.isLogged().then((profile) => {

					if (profile != null) {

						this.profile = profile;
						this.rootPage = 'ProductsPage';

					} else {
						this.rootPage = 'SigninPage';
					}

				});
			});

		});

		events.subscribe('account:profile', (profile) => {
			this.profile = profile;
		});

	}

	public settings(): void {
		this.app.getRootNavs()[0].setRoot('SettingsPage');
	}

	public logout(): void {

		let confirm = this.alertCtrl.create({
		    title: 'Sair',
		    message: 'Tem certeza que deseja sair?',
		    buttons: [
		        {
		            text: 'Não',
		            handler: () => {
		                console.log('Disagree clicked');
		            }
		        },{
		            text: 'Sim',
		            handler: () => {

		            	// this.auth.logout();
		                this.app.getRootNavs()[0].setRoot('SigninPage');

		            }
		        }
		    ]
		});
		confirm.present();

	}

	public productsPage(): void {
		this.app.getRootNavs()[0].setRoot('ProductsPage');
	}

	public accountPage(): void {
		this.app.getRootNavs()[0].setRoot('AccountPage', {'profile': this.profile});
	}
}

