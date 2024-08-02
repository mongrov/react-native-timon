import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';
// Import the native module. On web, it will be resolved to TestRustModule.web.ts
// and on native platforms to TestRustModule.ts
import TestRustModule from './src/TestRustModule';
import { ChangeEventPayload } from './src/TestRustModule.types';
import { extractTableName, getFilePath, getFilesPath, generateDatesList, parseJson } from './src/utils';

export async function datafusionQuerier(sqlQuery: string, range?: { from: string, to: string }) {
  let errorString;
  try {
    const filesPaths = range ? generateDatesList(range.from, range.to) : [new Date().toISOString().split('T')[0]];
    const tableName = extractTableName(sqlQuery);
    const filesPathList = getFilesPath(tableName, filesPaths);
    const result = await TestRustModule.datafusionQuerier(filesPathList, tableName, sqlQuery);
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
