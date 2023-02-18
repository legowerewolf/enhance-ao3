/**
 * A DatabaseSchema is a description of a database. It contains the name of the
 * database and a list of migrations.
 *
 */
interface DatabaseSchema {
	name: string;
	migrations: Array<Migration>;
}

/**
 * A migration is a function that takes a database connection and changes the
 * database schema. The list of migrations for a given schema should only ever
 * be appended to. This ensures that the database can be upgraded smoothly.
 */
type Migration = (database: IDBDatabase) => void;

/**
 * Produces a Migration that creates an object store with the given name and options.
 */
const createObjectStore =
	(name: string, options: IDBObjectStoreParameters = {}): Migration =>
	(database: IDBDatabase) => {
		database.createObjectStore(name, options);
	};

/**
 * Produces a Migration that deletes an object store with the given name.
 */
const deleteObjectStore =
	(name: string): Migration =>
	(database: IDBDatabase) => {
		database.deleteObjectStore(name);
	};

class AsyncDB {
	private static connectionPool = new Map();

	constructor(private databaseSchema: DatabaseSchema) {}

	/**
	 * Returns a connection to the database. Reuses existing connection if available.
	 */
	private async connect(): Promise<IDBDatabase> {
		if (AsyncDB.connectionPool.has(this.databaseSchema.name)) {
			return AsyncDB.connectionPool.get(this.databaseSchema.name);
		}

		let dbConnectionRequest = window.indexedDB.open(
			this.databaseSchema.name,
			this.databaseSchema.migrations.length
		);

		dbConnectionRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			let dbConnection = dbConnectionRequest.result;

			for (let i = event.oldVersion; i < event.newVersion; i++) {
				this.databaseSchema.migrations[i](dbConnection);
			}
		};

		return new Promise((resolve, reject) => {
			dbConnectionRequest.onsuccess = () => {
				let database = dbConnectionRequest.result;
				AsyncDB.connectionPool.set(this.databaseSchema.name, database);

				database.onversionchange = () => {
					database.close();
					AsyncDB.connectionPool.delete(this.databaseSchema.name);
				};

				database.onclose = () => {
					AsyncDB.connectionPool.delete(this.databaseSchema.name);
				};

				resolve(dbConnectionRequest.result);
			};

			dbConnectionRequest.onerror = () => {
				reject("Error opening database: " + dbConnectionRequest.error);
			};
		});
	}

	/**
	 * Plumbing function. Returns an object store with the given name and mode.
	 */
	private async getStore(
		objectStoreName: string,
		mode: IDBTransactionMode
	): Promise<IDBObjectStore> {
		let database = await this.connect();
		let transaction = database.transaction(objectStoreName, mode);
		return transaction.objectStore(objectStoreName);
	}

	/**
	 * Plumbing function. Wraps a request in a promise.
	 */
	private async handleRequest(request: IDBRequest): Promise<any> {
		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = () => {
				reject(request.error);
			};
		});
	}

	/**
	 * Returns the object with the given key from the given object store, or undefined if no such object exists.
	 */
	async get(objectStoreName: string, key: IDBValidKey): Promise<any> {
		let store = await this.getStore(objectStoreName, "readonly");

		let request = store.get(key);

		return this.handleRequest(request);
	}

	/**
	 * Returns an array of all objects in the given object store.
	 */
	async getAll(objectStoreName: string): Promise<any[]> {
		let store = await this.getStore(objectStoreName, "readonly");

		let request = store.getAll();

		return this.handleRequest(request);
	}

	/**
	 * Adds an object to the given object store. Returns the key of the new object.
	 */
	async add(objectStoreName: string, object: any): Promise<IDBValidKey> {
		let store = await this.getStore(objectStoreName, "readwrite");

		let request = store.add(object);

		return this.handleRequest(request);
	}

	/**
	 * Deletes the object with the given key from the given object store.
	 */
	async delete(objectStoreName: string, key: IDBValidKey): Promise<void> {
		let store = await this.getStore(objectStoreName, "readwrite");

		let request = store.delete(key);

		return this.handleRequest(request);
	}

	/**
	 * Deletes the database, including all object stores and data.
	 */
	async reset(): Promise<void> {
		let database = await this.connect();
		database.close();
		AsyncDB.connectionPool.delete(this.databaseSchema.name);

		let deleteRequest = window.indexedDB.deleteDatabase(
			this.databaseSchema.name
		);

		return this.handleRequest(deleteRequest);
	}
}
