import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';
// Import the native module. On web, it will be resolved to TestRustModule.web.ts
// and on native platforms to TestRustModule.ts
import TestRustModule from './src/TestRustModule';
import { ChangeEventPayload } from './src/TestRustModule.types';
import { extractTableName, getFilePath, parseJson } from './src/utils';

export async function datafusionQuerier(sqlQuery: string) {
  let errorString;
  try {
    const tableName = extractTableName(sqlQuery);
    const filePath = getFilePath(tableName);
    const result = await TestRustModule.datafusionQuerier(filePath, tableName, sqlQuery);
    return parseJson(result);
  } catch (error) {
    console.error("Error calling datafusionQuerier: ", error, errorString);
  }
}

export function writeJsonToParquet(tableName: string, jsonData: Array<object>) {
  try {
    const filePath = getFilePath(tableName);
    TestRustModule.writeJsonToParquet(filePath, JSON.stringify(jsonData))
  } catch(error) {
    console.error("Error calling writeJsonToParquet: ", error);
  }
}

const emitter = new EventEmitter(TestRustModule ?? NativeModulesProxy.TestRustModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ChangeEventPayload };
