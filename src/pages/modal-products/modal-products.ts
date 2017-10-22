import { Component } from '@angular/core';	
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  	selector: 'page-modal-products',
  	templateUrl: 'modal-products.html',
})
export class ModalProductsPage {

	private product: any;
	private editProduct: Boolean;
	private disabledButtons: Boolean;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams, 
		private viewCtrl: ViewController,
		private camera: Camera,
		private spinnerDialog: SpinnerDialog,
		private actionSheetCtrl: ActionSheetController,
		private alert: AlertProvider,
		private auth: AuthProvider
	) {

		this.disabledButtons = false;
		this.product = {};

	}

	ionViewDidLoad() {

		if (this.navParams.get('product')) {

			this.product = JSON.parse(JSON.stringify(this.navParams.get('product')));
			this.editProduct = true;

		} else {
			this.editProduct = false;
		}

	}

	public save(): void {

		this.alert.showAcceptAlert(
			'Salvar produto',
			'Tem certeza que deseja salvar as informações do produto?',
			() => {

				this.spinnerDialog.show();
				let url = this.editProduct?'product/edit':'product/add';
				this.auth.sendRequest(url, this.product).subscribe((data) => {

					this.product.id = data.id;
					this.product.dateLastUpdate = data.dateLastUpdate;
					console.log(this.product);
		        	this.viewCtrl.dismiss(this.product);

				}, (error) => {

					this.showAlert(error);
					this.spinnerDialog.hide();

				});

			});

	}

	public cancel(): void {
		this.viewCtrl.dismiss();
	}

	public enableButtons(): void {

		setTimeout(() => {
			this.disabledButtons = false;
		}, 500);

	}

	public loadPhoto(): void {

		if (this.disabledButtons) {
			return;
		}

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
			   		  	allowEdit: false,
			   		  	targetWidth: 300,
			   		  	targetHeight: 300,
			   		  	saveToPhotoAlbum: false,
			   		  	correctOrientation: false
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

	public takePicture(opt): void {

		this.spinnerDialog.show();
		this.camera.getPicture(opt).then((imageData) => {

			this.spinnerDialog.hide();
		 	this.product.image = 'data:image/jpeg;base64,' + imageData;

		}).catch((err) => {
			this.spinnerDialog.hide();
		});

	}

	public trainPhotos(): void {
		this.navCtrl.push('ProductPhotosPage', {'product': this.product});
	}

	private showAlert(message: string) {
		this.alert.showSimpleAlert('Cadastro produto', message);
	}

}
