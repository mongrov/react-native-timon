import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to TestRustModule.web.ts
// and on native platforms to TestRustModule.ts
import TestRustModule from './src/TestRustModule';
import { ChangeEventPayload } from './src/TestRustModule.types';

export async function timonInit() {
  return await TestRustModule.timonInit()
}

export function readParquetFile(filePath: String) {
  return TestRustModule.readParquetFile(filePath)
}

const emitter = new EventEmitter(TestRustModule ?? NativeModulesProxy.TestRustModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ChangeEventPayload };
