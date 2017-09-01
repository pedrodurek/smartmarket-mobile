import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  	selector: 'page-account-full-name',
  	templateUrl: 'account-full-name.html',
})
export class AccountFullNamePage {

  	private account: any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.account = navParams.get('account');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountFullName');
	}

}
