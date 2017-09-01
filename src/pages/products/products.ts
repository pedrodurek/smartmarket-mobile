import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, reorderArray } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

@IonicPage()
@Component({
  	selector: 'page-products',
  	templateUrl: 'products.html',
})
export class ProductsPage {

	private items: any;
	private emptyArray: any;
	private reorder: Boolean;

	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams, 
		private modalCtrl: ModalController,
		private actionSheetCtrl: ActionSheetController,
		private alert: AlertProvider,
		private auth: AuthProvider,
		private db: DatabaseProvider,
		private spinnerDialog: SpinnerDialog) {

		this.emptyArray = [];
		this.items = [];
		this.reorder = false;

	}

	ionViewDidLoad() {

		this.spinnerDialog.show();
		this.db.selectAllProducts().then((products: Array<Object>) => {

			products.forEach((data: any) => {
				this.items.push(data.product);
			});
			this.spinnerDialog.hide();
		});
		this.createBlankFields();
	}

	public addProduct(): void {

		let modal = this.modalCtrl.create('ModalProducts');
		modal.onDidDismiss(data => {
			this.insertProduct(data);
   		});
		modal.present();

	}

	private insertProduct(data): void {

		if (data) {
			// this.spinnerDialog.show();
			this.db.insertProduct(data).then((result: any) => {

				this.alert.showToast('Produto adicionado com sucesso!');
				// this.spinnerDialog.hide();
		     	this.items.push({'id': result.insertId, 'data': data});
		     	this.createBlankFields();

			});
		}

	}

	public editProduct(product, index): void {


		let modal = this.modalCtrl.create('ModalProducts', {'product': product});
		modal.onDidDismiss((data) => {
			this.updateProduct(data, index);
   		});
		modal.present();

	}

	private updateProduct(data, index): void {

		if (data) {

			// this.spinnerDialog.show();
			this.db.updateProduct(this.items[index].id, data).then(() => {

				this.alert.showToast('Produto alterado com sucesso!');
				this.items[index].data = data;
				// this.spinnerDialog.hide();

			}).catch(() => {

			});
		}

	}

	public removeProduct(index): void {

		this.alert.showAcceptAlert(
			'Remover produto',
			'Tem certeza que deseja remover este produto?',
			() => {

				this.spinnerDialog.show();
				this.auth.sendRequest('product/delete', {'id': this.items[index].data.id}).subscribe((data) => {

		        	this.db.deleteProduct(this.items[index].id).then(() => {

		        		this.alert.showToast('Produto removido com sucesso!');
			        	this.items.splice(index, 1);
			        	this.spinnerDialog.hide();

		        	}).catch(() => {

		        	});

				}, (error) => {

					this.showAlert(error);
					this.spinnerDialog.hide();

				});

			});

	}

	public reorderItems(indexes): void {
	    this.items = reorderArray(this.items, indexes);
	}

	public moreOptions(): void {

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Selecione uma opção:',
			buttons: [{
			 	text: 'Adicionar',
			 	role: 'add',
			 	handler: () => {
			   		this.addProduct();
			 	}
			}, {
				text: 'Reordenar',
				role: 'reorder',
			 	handler: () => {
			   		this.reorder = !this.reorder;
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

	public refreshItems(refresher): void {

		var products = [];
		var found = false;
		this.items.forEach((value) => {
			products.push({'id': value.data.id, 'dateLastUpdate': value.data.dateLastUpdate});
		});

		this.auth.syncProducts(products).then((data: any) => {

			data.forEach((value) => {

				for (var i = 0; i < this.items.length; i++) {

					if (value.id == this.items[i].data.id) {

						this.updateProduct(value, i);
						found = true;
						break;

					}

				}
				if (!found) {
					this.insertProduct(value);
				}
				found = false;

			});
			console.log(data);
			refresher.complete();

		}).catch((error) => {

			this.alert.showSimpleAlert('Sincronização', 'Falha de sincronização!');
			refresher.complete();

		});

	}

	private createBlankFields(): void {

		let numEmpty = Math.round(screen.height/51)-this.items.length;
		this.emptyArray = new Array((numEmpty > 0)?numEmpty:0);

	}

	private showAlert(message: string) {
		this.alert.showSimpleAlert('Remover produto', message);
	}


}
