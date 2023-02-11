/**
 * Produces a Migration that creates an object store with the given name and options.
 */
const createObjectStore = (name, options = {}) => (database) => {
    database.createObjectStore(name, options);
};
/**
 * Produces a Migration that deletes an object store with the given name.
 */
const deleteObjectStore = (name) => (database) => {
    database.deleteObjectStore(name);
};
let dbConnectionPool = new Map();
/**
 * Returns a connection to the database. Reuses existing connection if available.
 */
async function connect(databaseSchema) {
    if (dbConnectionPool.has(databaseSchema.name)) {
        return dbConnectionPool.get(databaseSchema.name);
    }
    let dbConnectionRequest = window.indexedDB.open(databaseSchema.name, databaseSchema.migrations.length);
    dbConnectionRequest.onupgradeneeded = (event) => {
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
            database.onclose = () => {
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
 * Plumbing function. Returns an object store with the given name and mode.
 */
async function getStore(databaseSchema, objectStoreName, mode) {
    let database = await connect(databaseSchema);
    let transaction = database.transaction(objectStoreName, mode);
    return transaction.objectStore(objectStoreName);
}
/**
 * Plumbing function. Wraps a request in a promise.
 */
async function handleRequest(request) {
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
 * Returns all the objects in the given object store as an array.
 */
async function getAll(databaseSchema, objectStoreName) {
    let store = await getStore(databaseSchema, objectStoreName, "readonly");
    let request = store.getAll();
    return handleRequest(request);
}
/**
 * Adds an object to the given object store.
 */
async function add(databaseSchema, objectStoreName, object) {
    let store = await getStore(databaseSchema, objectStoreName, "readwrite");
    let request = store.add(object);
    return handleRequest(request);
}
