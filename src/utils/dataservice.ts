import { IDBPDatabase, openDB } from "idb";
import { Exercise } from "./exerciseService";

/* ======================== *\
    #Data Service
\* ======================== */

export async function get(key: IDBValidKey | IDBKeyRange): Promise<Exercise> {
    const store = await getDBStore();
    return await store.get(key);
}

export async function getAll(): Promise<Exercise[]> {
    const store = await getDBStore();
    if (store.getAll) {
        return await store.getAll();
    } else {
        console.error(`Error getting All entries`);
        return [];
    }
}
export async function add(data: Exercise): Promise<IDBValidKey> {
    const store = await getDBStore("readwrite");
    if (store.add) {
        return await store.add(data);
    } else {
        console.error(`Error adding data: ${JSON.stringify(data)}`);
        return -1;
    }
}

export async function put(data: Exercise): Promise<IDBValidKey> {
    const store = await getDBStore("readwrite");
    if (store.put) {
        return await store.put(data);
    } else {
        console.error(`Error updating data: ${JSON.stringify(data)}`);
        return -1;
    }
}

export async function remove(key: IDBValidKey): Promise<void> {
    const store = await getDBStore("readwrite");
    if (store.delete) {
        await store.delete(key);
    } else {
        console.error(`Error adding data: ${JSON.stringify(key)}`);
    }
}

export async function clear(): Promise<void> {
    const store = await getDBStore("readwrite");
    if (store.clear) {
        await store.clear();
    } else {
        console.error(`Error clearing store`);
    }
}

/* ======================== *\
    #Helpers
\* ======================== */

let db: IDBPDatabase<Exercise> | null = null;
async function getDBStore(mode: IDBTransactionMode = "readonly") {
    const DATABASE = "one-set";
    const STORE = "exerciseHistory";
    if (!db) {
        db = await openDB(DATABASE, 2, {
            upgrade(db: IDBPDatabase<Exercise>, oldversion: number) {
                if (oldversion === 1) {
                    db.deleteObjectStore(STORE);
                }

                db.createObjectStore(STORE, {
                    autoIncrement: true,
                    keyPath: "id",
                });
            },
        });
    }
    return db.transaction(STORE, mode).objectStore(STORE);
}
