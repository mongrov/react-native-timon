import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';
// Import the native module. On web, it will be resolved to TestRustModule.web.ts
// and on native platforms to TestRustModule.ts
import TestRustModule from './src/TestRustModule';
import { ChangeEventPayload } from './src/TestRustModule.types';
import { parseJson } from './src/utils';

// ******************************** File Storage ********************************
const BASE_PATH = "/data/data/com.sodium.reactnativetimon/files/timon";

const initTimon = (storage_path: string) => {
  try {
    let result = TestRustModule.initTimon(storage_path);
    console.info("initTimon: ", result);
    return TestRustModule;
  } catch(error) {
    console.error("Error initializing timon:", error);
    return null;
  }
}

const Timon = initTimon(BASE_PATH);

export const createDatabase = (dbName: string) => {
  try {
    const result = Timon.createDatabase(dbName);
    return parseJson(result);
  } catch(error) {
    console.error("Error calling createDatabase: ", error);
  }
}

export const createTable = (dbName: string, tableName: string) => {
  try {
    const result = Timon.createTable(dbName, tableName);
    return parseJson(result);
  } catch(error) {
    console.error("Error calling createTable: ", error);
  }
}

export const listDatabases = () => {
  try {
    const result = Timon.listDatabases();
    const jsonString = parseJson(result)['json_string'];
    return parseJson(jsonString);
  } catch(error) {
    console.error("Error calling listDatabases: ", error);
  }
}

export const listTables = (dbName: string) => {
  try {
    const result = Timon.listTables(dbName);
    const jsonString = parseJson(result)['json_string'];
    return parseJson(jsonString);
  } catch(error) {
    console.error("Error calling listTables: ", error);
  }
}

export const deleteDatabase = (dbName: string) => {
  try {
    let result = Timon.deleteDatabase(dbName);
    return parseJson(result);
  } catch(error) {
    console.error("Error calling deleteDatabase: ", error);
  }
}

export const deleteTable = (dbName: string, tableName: string) => {
  try {
    let result = Timon.deleteTable(dbName, tableName);
    return parseJson(result);
  } catch(error) {
    console.error("Error calling deleteTable: ", error);
  }
}

export const query = async (dbName: string, dateRange: { start: string, end: string }, sqlQuery: string) => {
  try {
    const result = await Timon.query(dbName, dateRange, sqlQuery);
    const jsonString = parseJson(result)['json_string'];
    return parseJson(jsonString);
  } catch (error) {
    console.error("Error calling query: ", error);
  }
}

export const insert = (dbName: string, tableName: string, jsonData: Array<object>) => {
  try {
    const result = Timon.insert(dbName, tableName, JSON.stringify(jsonData));
    return parseJson(result);
  } catch(error) {
    console.error("Error calling insert: ", error);
  }
}

// ******************************** S3 Compatible Storage ********************************
const BUCKET_ENDPOINT = "http://localhost:9000";
const BUCKET_NAME = "timon";
const ACCESS_KEY_ID = "ahmed";
const SECRET_ACCESS_KEY = "ahmed1234";

export const initBucket = (bucket_endpoint: string, bucket_name: string, access_key_id: string, secret_access_key: string) => {
  try {
    const result = Timon.initBucket(bucket_endpoint, bucket_name, access_key_id, secret_access_key);
    console.info("initBucket: ", result);
    return result;
  } catch(error) {
    console.error("Error calling initBucket: ", error);
  }
}

initBucket(BUCKET_ENDPOINT, BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY);

export const queryBucket = async (dateRange: { start: string, end: string }, sqlQuery: string) => {
  try {
    const result = await Timon.queryBucket(dateRange, sqlQuery);
    const jsonString = parseJson(result)['json_string'];
    return parseJson(jsonString);
  } catch (error) {
    console.error("Error calling queryBucket: ", error);
  }
}

export const sinkMonthlyParquet = async (dbName: String, tableName: String) => {
  try {
    const result = await Timon.sinkMonthlyParquet(dbName, tableName);
    return parseJson(result);
  } catch(error) {
    console.error("Error calling sinkMonthlyParquet: ", error);
  }
}

const emitter = new EventEmitter(Timon);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ChangeEventPayload };
