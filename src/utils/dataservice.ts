import { Exercise } from "./types";

/* ======================== *\
    #Data Service
\* ======================== */

const DATABASE = "one-set";
const DATA_STORE = "exerciseHistory";

let db: IDBDatabase | null = null;

export async function get(key: string): Promise<any> {
    if (!db) {
        db = await openDB();
    }
    const store = db.transaction(DATA_STORE).objectStore(DATA_STORE);
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
export async function add(data: Exercise): Promise<any> {
    if (!db) {
        db = await openDB();
    }
    const store = db
        .transaction(DATA_STORE, "readwrite")
        .objectStore(DATA_STORE);
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
export async function put(key: string, data: Exercise): Promise<any> {
    if (!db) {
        db = await openDB();
    }
    const store = db
        .transaction(DATA_STORE, "readwrite")
        .objectStore(DATA_STORE);
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
export async function remove(key: string): Promise<void> {
    if (!db) {
        db = await openDB();
    }
    const store = db
        .transaction(DATA_STORE, "readwrite")
        .objectStore(DATA_STORE);
    const req = store.delete(key);
    return new Promise(function (resolve, reject) {
        req.onsuccess = () => {
            resolve();
        };
        req.onerror = () => {
            reject("Error deleteing data:");
        };
    });
}

/* ======================== *\
    #Helpers
\* ======================== */

function openDB(): Promise<IDBDatabase> {
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
            db.createObjectStore(DATA_STORE, { autoIncrement: true });
        };
    });
}
