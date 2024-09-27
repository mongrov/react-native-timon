import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';
// Import the native module. On web, it will be resolved to TestRustModule.web.ts
// and on native platforms to TestRustModule.ts
import TestRustModule from './src/TestRustModule';
import { ChangeEventPayload } from './src/TestRustModule.types';
import { parseJson } from './src/utils';

const BASE_PATH = "/data/data/com.sodium.reactnativetimon/files/timon/data";

const initTimon = (storage_path: string) => {
  try {
    // TestRustModule.init_timon(storage_path); TODO: uncomment when we expose init_timon from rust 
    return TestRustModule;
  } catch(error) {
    console.error("Error initializing timon:", error);
    return null;
  }
}

const Timon = initTimon(BASE_PATH);

export async function datafusionQuerier(dateRange: { start: string, end: string }, sqlQuery: string) {
  let errorString;
  try {
    const result = await Timon.datafusionQuerier(BASE_PATH, dateRange, sqlQuery);
    return parseJson(result);
  } catch (error) {
    console.error("Error calling datafusionQuerier: ", error, errorString);
  }
}

export function writeJsonToParquet(tableName: string, jsonData: Array<object>) {
  try {
    const insertionDate = new Date().toISOString().split('T')[0];
    const filePath = BASE_PATH + `/${tableName}_${insertionDate}.parquet`;
    Timon.writeJsonToParquet(filePath, JSON.stringify(jsonData))
  } catch(error) {
    console.error("Error calling writeJsonToParquet: ", error);
  }
}

const emitter = new EventEmitter(Timon);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ChangeEventPayload };
