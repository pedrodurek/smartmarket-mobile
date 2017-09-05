import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@IonicPage()
@Component({
	selector: 'page-product-photos',
	templateUrl: 'product-photos.html',
})
export class ProductPhotosPage {

	private photos: any;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams,
		private actionSheetCtrl: ActionSheetController,
		private alert: AlertProvider,
		private imagePicker: ImagePicker
	) {
		this.photos = [];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProductPhotosPage');
	}

	public more(): void {

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Selecione a opção desejada',
			buttons: [{
				text: 'Enviar Fotos',
				role: 'enviar',
				handler: () => {
					this.sendPhotos();
				}
			}, {
				text: 'Adicionar Fotos',
				role: 'adicionar',
				handler: () => {
					this.addPhotos();
				}
			}, {
				text: 'Remover Fotos',
				role: 'remover',
				handler: () => {
					this.removePhotos();
				}
			}, {
				text: 'Cancelar',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
				}
			}]
		});
		actionSheet.present();

	}

	private sendPhotos(): void {

		this.alert.showAcceptAlert(
			'Treinar Fotos',
			'Deseja enviar e treinar as fotos selecionadas?',
			() => {

			}
		);

	}

	private addPhotos(): void {

		let options: ImagePickerOptions = {
			quality: 75,
			height: 300,
			width: 300,
			outputType: 1
		};
		this.imagePicker.getPictures(options).then((results) => {

			var array = new Array();
			for (var i = 0; i < results.length; i++) {

				array.push('data:image/jpeg;base64,'+results[i]);
				if (!(array.length % 3)) {

					this.photos.push(array);
					array = new Array();

				}

			}
			if (array.length > 0) {

				while (array.length < 3) {
					array.push('');
				}
				this.photos.push(array);

			}

		}).catch((error) => {
			console.error(error);
		});

	}

	private removePhotos(): void {
		this.photos = [];
	}

}
