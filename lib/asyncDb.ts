/**
 * A DatabaseSchema is a description of a database. It contains the name of the
 * database and a list of migrations.
 *
 * A migration is a function that takes a database connection and changes the
 * database schema. The list of migrations for a given schema should only ever
 * be appended to. This ensures that the database can be upgraded smoothly.
 */
interface DatabaseSchema {
	name: string;
	migrations: Array<Migration>;
}
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

let dbConnectionPool = new Map();
/**
 * Returns a connection to the database. Reuses existing connection if available.
 */
export async function connect(
	databaseSchema: DatabaseSchema
): Promise<IDBDatabase> {
	if (dbConnectionPool.has(databaseSchema.name)) {
		return dbConnectionPool.get(databaseSchema.name);
	}

	let dbConnectionRequest = window.indexedDB.open(
		databaseSchema.name,
		databaseSchema.migrations.length
	);

	dbConnectionRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
		let dbConnection = dbConnectionRequest.result;

		for (let i = event.oldVersion; i < event.newVersion; i++) {
			databaseSchema.migrations[i](dbConnection);
		}
	};

	return new Promise((resolve, reject) => {
		dbConnectionRequest.onsuccess = () => {
			let database = dbConnectionRequest.result;
			dbConnectionPool.set(databaseSchema.name, database);

			database.onversionchange = () => {
				database.close();
				dbConnectionPool.delete(databaseSchema.name);
			};

			resolve(dbConnectionRequest.result);
		};

		dbConnectionRequest.onerror = () => {
			reject("Error opening database: " + dbConnectionRequest.error);
		};
	});
}

/**
 * Returns all the objects in the given object store as an array.
 */
async function getAll(
	databaseSchema: DatabaseSchema,
	objectStoreName: string
): Promise<any[]> {
	let database = await connect(databaseSchema);
	let transaction = database.transaction(objectStoreName, "readonly");

	let store = transaction.objectStore(objectStoreName);
	let request = store.getAll();

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
 * Adds an object to the given object store.
 */
async function add(
	databaseSchema: DatabaseSchema,
	objectStoreName: string,
	object: any
): Promise<IDBValidKey> {
	let database = await connect(databaseSchema);
	let transaction = database.transaction(objectStoreName, "readwrite");

	let store = transaction.objectStore(objectStoreName);
	let request = store.add(object);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onerror = () => {
			reject(request.error);
		};
	});
}

const database_tools = {
	connect,
	getAll,
	add,
};

export default database_tools;
