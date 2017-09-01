import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class AlertProvider {

	constructor(
		private alertCtrl: AlertController,
		private toast: Toast
	) {
	}

	public showSimpleAlert(title: string, message: string) {

		let alert = this.alertCtrl.create({	
			title: title,
			subTitle: message,
			buttons: ['OK']
		});
		alert.present();

	}

	public showAcceptAlert(title: string, message: string, event) {

		return new Promise((resolve, reject) => {

			let alert = this.alertCtrl.create({
				title: title,
	    		message: message,
	    		buttons: [{
	    			text: 'Não',
			        role: 'nao',
			        handler: () => {
			          	console.log('Cancel clicked');
			        }
	    		}, {
	    			text: 'Sim',
			        handler: event
	    		}]
			});
			alert.present();

		});

	}

	public showToast(message: string) {

		this.toast.showShortBottom(message).subscribe((toast) => {
			console.log(toast);
		});

	}

}
