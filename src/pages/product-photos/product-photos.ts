import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@IonicPage()
@Component({
	selector: 'page-product-photos',
	templateUrl: 'product-photos.html',
})
export class ProductPhotosPage {

	private photos: any;
	private blankFields: any;
	private nPhotos: number;
	private productName: string;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams,
		private actionSheetCtrl: ActionSheetController,
		private alert: AlertProvider,
		private imagePicker: ImagePicker,
		private loadingCtrl: LoadingController,
		private auth: AuthProvider
	) {
		this.nPhotos = 0;
		this.blankFields = [];
		this.photos = [];
		this.productName = this.navParams.get('product').name;
	}

	ionViewDidLoad() {
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

		if (this.photos.length <= 0) {

			this.alert.showSimpleAlert('Treinar Fotos', 'É necessário selecionar pelo menos uma foto antes de enviar.');
			return;

		}
		this.alert.showAcceptAlert(
			'Treinar Fotos',
			'Deseja enviar e treinar as fotos selecionadas?',
			() => {
				let loading = this.loadingCtrl.create({
				    content: 'Tranferindo 0%'
				});
				loading.present();
				this.sendTrainingPhotos(0, 0, 0, loading).then(() => {

					this.auth.sendRequest('train/request', {}).subscribe(() => {

						loading.dismiss();
						this.navCtrl.pop();

					}, (error) => {

						loading.dismiss();
						this.alert.showSimpleAlert('Falha no envio', error);
						
					});

				}).catch((error) => {

					loading.dismiss();
					this.alert.showSimpleAlert('Falha no envio', error);

				});

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
			this.blankFields = [];
			for (var i = 0; i < results.length; i++) {

				array.push(results[i]);
				this.nPhotos++;
				if (!(array.length % 3)) {

					this.photos.push(array);
					array = new Array();

				}

			}
			if (array.length > 0) {

				while ((array.length+this.blankFields.length) < 3) {
					this.blankFields.push('');
				}
				this.photos.push(array);

			}

		}).catch((error) => {
			console.error(error);
		});

	}

	private removePhotos(): void {

		this.photos = [];
		this.nPhotos = 0;
		this.blankFields = [];

	}

	private sendTrainingPhotos(i, j, index, loading) {

		return new Promise((resolve, reject) => {

			if (i == this.photos.length) {
				resolve();
			} else {

				let json = {
					'photo': this.photos[i][j],
					'name': this.productName,
					'index': index
				};
				if (json.photo == null || json.photo.length <= 0) {
					resolve();
				} else {

					this.auth.sendRequest('train/store', json).subscribe(() => {

						if (++j == this.photos[i].length) {

							i++;
							j = 0;

						}
						let porcentage = Math.round(((index+1) / this.nPhotos) * 100);
						loading.setContent('Transferindo '+porcentage.toString()+'%');
						this.sendTrainingPhotos(i, j, index+1, loading).then(() => {
							resolve();
						}).catch((error) => {
							reject(error);
						})

					}, (error) => {
						reject(error);
					});

				}

			}

		});


	}

}
