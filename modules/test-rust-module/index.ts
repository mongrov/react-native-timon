import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to TestRustModule.web.ts
// and on native platforms to TestRustModule.ts
import TestRustModule from './src/TestRustModule';
import { ChangeEventPayload } from './src/TestRustModule.types';

// Get the native constant value.
export const PI = TestRustModule.PI;

export function hello(): string {
  return TestRustModule.hello();
}

export function add(num1: number, num2: number) {
  return TestRustModule.add(num1, num2)
}

export async function setValueAsync(value: string) {
  return await TestRustModule.setValueAsync(value);
}

const emitter = new EventEmitter(TestRustModule ?? NativeModulesProxy.TestRustModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ChangeEventPayload };
