/* eslint-disable @typescript-eslint/no-explicit-any */

/* ======================== *\
    #Data Service
\* ======================== */

let db: IDBDatabase | null = null;
type Store = "exerciseHistory";

export async function get(storeName: Store, key: IDBValidKey): Promise<any> {
    const store = await getDBStore(storeName);
    const req = store.get(key);
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = () => {
            reject(`Error getting ${key}`);
        };
    });
}

export async function getAll(storeName: Store): Promise<any[]> {
    const store = await getDBStore(storeName);
    const req = store.getAll();
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = () => {
            reject(`Error getting All entries`);
        };
    });
}

export async function add(storeName: Store, data: any): Promise<IDBValidKey> {
    const store = await getDBStore(storeName, "readwrite");
    const req = store.add(data);
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = () => {
            reject("Error adding data:" + JSON.stringify(data));
        };
    });
}

export async function put(
    storeName: Store,
    key: IDBValidKey,
    data: any
): Promise<IDBValidKey> {
    const store = await getDBStore(storeName, "readwrite");
    const req = store.put(data, key);
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = () => {
            reject("Error updating data:" + JSON.stringify(data));
        };
    });
}

export async function remove(
    storeName: Store,
    key: IDBValidKey
): Promise<void> {
    const store = await getDBStore(storeName, "readwrite");
    const req = store.delete(key);
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve();
        };
        req.onerror = () => {
            reject("Error deleting data:");
        };
    });
}

export async function clear(storeName: Store): Promise<void> {
    const store = await getDBStore(storeName, "readwrite");
    const req = store.clear();
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve();
        };
        req.onerror = () => {
            reject(`Error getting All entries`);
        };
    });
}

/* ======================== *\
    #Helpers
\* ======================== */

function openDB(storeName: Store): Promise<IDBDatabase> {
    const DATABASE = "one-set";
    const requestOpenDB = indexedDB.open(DATABASE);

    return new Promise(function (resolve, reject) {
        requestOpenDB.onsuccess = function () {
            resolve(requestOpenDB.result);
        };

        requestOpenDB.onerror = function () {
            reject("Error loading Database");
        };

        requestOpenDB.onupgradeneeded = function () {
            const db = requestOpenDB.result;
            db.createObjectStore(storeName, { autoIncrement: true });
        };
    });
}

async function getDBStore(
    storeName: Store,
    mode: IDBTransactionMode = "readonly"
) {
    if (!db) {
        db = await openDB(storeName);
    }
    return db.transaction(storeName, mode).objectStore(storeName);
}
