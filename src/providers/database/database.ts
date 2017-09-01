import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DatabaseProvider {

	private db: SQLiteObject;
	constructor(private sqlite: SQLite) {
	}

	public initDatabase() {

		return new Promise((resolve, reject) => {

			let listTables = [
				'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT, sended INTEGER)',
				'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT, sended INTEGER)',
			];
			this.sqlite.create({name: 'data.db', location: 'default'}).then((db: SQLiteObject) => {


				this.db = db;
				this.executeListSql(listTables, 0).then(() => {
					resolve();
				}).catch(() => {
					reject();
				});

			}).catch((error) => {
				console.error('Unable to open database', error);
				reject();
			});

		});

	}

	private executeListSql(listTables, index) {

		return new Promise((resolve, reject) => {

			if (index == listTables.length) {
				resolve();
			} else {

				this.db.executeSql(listTables[index], {}).then((result) => {
					this.executeListSql(listTables, index+1).then(() => {
						resolve();
					}).catch(() => {
						reject();
					});

				}).catch((error) => {

					console.error('Unable to execute sql', error);
					reject();

				});

			}

		});

	}



	public insertListProducts(username, json, index) {

		return new Promise((resolve, reject) => {

			if (json.atividades) {
				
				let os = json.atividades.os
				let query = 'INSERT INTO products (data, sended) VALUES (?, ?, 0)';
				this.db.executeSql(query, [username, JSON.stringify(os[index])]).then((result) => {

					if (index == os.length-1) {
						resolve(result); 
					} else {

						this.insertListProducts(username, json, index+1).then(() => {
							resolve(result); 
						}).catch(() => {
							reject();
						});

					}

				}).catch((error) => {

					console.error('Unable to execute sql', error);
					reject();

				});

			} else {
				resolve();
			}

		});

	}

	public insertProduct(data) {

		return new Promise((resolve, reject) => {

			let query = 'INSERT INTO products (data, sended) VALUES (?, 0)';
			this.db.executeSql(query, [JSON.stringify(data)]).then((result) => {
				resolve(result);
			}).catch((error) => {

				console.error('Unable to execute sql', JSON.stringify(error));
				reject(error);

			});

		});

	}

	public updateProduct(id, data) {

		return new Promise ((resolve, reject) => {

			let query = 'UPDATE products SET data = ? WHERE id = ?';
			this.db.executeSql(query, [JSON.stringify(data), id]).then((result) => {
				resolve(result);
			}).catch((error) => {

				console.error('Unable to execute sql', error);
				reject();

			});

		});

	}

	public deleteProduct(id) {

		return new Promise ((resolve, reject) => {

			let query = 'DELETE FROM products WHERE id = ?';
			this.db.executeSql(query, [id]).then((result) => {
				resolve(result);
			}).catch((error) => {

				console.error('Unable to execute sql', error);
				reject();

			});

		});

	}

	public selectAllProducts() {

		return new Promise ((resolve, reject) => {

			let query = 'SELECT * FROM products';
			var products = [];
			this.db.executeSql(query, []).then((result) => {

				for (var i = 0; i < result.rows.length; i++) {

					console.log('teste1');

					products.push({
						'product': {
							'id': result.rows.item(i).id,
							'data': JSON.parse(result.rows.item(i).data)
						}
					});
					
				}
				resolve(products);

			}).catch((error) => {

				console.error('Unable to execute sql', error);
				reject();

			});

		});

	}


}

