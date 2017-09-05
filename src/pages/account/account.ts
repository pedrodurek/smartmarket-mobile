import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
  	selector: 'page-account',
  	templateUrl: 'account.html',
})
export class AccountPage {

	private account: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private camera: Camera,
		private actionSheetCtrl: ActionSheetController,
		private alert: AlertProvider,
		private events: Events,
		private auth: AuthProvider
	) {
		this.account = {};
	}

	ionViewDidLoad() {

		if (this.navParams.get('profile')) {
			this.account = JSON.parse(JSON.stringify(this.navParams.get('profile')));
		}
		
	}

	public changeProfilePhoto(): void {

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Selecione uma opção:',
			buttons: [{
			 	text: 'Foto',
			 	role: 'photo',
			 	handler: () => {

			   		let options: CameraOptions = {
			   		  	quality: 75,
			   		  	destinationType: this.camera.DestinationType.DATA_URL,
			   		  	sourceType: this.camera.PictureSourceType.CAMERA,
			   		  	allowEdit: false,
			   		  	targetWidth: 300,
			   		  	targetHeight: 300,
			   		  	saveToPhotoAlbum: false,
			   		  	correctOrientation: false
			   		};
			   		this.takePicture(options);

			 	}
			}, {
				text: 'Álbum',
				role: 'album',
			 	handler: () => {

			   		let options: CameraOptions = {
			   			quality: 75,
			   		  	destinationType: this.camera.DestinationType.DATA_URL,
			   		  	sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			   		  	targetWidth: 300,
			   		  	targetHeight: 300,
			   		};
			   		this.takePicture(options);

			 	}
			},{
			 	text: 'Cancelar',
			 	role: 'cancel',
			 	handler: () => {
			   		console.log('Cancel clicked');
			 	}
			}]
		});
		actionSheet.present();

	}

	public changeFullName(): void {
		this.navCtrl.push('AccountFullNamePage', {'account': this.account});
	}

	public changePassword(): void {
		this.navCtrl.push('ChangePasswordPage', {'account': this.account});
	}

	public takePicture(opt): void {

		this.alert.showSpinner();
		this.camera.getPicture(opt).then((imageData) => {

			this.alert.hideSpinner();
		 	this.account.profilePicture = 'data:image/jpeg;base64,' + imageData;

		}).catch((err) => {
			this.alert.hideSpinner();
		});

	}

	public save(): void {

		this.alert.showAcceptAlert(
			'Salvar Perfil', 
			'Tem certeza que deseja salvar as alterações?',
			() => {

				this.auth.sendRequest('user/edit', this.account).subscribe((data) => {

	        		this.events.publish('account:profile', this.account);
	        		this.navCtrl.setRoot('ProductsPage');
	        		this.alert.showToast('Dados cadastrais alterados com sucesso!');
	        		this.alert.hideSpinner();

	        	}, (error) => {

	        		this.alert.showSimpleAlert('Salvar Perfil', error);
	        		this.alert.hideSpinner();

	        	});

			});

	}

}
